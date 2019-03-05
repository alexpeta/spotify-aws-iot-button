var request = require('request');
var stringUtils = require('../Utils/StringUtils');
var awsManager = require('../Managers/AwsManager');
var constants = require('../Utils/Constants');
var moment = require('moment');

function IsTokenExpired(awsTokenModel)
{
    return moment() >= (moment(awsTokenModel.lastUpdated.S,'MM/DD/YY HH:MM:SS').add(parseInt(awsTokenModel.expiresIn.N),'seconds') + constants.TOKEN_DELTA_SECONDS);
}

function MakeSpotifyRefreshTokenRequestAsync()
{
    return new Promise(function(resolve,reject){
        let basicAuth = stringUtils.toBase64(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`);

        let requestOptions = {
            url:'https://accounts.spotify.com/api/token',
            headers: {
                method: 'PUT',
                'Acccept':'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + basicAuth
            },
            form: {
                'grant_type': 'refresh_token',
                'refresh_token': process.env.SPOTIFY_REFRESH_TOKEN
            }
        };
    
        request.post(requestOptions, function(err,httpResponse,body){
            if (err)
            {
                console.log('Failed to connect to Spotify to refresh token :' + err);
                reject(err);
                return;
            }

            let model = JSON.parse(body);
            awsManager.upsertTokenAsync('access', model.access_token, model.expires_in)
                .then(ok => resolve(model))
                .catch(awsError => reject(awsError));
        });
    });
}

function GetTokenAsync(forced)
{
    return new Promise(function(resolve, reject) {

        if(forced)
        {
            MakeSpotifyRefreshTokenRequestAsync()
                .then(newAwsModel => resolve(newAwsModel))
                .catch(function(awsError){
                    reject(awsError);
                });
        }
        else
        {
            awsManager.getAsync('access')
                .then(function(awsTokenModel){
                    if (awsTokenModel && !IsTokenExpired(awsTokenModel))
                    {
                        return awsTokenModel;
                    }
                })
                .then(oldAwsModel => MakeSpotifyRefreshTokenRequestAsync())
                .then(newAwsModel => resolve(newAwsModel))
                .catch(function(awsError){
                    reject(awsError);
                });
        }
    });
}

module.exports ={
    GetTokenAsync: GetTokenAsync
}