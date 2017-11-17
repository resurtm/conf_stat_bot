const _ = require('lodash');
const db = require('../db');
const elastic = require('../elastic');

function saveData(t, data) {
  let relatedUser = null;
  return db.User.where('tg_user_id', data.message.from.id.toString()).fetch({transacting: t})
    .then(user => {
      const params = {
        tg_user_id: data.message.from.id.toString(),
        first_name: _.get(data.message.from, 'first_name', ''),
        last_name: _.get(data.message.from, 'last_name', ''),
        user_name: _.get(data.message.from, 'username', ''),
      };
      return user
        ? user.save(params, {method: 'update', patch: true, transacting: t})
        : db.User.forge(params).save(null, {transacting: t});
    })
    .then(user => {
      relatedUser = user;
      return db.ApiEntry.forge({
        content: data,
        timestamp: parseInt(data.message.date, 10),
      }).save(null, {transacting: t});
    })
    .then(apiEntry => {
      return db.UserMessage.forge({
        tg_user_id: data.message.from.id.toString(),
        tg_chat_id: data.message.chat.id.toString(),
        api_entry_id: parseInt(apiEntry.id, 10),
        user_id: parseInt(relatedUser.id, 10),
        timestamp: parseInt(data.message.date, 10),
      }).save(null, {transacting: t});
    });
}

function chatMessageProcessor(data) {
  return db.bookshelf
    .transaction(t => saveData(t, data))
    .then(userMessage => elastic.reindexUserMessage(
      _.pick(userMessage.attributes, ['tg_user_id', 'tg_chat_id', 'timestamp']),
    ));
}

module.exports = chatMessageProcessor;
