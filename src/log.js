const path = require('path');
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf} = format;

const fmt = printf(info => {
  return info.timestamp + ' ' + info.level.toUpperCase() + ': ' + info.message;
});

const logger = createLogger({
  transports: [
    new transports.File({
      filename: path.resolve(__dirname, '../logs/error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.resolve(__dirname, '../logs/info.log'),
      level: 'info',
    }),
  ],
  format: combine(timestamp(), fmt),
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console());
}

module.exports = logger;
