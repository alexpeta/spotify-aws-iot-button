var consoleLogger = require('../Utils/ConsoleLogger');

function BuildLogger(correlationId){
  return new consoleLogger.ConsoleLogger(correlationId);
}
module.exports = {
    BuildLogger: BuildLogger
}