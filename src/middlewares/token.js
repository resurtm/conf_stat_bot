const config = require('../config');

function tokenMiddleware(req, res, next) {
  if (config.verboseLogging) {
    console.log('request params: ' + JSON.stringify(req.params, null, 2));
    console.log('request query params: ' + JSON.stringify(req.query, null, 2));
  }

  if (!('token' in req.query) || req.query.token !== config.webhook.finalToken) {
    res.sendStatus(403);
    next(new Error('invalid access token has been provided'));
    return;
  }

  if (config.verboseLogging) {
    console.log('content received: ' + JSON.stringify(req.body, null, 2));
  }

  next();
}

module.exports = tokenMiddleware;
