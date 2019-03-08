var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var spotifyManager = require('../Managers/SpotifyManager');
var spotifyTokenManager = require('../Managers/SpotifyTokenManager');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/next', function(request, response) {
    spotifyTokenManager.GetTokenAsync()
        .then(tokenModel => spotifyManager.NextTrackAsync(tokenModel))
        .then(response.status(200).send({message:'next track change triggered'}))
        .catch(err => response.status(500).send({message:err.message, stack:err.stack}));
});

router.post('/previous', function(request, response){
    spotifyTokenManager.GetTokenAsync()
    .then(tokenModel => spotifyManager.PreviousTrackAsync(tokenModel))
    .then(response.status(200).send({message:'previous track change triggered'}))
    .catch(err => response.status(500).send({message:err.message, stack:err.stack}));
});

router.post('/pause', function(request, response){
    spotifyTokenManager.GetTokenAsync()
    .then(tokenModel => spotifyManager.PauseAsync(tokenModel))
    .then(response.status(200).send({message:'pause triggered'}))
    .catch(err => response.status(500).send({message:err.message, stack:err.stack}));
});


module.exports = router;