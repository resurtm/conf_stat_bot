const _ = require('lodash');
const path = require('path');
const config = require('./config');
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf} = format;

const logger = createLogger({
  transports: [
    new transports.File({
      filename: path.resolve(__dirname, '../logs/error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.resolve(__dirname, '../logs/common.log'),
      level: config.verboseLogging ? 'verbose' : 'info',
    }),
  ],
  format: combine(
    timestamp(),
    printf(info => info.timestamp + ' ' + info.level.toUpperCase() + ': ' + info.message),
  ),
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    level: config.verboseLogging ? 'verbose' : 'info',
  }));
}

let exitFlushes = 0;
_.forEach(logger.transports, v => {
  v.on('logged', data => {
    if (data.message === 'exit') {
      exitFlushes++;
    }
    if (exitFlushes === logger.transports.length) {
      process.exit(1);
    }
  });
});

module.exports = logger;
