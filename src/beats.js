const _ = require('lodash');
const config = require('./config');
const db = require('./db');
const tools = require('./tools');
const log = require('./log');

async function cleanRateLimits() {
  const rateLimits = await db.RateLimit
    .where('timestamp', '<', tools.timestamp() - config.oneCommandPerSeconds)
    .fetchAll();
  _.forEach(rateLimits.models, rateLimit => {
    log.verbose('cleaning rate limit ' + rateLimit.id);
    rateLimit.destroy();
  });
}

function register() {
  log.verbose('registering beats');
  setInterval(cleanRateLimits, 2000);
}

module.exports = register;
