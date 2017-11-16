const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const telegram = require('./telegram');
const ngrok = require('./ngrok');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

telegram.deleteWebhook().then(res => {
  if (!res) {
    return Promise.reject(new Error('unable to remove existing webhook'))
  }
}).then(() => {
  return ngrok.findHTTPSTunnel();
}).then(tunnel => {
  return telegram.setWebhook(`${tunnel.public_url}/webhook/${config.telegram.webhookAccessToken}/`);
}).then(res => {
  if (!res) {
    return Promise.reject(new Error('unable to set new webhook'))
  }
}).then(() => {
  return telegram.getWebhookInfo();
}).then(res => {
  console.log(`webhook URL set to: ${res.url}`);
  app.listen(8900, () => {
    if (config.verboseLogging) {
      console.log('app listening on 8900')
    }
  });
}).catch(err => {
  console.log(err);
});

app.post('/webhook/:token', (req, res) => {
  if (!('token' in req.params) || req.params.token !== config.telegram.webhookAccessToken) {
    res.status(403).send('invalid access token has been provided');
    return;
  }

  if (config.verboseLogging) {
    console.log('\ncontent received:');
    console.log('-----------------');
    console.log(req.body);
    console.log('-----------------\n');
  }

  db.ApiEntry.forge({content: req.body}).save();

  res.send('conf_stat_bot');
});
