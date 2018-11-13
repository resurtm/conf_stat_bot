const debug = require('debug')('app:telegram');
const axios = require('axios');

const {BOT_API_URL, BOT_API_TOKEN} = process.env;

async function request({ method = 'get', action, data = {} }) {
    const url = BOT_API_URL.replace('{{BOT_API_TOKEN}}', BOT_API_TOKEN) + action;
    const headers = {'Content-Type': 'application/json'};
    const resp = await axios({method, url, data, headers});

    debug(`data to telegram POST ${action}`);
    debug(JSON.stringify(data, null, 2));
    debug(`data from telegram POST ${action}`);
    debug(JSON.stringify(resp.data, null, 2));

    return resp.data;
}

function checkResult(res) {
    if (!res || !('ok' in res) || !res.ok || !('result' in res) || !res.result) {
        throw new Error('unable to set telegram webhook');
    }
}

async function setWebhook(url) {
    const res = await request({
        action: 'setWebhook',
        data: {url},
    });
    checkResult(res);
}

async function deleteWebhook() {
    const res = await request({
        method: 'post',
        action: 'deleteWebhook',
    });
    checkResult(res);
}

module.exports = {
    setWebhook,
    deleteWebhook,
};
