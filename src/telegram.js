const axios = require('axios');
const camelCaseKeys = require('camelcase-keys');
const config = require('./config');
const log = require('./log');

const apiUrl = config.telegram.apiUrl.replace('{{ACCESS_TOKEN}}', config.telegram.botToken);

async function simpleRequest(action, method = 'get') {
  if (action === 'deleteWebhook') {
    return false;
  }
  const url = apiUrl + action;
  const resp = await axios({method, url});
  log.verbose('data from ' + action + ' ' + JSON.stringify(resp.data, null, 2));
  if (!resp.data.ok) {
    const err = 'response data from ' + action + ' is not ok';
    log.error(err);
    throw new Error(err);
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

function getMe() {
  return simpleRequest('getMe');
}

async function setWebhook(webhookUrl) {
  if (!await dataRequest('setWebhook', {url: webhookUrl})) {
    throw new Error('cannot set new webhook');
  }
}

async function deleteWebhook() {
  if (!await simpleRequest('deleteWebhook', 'post')) {
    const err = 'cannot remove existing webhook';
    log.error(err);
    throw new Error(err);
  }
}

async function getWebhookInfo() {
  const res = await simpleRequest('getWebhookInfo');
  if (config.verboseLogging) {
    console.log('webhook info: ' + JSON.stringify(res, null, 2));
  }
  return res;
}

async function sendMessage({chatId, messageText, replyToMessageId, parseMode}) {
  if (typeof chatId === 'undefined' || typeof messageText === 'undefined') {
    throw new Error('"chatId" and "messageText" parameters both must be set');
  }
  const params = {chat_id: chatId, text: messageText};
  if (typeof replyToMessageId !== 'undefined') {
    params.reply_to_message_id = replyToMessageId;
  }
  if (typeof parseMode !== 'undefined') {
    params.parse_mode = parseMode;
  }
  return camelCaseKeys(await dataRequest('sendMessage', params));
}

module.exports = {simpleRequest, dataRequest, getMe, setWebhook, deleteWebhook, getWebhookInfo, sendMessage};
