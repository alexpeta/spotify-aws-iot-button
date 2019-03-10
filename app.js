const dotenv = require("dotenv");
dotenv.config();

var port = process.env.PORT || 3000;

var express = require("express");
var helmet = require("helmet");
var app = express();
app.use(helmet());

var SpotifyController = require("./Controllers/SpotifyController");
var HealthController = require("./Controllers/HealthController");

app.use(
  helmet.featurePolicy({
    features: {
      fullscreen: ["'self'"],
      vibrate: ["'none'"],
      payment: ["'none'"],
      syncXhr: ["'none'"]
    }
  })
);
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: "same-origin" }));

app.use("/api/spotify", SpotifyController);
app.use("/api/health", HealthController);

var server = app.listen(port, function() {
  console.log("Express server is up and running 🚀 on port " + port);
});
