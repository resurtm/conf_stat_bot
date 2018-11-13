const debug = require('debug')('app:routes:webhook');

async function webhook(req, res) {
    debug(req.body);
    res.sendStatus(200);
}

module.exports = {
    webhook,
};
