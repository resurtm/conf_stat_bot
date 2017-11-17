const config = require('../config');
const chatMessageProcessor = require('./chatMessageProcessor');
const statCommandProcessor = require('./statCommandProcessor');
const linkCommandProcessor = require('./linkCommandProcessor');

function webhookHandler(req, res) {
  let processor = chatMessageProcessor;
  const text = req.body.message.text;
  if (text === '/stat' || text === '/stat@' + config.telegram.botUsername) {
    processor = statCommandProcessor;
  } else if (text === '/link' || text === '/link@' + config.telegram.botUsername) {
    processor = linkCommandProcessor;
  }
  processor(req.body).then(() => res.sendStatus(200)).catch(() => res.sendStatus(500));
}

module.exports = webhookHandler;
