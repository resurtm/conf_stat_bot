const _ = require('lodash');
const config = require('../config');
const chatMessageProcessor = require('./chatMessageProcessor');
const statCommandProcessor = require('./statCommandProcessor');
const linkCommandProcessor = require('./linkCommandProcessor');

function webhookHandler(req, res) {
  const text = _.get(req, 'body.message.text', null);
  if (!text) {
    res.sendStatus(200);
    return;
  }
  let processor = chatMessageProcessor;
  if (text === '/stat' || text === '/stat@' + config.telegram.botUsername) {
    processor = statCommandProcessor;
  } else if (text === '/link' || text === '/link@' + config.telegram.botUsername) {
    processor = linkCommandProcessor;
  }
  processor(req.body)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
}

module.exports = webhookHandler;
