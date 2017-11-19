const _ = require('lodash');
const telegram = require('../telegram');
const analytics = require('../analytics');

function statCommandProcessor(data) {
  // if (data.message.chat.id.toString() === '-1001030817764') {
  //   return Promise.resolve();
  // }
  return analytics.topPostersLast24Hours(data.message.chat.id)
    .then(res => {
      let text = '@' + data.message.from.username + ', here you are 😃\n\n';
      text += 'Top 10 posters in last 24 hours:\n\n';

      let index = 0;
      _.forEach(res, (v, k) => {
        index++;
        text += index + '. <b>' + v.displayName + '</b>, ' + v.messageCount + ' message(s)\n';
      });

      // telegram.sendMessage({
      //   chatID: data.message.chat.id,
      //   messageText: text,
      //   replyToMessageID: data.message.message_id,
      //   parseMode: 'HTML',
      // });
    });
}

module.exports = statCommandProcessor;
