const telegram = require('../telegram');

function linkCommandProcessor(data) {
  // if (data.message.chat.id.toString() === '-1001030817764') {
  //   return Promise.resolve();
  // }
  return telegram.sendMessage({
    chatID: data.message.chat.id,
    messageText: '@' + data.message.from.username + ', sorry this has not been implemented yet 😢',
    replyToMessageID: data.message.message_id,
  });
}

module.exports = linkCommandProcessor;
