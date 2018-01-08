// @flow

const _ = require('lodash');
const config = require('../config');

function displayName(fromData: { username: ?string, first_name: string }): string {
  const userName: ?string = _.get(fromData, 'username', null);
  const firstName: string = fromData.first_name.length > 30
    ? fromData.first_name.substring(0, 30) + '...'
    : fromData.first_name;
  return userName == null || userName.length === 0 ? firstName : `@${userName}`;
}

function isCommand(messageData: { text: ?string }) {
  const text: ?string = _.get(messageData, 'text', null);
  if (text == null || text.length === 0 || text[0] !== '/') {
    return false;
  }
  const commands: Array<string> = ['stat', 'link'];
  for (const command: string of commands) {
    if (text === `/${command}` || text === `/${command}@${config.telegram.botUsername}`) {
      return true;
    }
  }
  return false;
}

function timestamp(): number {
  return Math.round(+new Date() / 1000);
}

module.exports = {displayName, isCommand, timestamp};
