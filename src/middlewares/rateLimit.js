const _ = require('lodash');
const db = require('../db');
const telegram = require('../telegram');
const tools = require('../tools');
const config = require('../config');

async function rateLimitMiddleware(req, res, next) {
  if (!tools.isCommand(req.body)) {
    next();
    return;
  }

  let rateLimit = await db.RateLimit.where('tg_user_id', req.body.message.from.id).fetch();
  if (!rateLimit) {
    let user = await db.User.where('tg_user_id', req.body.message.from.id).fetch();
    await db.RateLimit.forge({
      tg_user_id: req.body.message.from.id,
      user_id: user.id,
      timestamp: tools.timestamp(),
    }).save();

    next();
    return;
  }

  if (!rateLimit.attributes.second_try) {
    let messageText = tools.displayName(req.body.message.from) + ', no more one command in ';
    messageText += config.oneCommandPerSeconds + ' seconds';
    await telegram.sendMessage({
      chatId: req.body.message.chat.id,
      messageText,
      replyToMessageId: req.body.message.message_id,
    });
  }

  await rateLimit.save({
    second_try: true,
    third_try: rateLimit.attributes.second_try,
  }, {method: 'update', patch: true});

  res.sendStatus(200);
  next('commands rate limit exceeded');
}

module.exports = rateLimitMiddleware;
