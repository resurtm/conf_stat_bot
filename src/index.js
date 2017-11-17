const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const telegram = require('./telegram');
const ngrok = require('./ngrok');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use('/', routes);

telegram.deleteWebhook()
  .then(res => {
    if (!res) {
      return Promise.reject(new Error('unable to remove existing webhook'))
    }
  })
  .then(() => {
    return ngrok.findHTTPSTunnel();
  })
  .then(tunnel => {
    return telegram.setWebhook(tunnel.public_url + '/webhook/?token=' + config.telegram.webhookAccessToken);
  })
  .then(res => {
    if (!res) {
      return Promise.reject(new Error('unable to set new webhook'))
    }
  })
  .then(() => {
    return telegram.getWebhookInfo();
  })
  .then(res => {
    console.log(`webhook URL set to: ${res.url}`);
    app.listen(8900, () => {
      if (config.verboseLogging) console.log('app listening on 8900')
    });
  })
  .catch(err => {
    console.log(err);
  });
