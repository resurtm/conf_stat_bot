const config = require('./config');
const db = require('./db');
const tools = require('./tools');

async function cleanRateLimits() {
  const rateLimits = await db.RateLimit
    .where('timestamp', '<', tools.timestamp() - config.oneCommandPerSeconds)
    .fetchAll();
  for (let i in rateLimits.models) {
    const rateLimit = rateLimits.models[i];
    console.log('cleaning rate limit: ' + rateLimit.id);
    rateLimit.destroy();
  }
}

function register() {
  if (config.verboseLogging) {
    console.log('registering beats')
  }
  setInterval(cleanRateLimits, 1000);
}

module.exports = {register};
