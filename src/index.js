const express = require('express');
const app = express();
const telegram = require('./telegram');

telegram.deleteWebhook().then(res => {
  console.log(1);
  console.log(res);
}).catch(err => {
  console.log(2);
  console.log(err);
});

/*telegram.setWebhook('https://b1048d37.ngrok.io/webhook-test/').then(res => {
  console.log(res);
  return telegram.getWebhookInfo();
}).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});*/

app.get('/', (req, res) => {
  res.send('conf_stat_bot')
});

app.listen(8900, () => {
  console.log('App listening on 8900')
});
