const telegram = require('../telegram');
const tools = require('../tools');

async function linkCommandProcessor(data) {
  await telegram.sendMessage({
    chatId: data.message.chat.id,
    messageText: tools.displayName(data.message.from) + ', sorry the feature has not been implemented yet 😢',
    replyToMessageId: data.message.message_id,
  });
}

module.exports = linkCommandProcessor;
