var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var constants = require("../Utils/Constants");
var LoggerFactory = require("../Factories/LoggerFactory");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(function(req, res, next) {
  if (!req.headers[constants.HEADERS_X_CORRELATION_ID]) {
    res.status(400).send({ error: "Missing required header information" });
    return next("router");
  }
  next();
});

router.get("/ping", function(request, response) {
  var correlationId = request.headers[constants.HEADERS_X_CORRELATION_ID];
  var logger = LoggerFactory.BuildLogger(correlationId);
  logger.err("ping", "this is a test");
  response.status(200).send({ message: "pong", correlationId: correlationId });
});

module.exports = router;
