const axios = require('axios');
const config = require('./config');

const apiUrl = config.telegram.apiUrl.replace('{{ACCESS_TOKEN}}', config.webhook.finalToken);

const simpleRequest = (action, method = 'get') => axios({
  method: method,
  url: apiUrl + action,
}).then(resp => {
  if (config.verboseLogging) {
    console.log('simple request response:');
    console.log(JSON.stringify(resp.data, null, 2));
  }
  return resp.data.ok ? resp.data.result : Promise.reject(new Error('response data is not ok'))
});

const dataRequest = (methodName, data) => axios.post(
  apiUrl + methodName,
  JSON.stringify(data),
  {headers: {'Content-Type': 'application/json'}},
).then(resp => resp.data.result);

const getMe = () => simpleRequest('getMe');
const setWebhook = webhookUrl => dataRequest('setWebhook', {url: webhookUrl});
const deleteWebhook = () => simpleRequest('deleteWebhook', 'post');

const getWebhookInfo = () => simpleRequest('getWebhookInfo').then(res => {
  if (config.verboseLogging) {
    console.log('webhook info:');
    console.log(JSON.stringify(res, null, 2));
  }
  return res;
});

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
