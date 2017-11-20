const _ = require('lodash');
const config = require('../config');
const log = require('../log');

function ignoreChatsMiddleware(req, res, next) {
  const chatId = _.get(req, 'body.message.chat.id', null);

  if (chatId !== null && config.ignoreChats.indexOf(chatId) !== -1) {
    log.verbose(`ignoring chat with ID ${chatId}`);
    res.sendStatus(200);
    return;
  }

  log.verbose('ignore chats middleware - before');
  next();
  log.verbose('ignore chats middleware - after');
}

module.exports = ignoreChatsMiddleware;
