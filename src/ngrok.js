const axios = require('axios');
const config = require('./config');

function getTunnels() {
  return axios.get(config.ngrok.apiURL + 'tunnels').then(resp => {
    return resp.data.tunnels;
  })
}

function findHTTPSTunnel() {
  return getTunnels().then(tunnels => {
    for (i in tunnels) {
      if (tunnels[i].proto === 'https') {
        return tunnels[i];
      }
    }
    return false;
  });
}

module.exports = {
  getTunnels,
  findHTTPSTunnel,
};
