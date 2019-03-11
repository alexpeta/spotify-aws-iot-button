const moment = require('moment');
const chalk = require('chalk');
const timeStampFormat = 'YYYY-MM-DD HH:mm:ss.SSSS';

const DEFAULT_LEVEL_COLOR = {
  'debug': '#a0a0a0', 
  'log': '#dbdbdb', 
  'info': '#55a6e8', 
  'warn': '#f7b737',
  'error': '#b21111'
}

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
