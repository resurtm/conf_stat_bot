const _ = require('lodash');
const axios = require('axios');
const config = require('./config');

async function getTunnels() {
  const resp = await axios.get(config.ngrok.apiUrl + 'tunnels');
  return resp.data.tunnels;
}

async function findHttpsTunnel() {
  const tun = _.find(await getTunnels(), tun => tun.proto === 'https');
  if (typeof tun === 'undefined') {
    throw new Error('cannot find "https://" tunnel');
  }
  return tun;
}

module.exports = {getTunnels, findHttpsTunnel};
