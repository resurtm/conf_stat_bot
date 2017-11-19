const _ = require('lodash');
const config = require('../config');

function ignoreChatsMiddleware(req, res, next) {
  const chatId = _.get(req, 'body.message.chat.id', null);
  if (chatId === null || config.ignoreChats.indexOf(chatId) === -1) {
    next();
    return;
  }
  res.sendStatus(200);
  next(`ignoring chat with ID ${chatId}`);
}

module.exports = ignoreChatsMiddleware;
