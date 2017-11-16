const fs = require('fs');
const path = require('path');

let config = null;

if (config === null) {
  const configPath = path.resolve(__dirname, '../config.json');
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (config.verboseLogging) {
    console.log('configuration file has been loaded');
  }
}

module.exports = config;
