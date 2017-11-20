const _ = require('lodash');
const axios = require('axios');
const config = require('./config');
const log = require('./log');

async function getTunnels() {
  const resp = await axios.get(config.ngrok.apiUrl + 'tunnels');
  log.verbose('data from ngrok "tunnels" ' + JSON.stringify(resp.data, null, 2));
  return resp.data.tunnels;
}

async function findHttpsTunnel() {
  const tun = _.find(await getTunnels(), tun => tun.proto === 'https');
  if (typeof tun === 'undefined') {
    const err = 'cannot find "https://" tunnel from ngrok';
    log.error(err);
    throw new Error(err);
  }
  return tun;
}

module.exports = {getTunnels, findHttpsTunnel};
