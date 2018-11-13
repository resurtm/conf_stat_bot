const debug = require('debug')('app:main');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {routes} = require('./routes');
const {setWebhook, deleteWebhook} = require('./telegram');

process.on('unhandledRejection', (err) => {
    throw err;
});

(function checkRequiredEnvVars() {
    const requiredEnvVars = [
        'APP_PORT',
        'APP_HOST',
        'BOT_API_TOKEN',
        'BOT_API_URL',
        'BOT_API_WEBHOOK_URL',
    ];
    const missingEnvVars = requiredEnvVars.filter(envVar => !(envVar in process.env));
    if (missingEnvVars.length > 0) {
        throw new Error(`the following required env vars are missing ${missingEnvVars.join(', ')}`);
    }
})();

(function launchApp() {
    const app = express();
    app.use(morgan('common'));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.get('/', async (req, res) => res.send('conf_stat_bot - bot backend'));
    app.use('/', routes);

    const {APP_PORT, APP_HOST, BOT_API_WEBHOOK_URL} = process.env;

    app.listen(APP_PORT, APP_HOST, async () => {
        debug(`listening on ${APP_HOST}:${APP_PORT}`);

        await deleteWebhook();
        await setWebhook(BOT_API_WEBHOOK_URL);
    });
})();
