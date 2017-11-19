const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'));
config.webhook.finalToken = config.webhook.generateToken
  ? crypto.randomBytes(config.webhook.generatedTokenLength).toString('hex')
  : config.webhook.token;
if (config.verboseLogging) {
  console.log('configuration file has been loaded');
}

module.exports = config;
