const _ = require('lodash');
const db = require('../db');
const elastic = require('../elastic');

async function chatMessageProcessorInternal(data, t) {
  const apiEntry = await db.ApiEntry.forge({
    content: data,
    timestamp: data.message.date,
  }).save(null, {transacting: t});

  const userMessage = await db.UserMessage.forge({
    tg_user_id: data.message.from.id,
    tg_chat_id: data.message.chat.id,
    api_entry_id: apiEntry.id,
    timestamp: data.message.date,
  }).save(null, {transacting: t});

  await elastic.reindexUserMessage(_.pick(userMessage.attributes, ['tg_user_id', 'tg_chat_id', 'timestamp']));
}

async function chatMessageProcessor(data) {
  await db.bookshelf.transaction(t => chatMessageProcessorInternal(data, t));
}

module.exports = chatMessageProcessor;
