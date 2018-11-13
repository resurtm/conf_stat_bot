const debug = require('debug')('app:main');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

process.on('unhandledRejection', (err) => {
    throw err;
});

const app = express();
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => res.send('conf_stat_bot - bot backend'));

const APP_PORT = process.env.APP_PORT || 3000;
const APP_HOST = process.env.APP_HOST || 'localhost';
app.listen(APP_PORT, APP_HOST, () => debug(`listening on ${APP_HOST}:${APP_PORT}`));
