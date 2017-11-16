const fs = require('fs');
const path = require('path');

let config = null;

if (config === null) {
  const configPath = path.resolve(__dirname, '../config.json');
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('Configuration file has been loaded');
}

module.exports = config;
