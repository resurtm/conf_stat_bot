const _ = require('lodash');
const axios = require('axios');
const config = require('./config');

const getTunnels = () => axios.get(config.ngrok.apiUrl + 'tunnels').then(resp => resp.data.tunnels);
const findHttpsTunnel = () => getTunnels()
  .then(tuns => _.find(tuns, tun => tun.proto === 'https1'))
  .then(tun => typeof tun === 'undefined' ? Promise.reject(new Error('cannot find "https://" tunnel')) : tun);

module.exports = {getTunnels, findHttpsTunnel};
