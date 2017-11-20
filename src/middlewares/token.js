const config = require('../config');
const log = require('../log');

function tokenMiddleware(req, res, next) {
  log.verbose('request params ' + JSON.stringify(req.params, null, 2));
  log.verbose('request query params ' + JSON.stringify(req.query, null, 2));

  if (!('token' in req.query) || req.query.token !== config.webhook.finalToken) {
    const err = 'invalid access token has been provided';
    log.error(err);
    next(err);
    return;
  }

  log.verbose('content received ' + JSON.stringify(req.body, null, 2));
  log.verbose('token middleware - before');
  next();
  log.verbose('token middleware - after');
}

module.exports = tokenMiddleware;
