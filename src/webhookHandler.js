const _ = require('lodash');
const config = require('./config');
const db = require('./db');
const elastic = require('./elastic');

function webhookHandler(req, res) {
  if (!('token' in req.params) || req.params.token !== config.telegram.webhookAccessToken) {
    res.status(403).send('invalid access token has been provided');
    return;
  }

  if (config.verboseLogging) {
    console.log('\ncontent received:');
    console.log('-----------------');
    console.log(req.body);
    console.log('-----------------\n');
  }

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
      elastic.reindexUserMessage(_.pick(userMessage.attributes, ['tg_user_id', 'tg_chat_id', 'timestamp']));
    })
    .catch(err => {
      console.log(err);
    });

  res.sendStatus(200);
}

module.exports = webhookHandler;
