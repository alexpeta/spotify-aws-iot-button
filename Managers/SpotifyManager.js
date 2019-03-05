var request = require('request');
var spotifyTokenManager = require('./SpotifyTokenManager');


function MakeHttpCallAsync(options)
{
    return new Promise(function(resolve,reject){

        request.post(options, function(err,httpResponse,body){
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
                }
                else
                {
                    reject(new Error(JSON.stringify(body)));
                }
            }
        });
    });
}


function NextTrackAsync(token)
{
    return new Promise(function(resolve,reject){
        let nextTrackHttpRequestOptions = {
            url:'https://api.spotify.com/v1/me/player/next',
            headers: {
                method: 'POST',
                'Acccept':'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token
            }
        };

        MakeHttpCallAsync(nextTrackHttpRequestOptions)
            .then(results => resolve(results))
            .catch(err => reject(err));
    });
}

function PreviousTrackAsync(token)
{
    return new Promise(function(resolve,reject){
        let nextTrackHttpRequestOptions = {
            url:'https://api.spotify.com/v1/me/player/previous',
            headers: {
                method: 'POST',
                'Acccept':'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token
            }
        };

        MakeHttpCallAsync(nextTrackHttpRequestOptions)
            .then(results => resolve(results))
            .catch(err => reject(err));
    });
}

module.exports = {
    NextTrackAsync: NextTrackAsync,
    PreviousTrackAsync: PreviousTrackAsync
}