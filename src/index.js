const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');
const telegram = require('./telegram');
const ngrok = require('./ngrok');

const app = express();
app.use(bodyParser.json());
app.use('/', routes);

telegram.deleteWebhook()
  .then(res => res ? res : Promise.reject(new Error('unable to remove existing webhook')))
  .then(() => ngrok.findHTTPSTunnel())
  .then(tun => telegram.setWebhook(`${tun.public_url}/webhook/?token=${config.webhook.finalToken}`))
  .then(res => res ? res : Promise.reject(new Error('unable to set new webhook')))
  .then(() => telegram.getWebhookInfo())
  .then(res => {
    if (config.verboseLogging) console.log(`webhook URL has been set to: ${res.url}`);
    app.listen(config.webhook.serverPort, config.webhook.serverHostname, () => {
      if (config.verboseLogging) console.log('app listening on 8900')
    });
  })
  .catch(err => console.log(err));
