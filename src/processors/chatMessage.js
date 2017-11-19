const _ = require('lodash');
const db = require('../db');
const elastic = require('../elastic');

async function chatMessageProcessorInternal(data, t) {
  let user = await db.User.where('tg_user_id', data.message.from.id).fetch({transacting: t});

  const userData = {
    tg_user_id: data.message.from.id,
    first_name: _.get(data, 'message.from.first_name', ''),
    last_name: _.get(data, 'message.from.last_name', ''),
    user_name: _.get(data, 'message.from.username', ''),
  };
  user = user
    ? await user.save(userData, {method: 'update', patch: true, transacting: t})
    : await db.User.forge(userData).save(null, {transacting: t});

  const apiEntry = await db.ApiEntry.forge({
    content: data,
    timestamp: data.message.date,
  }).save(null, {transacting: t});

  const userMessage = await db.UserMessage.forge({
    tg_user_id: data.message.from.id,
    tg_chat_id: data.message.chat.id,
    api_entry_id: apiEntry.id,
    user_id: user.id,
    timestamp: data.message.date,
  }).save(null, {transacting: t});

  await elastic.reindexUserMessage(_.pick(userMessage.attributes, ['tg_user_id', 'tg_chat_id', 'timestamp']));
}

async function chatMessageProcessor(data) {
  db.bookshelf.transaction(t => chatMessageProcessorInternal(data, t));
}

module.exports = chatMessageProcessor;
