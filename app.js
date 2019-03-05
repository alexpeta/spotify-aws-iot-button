const dotenv = require('dotenv');
dotenv.config();

var port = process.env.PORT || 3000;

var express = require('express');
var helmet = require('helmet');
var app = express();
app.use(helmet());

app.use(helmet.featurePolicy({
    features: {
      fullscreen: ["'self'"],
      vibrate: ["'none'"],
      payment: ["'none'"],
      syncXhr: ["'none'"]
    }
  }));
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

var SpotifyController = require('./Controllers/SpotifyController');
app.use('/api/spotify', SpotifyController);

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});