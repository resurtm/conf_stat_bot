const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');
const telegram = require('./telegram');
const ngrok = require('./ngrok');
const beats = require('./beats');
const log = require('./log');

const errorHandler = (type) => (err) => {
  log.error(type);
  log.error(err.stack);
  log.error('exit');
};
process.on('uncaughtException', errorHandler('uncaughtException'));
process.on('unhandledRejection', errorHandler('unhandledRejection'));

(async () => {
  await telegram.deleteWebhook();
  const tun = await ngrok.findHttpsTunnel();
  await telegram.setWebhook(`${tun.public_url}/webhook/?token=${config.webhook.finalToken}`);
  const webhookInfo = await telegram.getWebhookInfo();
  log.verbose('webhook URL has been set to: ' + webhookInfo.url);

  beats();

  const app = express();
  app.use(bodyParser.json());
  app.use('/', routes);
  app.listen(config.webhook.serverPort, config.webhook.serverHostname, () => {
    log.verbose(`bot app listening on ${config.webhook.serverHostname}:${config.webhook.serverPort}`);
  });
})();
