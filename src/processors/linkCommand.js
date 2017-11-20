const telegram = require('../telegram');
const ngrok = require('../ngrok');
const tools = require('../tools');

async function linkCommandProcessor(data) {
  const tun = await ngrok.findHttpsTunnel();
  const linkUrl = `${tun.public_url}/api/stats/?chatId=${data.message.chat.id}`;
  await telegram.sendMessage({
    chatId: data.message.chat.id,
    messageText: tools.displayName(data.message.from) + ', ' + linkUrl + '\n\n',
    replyToMessageId: data.message.message_id,
  });
}

module.exports = linkCommandProcessor;
