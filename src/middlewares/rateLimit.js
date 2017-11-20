const _ = require('lodash');
const db = require('../db');
const telegram = require('../telegram');
const tools = require('../tools');
const config = require('../config');
const log = require('../log');

async function rateLimitMiddleware(req, res, next) {
  const msg = _.get(req.body, 'message', null);
  if (msg === null || _.get(msg, 'from', null) === null || _.get(msg, 'chat', null) === null || !tools.isCommand(msg)) {
    next();
    return;
  }

  const rateLimit = await db.RateLimit.where('tg_user_id', msg.from.id).fetch();
  if (!rateLimit) {
    await db.RateLimit.forge({
      tg_user_id: msg.from.id,
      tg_chat_id: msg.chat.id,
      timestamp: tools.timestamp(),
    }).save();
    log.verbose(`new rate limit entry created for user ${msg.from.id} and chat ${msg.chat.id}`);

    next();
    return;
  }

  if (!rateLimit.attributes.second_try) {
    const messageText = tools.displayName(msg.from) + ', no more one command in ' +
      config.oneCommandPerSeconds + ' seconds';
    await telegram.sendMessage({
      chatId: msg.chat.id,
      messageText,
      replyToMessageId: msg.message_id,
    });
    log.verbose(`rate limit warning sent for user ${msg.from.id} and chat ${msg.chat.id}`);
  }

  await rateLimit.save({
    second_try: true,
    third_try: rateLimit.attributes.second_try,
  }, {method: 'update', patch: true});
  log.verbose(`rate limit exceeded point for user ${msg.from.id} and chat ${msg.chat.id}`);

  res.sendStatus(200);
}

module.exports = rateLimitMiddleware;
