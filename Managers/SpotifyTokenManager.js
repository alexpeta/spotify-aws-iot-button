var request = require("request");
var stringUtils = require("../Utils/StringUtils");
var awsManager = require("../Managers/AwsManager");
var constants = require("../Utils/Constants");
var moment = require("moment");

function IsTokenExpired(awsTokenModel) {
  return (
    moment() >=
    moment(awsTokenModel.lastUpdated.S, "MM/DD/YY HH:MM:SS").add(
      parseInt(awsTokenModel.expiresIn.N),
      "seconds"
    ) +
      constants.TOKEN_DELTA_SECONDS
  );
}

function GetRefreshTokenAsync() {
  if (process.env.SPOTIFY_REFRESH_TOKEN) {
    return Promise.resolve(process.env.SPOTIFY_REFRESH_TOKEN);
  }

  return new Promise(function(resolve, reject) {
    awsManager
      .getAsync("refresh")
      .then(function(awsRefreshModel) {
        process.env.SPOTIFY_REFRESH_TOKEN = awsRefreshModel.token.S;
        resolve(awsRefreshModel.token.S);
      })
      .catch(function(awsError) {
        reject(awsError);
      });
  });
}

function MakeSpotifyHttpCallAsync(refreshToken) {
  return new Promise(function(resolve, reject) {
    let basicAuth = stringUtils.toBase64(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    );

    let requestOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        method: "PUT",
        Acccept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + basicAuth
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refreshToken
      }
    };

    request.post(requestOptions, function(err, httpResponse, body) {
      if (err) {
        console.log("Failed to connect to Spotify to refresh token :" + err);
        reject(err);
        return;
      }

      let model = JSON.parse(body);
      awsManager
        .upsertTokenAsync("access", model.access_token, model.expires_in)
        .then(ok => {
          console.log(
            "[SpotifyTokenManager][MakeSpotifyHttpCallAsync] success : " +
              JSON.stringify(model)
          );
          resolve(model);
        })
        .catch(awsError => {
          reject(awsError);
        });
    });
  });
}

function GetNewTokenAsync(forced) {
  return new Promise(function(resolve, reject) {
    if (forced) {
      GetRefreshTokenAsync()
        .then(refreshToken => MakeSpotifyHttpCallAsync(refreshToken))
        .then(newAwsModel => resolve(newAwsModel))
        .catch(function(awsError) {
          reject(awsError);
        });
    } else {
      awsManager
        .getAsync("access")
        .then(function(awsTokenModel) {
          if (awsTokenModel && !IsTokenExpired(awsTokenModel)) {
            return awsTokenModel;
          }
        })
        .then(oldAwsModel => GetRefreshTokenAsync())
        .then(refreshToken => MakeSpotifyHttpCallAsync(refreshToken))
        .then(newAwsModel => resolve(newAwsModel))
        .catch(function(awsError) {
          reject(awsError);
        });
    }
  });
}

module.exports = {
  GetNewTokenAsync: GetNewTokenAsync
};
