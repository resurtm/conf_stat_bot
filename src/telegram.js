const axios = require('axios');
const config = require('./config');

const telegramURL = config.telegram.apiURL.replace('{{ACCESS_TOKEN}}', config.telegram.botAccessToken);

function simpleRequest(action, method = 'get') {
  return axios({
    method: method,
    url: telegramURL + action,
  })
    .then(resp => {
      if (config.verboseLogging) {
        console.log('common request response data:');
        console.log(JSON.stringify(resp.data, null, 2));
      }
      if (!resp.data.ok) {
        return Promise.reject(new Error('response data is not ok'));
      }
      return resp.data.result;
    });
}

function dataRequest(methodName, data) {
  return axios.post(
    telegramURL + methodName,
    JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}},
  ).then(resp => resp.data.result);
}

function getMe() {
  return simpleRequest('getMe');
}

function setWebhook(webhookURL) {
  return dataRequest('setWebhook', {url: webhookURL});
}

function getWebhookInfo() {
  return simpleRequest('getWebhookInfo').then(res => {
    if (config.verboseLogging) {
      console.log('webhook info:');
      console.log(JSON.stringify(res, null, 2));
    }
    return res;
  });
}

function deleteWebhook() {
  return simpleRequest('deleteWebhook', 'post');
}

function sendMessage({chatID, messageText, replyToMessageID, parseMode}) {
  if (typeof chatID === 'undefined' || typeof messageText === 'undefined') {
    return Promise.reject('chatID and messageText parameters both must be set');
  }
  const data = {
    chat_id: parseInt(chatID, 10),
    text: messageText,
  };
  if (typeof replyToMessageID !== 'undefined') {
    data.reply_to_message_id = parseInt(replyToMessageID, 10);
  }
  if (typeof parseMode !== 'undefined') {
    data.parse_mode = parseMode;
  }
  return dataRequest('sendMessage', data);
}

module.exports = {
  getMe,
  setWebhook,
  getWebhookInfo,
  deleteWebhook,
  sendMessage,
};
