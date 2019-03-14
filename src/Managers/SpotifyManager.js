var request = require("request");
var spotifyTokenManager = require("./SpotifyTokenManager");

function MakeHttpCallAsync(options){
  return new Promise(function(resolve, reject) {
    request(options, function(err, httpResponse, body) {
      if (err) {
        console.error("Spotify error: " + err);
        reject(err);
        return;
      }

      if (Math.floor((httpResponse.statusCode / 100) === 2))
      {
        console.info("HTTP call successfull: " + JSON.stringify(options));
        resolve(body);
      }
      else
      {
        if (httpResponse.statusCode === 401) {
          logger.err("Token is expired, making refresh call " + body);
          spotifyTokenManager
            .GetNewTokenAsync(true)
            .then(result => {
              console.info("Refresh token successfull:" + result);
              resolve(result);
            })
            .catch(err => {
              console.error("Refresh token failed:" + err)
              reject(err);
            });
        } else {
          reject(new Error(body));
        }
      }
    });
  });
}

function NextTrackAsync(token) {
  return new Promise(function(resolve, reject) {
    let nextTrackHttpRequestOptions = {
      url: "https://api.spotify.com/v1/me/player/next",
      method: "POST",
      headers: {
        Acccept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.access_token
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

function PreviousTrackAsync(token) {
  return new Promise(function(resolve, reject) {
    let prevTrackHttpRequestOptions = {
      url: "https://api.spotify.com/v1/me/player/previous",
      method: "POST",
      headers: {
        Acccept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.access_token
      }
    };

    MakeHttpCallAsync(prevTrackHttpRequestOptions)
      .then(results => resolve(results))
      .catch(err => reject(err));
  });
}

function PauseAsync(token) {
  return new Promise(function(resolve, reject) {
    let pauseHttpRequestOptions = {
      url: "https://api.spotify.com/v1/me/player/pause",
      method: "PUT",
      headers: {
        Acccept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.access_token
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
};
