const axios = require('axios');
const config = require('./config');

const telegramURL = config.telegram.apiURL.replace('{{ACCESS_TOKEN}}', config.telegram.botAccessToken);

function commonRequest(action, method = 'get') {
  return axios({
    method: method,
    url: telegramURL + action,
  }).then(resp => {
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

function getMe() {
  return commonRequest('getMe');
}

function setWebhook(webhookURL) {
  return axios.post(
    `${telegramURL}setWebhook`,
    JSON.stringify({
      url: webhookURL,
    }),
    {
      headers: {'Content-Type': 'application/json'},
    },
  ).then(resp => {
    return resp.data.result;
  });
}

function getWebhookInfo() {
  return commonRequest('getWebhookInfo').then(res => {
    if (config.verboseLogging) {
      console.log('webhook info:');
      console.log(JSON.stringify(res, null, 2));
    }
    return res;
  });
}

function deleteWebhook() {
  return commonRequest('deleteWebhook', 'post');
}

module.exports = {
  getMe,
  setWebhook,
  getWebhookInfo,
  deleteWebhook,
};
