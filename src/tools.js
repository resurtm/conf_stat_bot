const _ = require('lodash');

function displayName(data) {
  const userName = _.get(data, 'username', null);
  return userName === null || userName.length === 0 ? data.first_name : `@${userName}`;
}

module.exports = {displayName};
