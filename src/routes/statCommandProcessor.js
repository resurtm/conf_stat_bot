const telegram = require('../telegram');

function statCommandProcessor(data) {
  return telegram.sendMessage({
    chatID: data.message.chat.id,
    messageText: '@' + data.message.from.username + ', here you are 😃',
    replyToMessageID: data.message.message_id,
  });
}

module.exports = statCommandProcessor;
