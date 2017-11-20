const _ = require('lodash');
const config = require('../config');

function displayName(fromData) {
  const userName = _.get(fromData, 'username', null);
  return userName === null || userName.length === 0 ? fromData.first_name : `@${userName}`;
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
