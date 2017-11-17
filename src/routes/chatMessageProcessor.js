const _ = require('lodash');
const db = require('../db');
const elastic = require('../elastic');

function chatMessageProcessor(data) {
  return db.bookshelf
    .transaction(function (t) {
      return db.ApiEntry.forge({
        content: data,
        timestamp: parseInt(data.message.date, 10),
      }).save(null, {transacting: t})
        .then(apiEntry => {
          return db.UserMessage.forge({
            tg_user_id: data.message.from.id.toString(),
            tg_chat_id: data.message.chat.id.toString(),
            api_entry_id: parseInt(apiEntry.id, 10),
            timestamp: parseInt(data.message.date, 10),
          }).save(null, {transacting: t});
        });
    })
    .then(userMessage => {
      return elastic.reindexUserMessage(_.pick(userMessage.attributes, ['tg_user_id', 'tg_chat_id', 'timestamp']));
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = chatMessageProcessor;
