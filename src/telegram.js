const axios = require('axios');
const config = require('./config');
const log = require('./log');

const apiUrl = config.telegram.apiUrl.replace('{{ACCESS_TOKEN}}', config.telegram.botToken);

async function simpleRequest(action, method = 'get') {
  const url = apiUrl + action;
  const resp = await axios({method, url});
  log.verbose('data from telegram "' + action + '" ' + JSON.stringify(resp.data, null, 2));
  if (!resp.data.ok) {
    const err = 'response data from telegram ' + action + ' is not ok';
    log.error(err);
    throw new Error(err);
  }
  return resp.data.result;
}

async function dataRequest(action, data) {
  const url = apiUrl + action;
  const resp = await axios.post(url, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
  log.verbose('data to telegram "' + action + '" ' + JSON.stringify(data, null, 2));
  log.verbose('data from telegram "' + action + '" ' + JSON.stringify(resp.data, null, 2));
  return resp.data.result;
}

function getMe() {
  return simpleRequest('getMe');
}

async function setWebhook(webhookUrl) {
  if (!await dataRequest('setWebhook', {url: webhookUrl})) {
    const err = 'cannot set new webhook, to be set "' + webhookUrl + '"';
    log.error(err);
    throw new Error(err);
  }
}

async function deleteWebhook() {
  if (!await simpleRequest('deleteWebhook', 'post')) {
    const err = 'cannot remove existing webhook';
    log.error(err);
    throw new Error(err);
  }
}

function getWebhookInfo() {
  return simpleRequest('getWebhookInfo');
}

function sendMessage({chatId, messageText, replyToMessageId, parseMode}) {
  if (typeof chatId === 'undefined' || typeof messageText === 'undefined') {
    const err = '"chatId" and "messageText" parameters both must be set';
    log.error(err);
    throw new Error(err);
  }
  const params = {chat_id: chatId, text: messageText};
  if (typeof replyToMessageId !== 'undefined') {
    params.reply_to_message_id = replyToMessageId;
  }
  if (typeof parseMode !== 'undefined') {
    params.parse_mode = parseMode;
  }
  return dataRequest('sendMessage', params);
}

module.exports = {getMe, setWebhook, deleteWebhook, getWebhookInfo, sendMessage};
