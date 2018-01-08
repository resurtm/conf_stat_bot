const _ = require('lodash');
const telegram = require('../telegram');
const analytics = require('../analytics');
const tools = require('../tools');

async function statCommandProcessor(data) {
  const res = await analytics.topPostersLast24Hours(data.message.chat.id);

  let messageText = tools.displayName(data.message.from) + ', top 10 posters in the last 24 hours:\n\n';
  _.forEach(res, (v, k) => {
    messageText += (k + 1) + '. <b>' + v.displayName + '</b>, ' + v.messageCount + ' message(s)\n';
  });

  await telegram.sendMessage({
    chatId: data.message.chat.id,
    messageText,
    replyToMessageId: data.message.message_id,
    parseMode: 'HTML',
  });
}

module.exports = statCommandProcessor;
