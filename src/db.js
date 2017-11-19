const knex = require('knex')(require('./knexfile'));
const bookshelf = require('bookshelf')(knex);

const ApiEntry = bookshelf.Model.extend({
  tableName: 'api_entries',
  userMessage: () => this.hasOne(UserMessage),
});

const User = bookshelf.Model.extend({
  tableName: 'users',
  userMessage: () => this.hasOne(UserMessage),
});

const UserMessage = bookshelf.Model.extend({
  tableName: 'user_messages',
  apiEntry: () => this.belongsTo(ApiEntry),
  user: () => this.belongsTo(User),
});

module.exports = {knex, bookshelf, ApiEntry, UserMessage, User};
