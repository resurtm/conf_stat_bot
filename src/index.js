const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');
const telegram = require('./telegram');
const ngrok = require('./ngrok');

const app = express();
app.use(bodyParser.json());
app.use('/', routes);

void async function setup() {
  let webhookInfo;
  try {
    await telegram.deleteWebhook();
    const tun = await ngrok.findHttpsTunnel();
    await telegram.setWebhook(`${tun.public_url}/webhook/?token=${config.webhook.finalToken}`);
    webhookInfo = await telegram.getWebhookInfo();
  } catch (e) {
    console.error(e);
  }
  if (config.verboseLogging) {
    console.log(`webhook URL has been set to: ${webhookInfo.url}`);
  }
  app.listen(config.webhook.serverPort, config.webhook.serverHostname, () => {
    if (config.verboseLogging) {
      console.log(`app listening on ${config.webhook.serverHostname}:${config.webhook.serverPort}`);
    }
  });
}();
