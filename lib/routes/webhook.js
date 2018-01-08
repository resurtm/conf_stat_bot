const _ = require('lodash');
const config = require('../config');
const log = require('../log');
const chatMessageProcessor = require('../processors/chatMessage');
const statCommandProcessor = require('../processors/statCommand');
const linkCommandProcessor = require('../processors/linkCommand');

async function webhookHandler(req, res) {
  const text = _.get(req, 'body.message.text', null);
  if (!text) {
    log.verbose('request data does not have message text - ignoring');
    res.sendStatus(200);
    return;
  }

  let processor = chatMessageProcessor;
  if (text === '/stat' || text === '/stat@' + config.telegram.botUsername) {
    processor = statCommandProcessor;
  } else if (text === '/link' || text === '/link@' + config.telegram.botUsername) {
    processor = linkCommandProcessor;
  }

  try {
    await processor(req.body);
    res.sendStatus(200);
  } catch (e) {
    log.error(e);
    res.sendStatus(500);
  }
}

module.exports = webhookHandler;
