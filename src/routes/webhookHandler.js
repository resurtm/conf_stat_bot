const _ = require('lodash');
const db = require('../db');
const elastic = require('../elastic');

function webhookHandler(req, res) {
  db.bookshelf
    .transaction(function (t) {
      return db.ApiEntry.forge({
        content: req.body,
        timestamp: parseInt(req.body.message.date, 10),
      }).save(null, {transacting: t})
        .then(apiEntry => {
          return db.UserMessage.forge({
            tg_user_id: req.body.message.from.id.toString(),
            tg_chat_id: req.body.message.chat.id.toString(),
            api_entry_id: parseInt(apiEntry.id, 10),
            timestamp: parseInt(req.body.message.date, 10),
          }).save(null, {transacting: t});
        });
    })
    .then(userMessage => {
      return elastic.reindexUserMessage(_.pick(userMessage.attributes, ['tg_user_id', 'tg_chat_id', 'timestamp']));
    })
    .catch(err => {
      console.log(err);
    });

  res.sendStatus(200);
}

module.exports = webhookHandler;
