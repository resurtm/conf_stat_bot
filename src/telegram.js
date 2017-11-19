const axios = require('axios');
const config = require('./config');

const apiUrl = config.telegram.apiUrl.replace('{{ACCESS_TOKEN}}', config.telegram.botToken);

async function simpleRequest(action, method = 'get') {
  const resp = await axios({method, url: apiUrl + action});
  if (config.verboseLogging) {
    console.log('simple request response:');
    console.log(JSON.stringify(resp.data, null, 2));
  }
  if (!resp.data.result) {
    throw new Error('response data is not ok');
  }
  return resp.data.result;
}

async function dataRequest(methodName, data) {
  const resp = await axios.post(
    apiUrl + methodName,
    JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}},
  );
  return resp.data.result;
}

async function getMe() {
  return await simpleRequest('getMe');
}

async function setWebhook(webhookUrl) {
  if (!await dataRequest('setWebhook', {url: webhookUrl})) {
    throw new Error('cannot set new webhook');
  }
}

async function deleteWebhook() {
  if (!await simpleRequest('deleteWebhook', 'post')) {
    throw new Error('cannot remove existing webhook');
  }
}

async function getWebhookInfo() {
  const res = await simpleRequest('getWebhookInfo');
  if (config.verboseLogging) {
    console.log('webhook info:');
    console.log(JSON.stringify(res, null, 2));
  }
  return res;
}

const sendMessage = ({chatId, messageText, replyToMessageId, parseMode}) => {
  if (typeof chatId === 'undefined' || typeof messageText === 'undefined') {
    return Promise.reject('chatId and messageText parameters both must be set');
  }
  const data = {chat_id: chatId, text: messageText};
  if (typeof replyToMessageId !== 'undefined') {
    data.reply_to_message_id = replyToMessageId;
  }
  if (typeof parseMode !== 'undefined') {
    data.parse_mode = parseMode;
  }
  return dataRequest('sendMessage', data);
};

module.exports = {getMe, setWebhook, deleteWebhook, getWebhookInfo, sendMessage};
