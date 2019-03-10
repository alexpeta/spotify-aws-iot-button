const moment = require("moment");
const timeStampFormat = "YYYY-MM-DD HH:mm:ss.SSSS";

class ConsoleLogger {
  constructor(correlationId) {
    this.correlationId = correlationId;
  }
  err(method, message) {
    let logMessage = `${new moment().format(timeStampFormat)}|ERROR|${method}|${this.correlationId}|${message}`;
    console.log(logMessage);
  }
  info(method, message) {
    let logMessage = `${new moment().format(timeStampFormat)}|INFO|${method}|${this.correlationId}|${message}`;
    console.info(logMessage);
  }
}

module.exports = {
  ConsoleLogger: ConsoleLogger
};
