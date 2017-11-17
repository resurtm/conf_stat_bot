const config = require('../config');

function tokenMiddleware(req, res, next) {
  if (config.verboseLogging) {
    console.log('\nrequest parameters:');
    console.log('-------------------');
    console.log(req.params);
    console.log('-------------------\n');

    console.log('\nrequest query parameters:');
    console.log('-------------------------');
    console.log(req.query);
    console.log('-------------------------\n');
  }

  if (!('token' in req.query) || req.query.token !== config.telegram.webhookAccessToken) {
    res.status(403).send('invalid access token has been provided');
    next('invalid access token has been provided');
    return;
  }

  if (config.verboseLogging) {
    console.log('\ncontent received:');
    console.log('-----------------');
    console.log(req.body);
    console.log('-----------------\n');
  }

  next();
}

module.exports = tokenMiddleware;
