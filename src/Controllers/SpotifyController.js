var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var constants = require("../Utils/Constants");

var spotifyManager = require("../Managers/SpotifyManager");
var spotifyTokenManager = require("../Managers/SpotifyTokenManager");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(function(req, res, next) {
  if (!req.headers[constants.HEADERS_X_CORRELATION_ID]) {
    res.status(400).send({ error: "Missing required header information" });
    return next("router");
  }
  next();
});

router.post("/next", function(request, response) {
  spotifyTokenManager
    .GetNewTokenAsync()
    .then(tokenModel => {
      return spotifyManager.NextTrackAsync(tokenModel);
    })
    .then(managerResults => {
      return response.status(200).send({ message: managerResults });
    })
    .catch(err => {
      return response.status(500).send(err);
    });
});

router.post("/previous", function(request, response) {
  spotifyTokenManager
    .GetNewTokenAsync()
    .then(tokenModel => spotifyManager.PreviousTrackAsync(tokenModel))
    .then(managerResults =>
      response.status(200).send({ message: managerResults })
    )
    .catch(err => response.status(500).send(err));
});

router.post("/pause", function(request, response) {
  spotifyTokenManager
    .GetNewTokenAsync()
    .then(tokenModel => spotifyManager.PauseAsync(tokenModel))
    .then(managerResults =>
      response.status(200).send({ message: managerResults })
    )
    .catch(err => response.status(500).send(err));
});

module.exports = router;
