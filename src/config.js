const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let config = null;

if (config === null) {
  config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
  if (config.webhook.generateToken) {
    config.webhook.finalToken = crypto.randomBytes(config.webhook.generatedTokenLength).toString('hex');
  } else {
    config.webhook.finalToken = config.webhook.token;
  }
  if (config.verboseLogging) {
    console.log('configuration file has been loaded');
  }
}

module.exports = config;
