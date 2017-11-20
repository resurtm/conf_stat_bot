const _ = require('lodash');
const config = require('../config');

function displayName(fromData) {
  const userName = _.get(fromData, 'username', null);
  const firstName = fromData.first_name.length > 30 ? fromData.first_name.substring(0, 30) + '...' : fromData.first_name;
  return userName === null || userName.length === 0 ? firstName : `@${userName}`;
}

function isCommand(messageData) {
  const text = _.get(messageData, 'text', null);
  if (text === null || text.length === 0 || text[0] !== '/') {
    return false;
  }
  const commands = ['stat', 'link'];
  for (let i in commands) {
    const command = commands[i];
    if (text === `/${command}` || text === `/${command}@${config.telegram.botUsername}`) {
      return true;
    }
  }
  return false;
}

function timestamp() {
  return Math.round(+new Date() / 1000);
}

module.exports = {displayName, isCommand, timestamp};
