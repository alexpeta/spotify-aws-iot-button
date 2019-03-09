var request = require('request');
var spotifyTokenManager = require('./SpotifyTokenManager');


function MakeHttpCallAsync(options)
{
    return new Promise(function(resolve,reject){

        request(options, function(err,httpResponse,body){
            if (err)
            {
                console.log('[MakeHttpCallAsync][request.post] Error when calling Spotify\'s track api: ');
                reject(err);
                return;
            }

            if ((Math.floor(parseInt(httpResponse.statusCode,10) / 100)) === 4)
            {
                console.log('[MakeHttpCallAsync][request.post] spotify player error: ' + body);
                
                //401 = The access token has expired and we will refresh
                if (parseInt(httpResponse.statusCode,10) === 401)
                {
                    spotifyTokenManager.GetTokenAsync(forced)
                        .then(result => resolve(result))
                        .catch(err => reject(err));  
                    return;              
                }
                else
                {
                    reject(new Error(body));
                    return;
                }
            }
            resolve(body);
        });
    });
}


function NextTrackAsync(token)
{
    return new Promise(function(resolve,reject){
        let nextTrackHttpRequestOptions = {
            url:'https://api.spotify.com/v1/me/player/next',
            method: 'POST',
            headers: {
                'Acccept':'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token
            }
        };

        MakeHttpCallAsync(nextTrackHttpRequestOptions)
            .then(results => {
                resolve(results);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function PreviousTrackAsync(token)
{
    return new Promise(function(resolve,reject){
        let prevTrackHttpRequestOptions = {
            url:'https://api.spotify.com/v1/me/player/previous',
            method: 'POST',
            headers: {
                'Acccept':'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token
            }
        };

        MakeHttpCallAsync(prevTrackHttpRequestOptions)
            .then(results => resolve(results))
            .catch(err => reject(err));
    });
}

function PauseAsync(token)
{
    return new Promise(function(resolve,reject){
        let pauseHttpRequestOptions = {
            url:'https://api.spotify.com/v1/me/player/pause',
            method: 'PUT',
            headers: {
                'Acccept':'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token
            }
        };

        MakeHttpCallAsync(pauseHttpRequestOptions)
            .then(results => resolve(results))
            .catch(err => reject(err));
    });
}

module.exports = {
    NextTrackAsync: NextTrackAsync,
    PreviousTrackAsync: PreviousTrackAsync,
    PauseAsync: PauseAsync
}
