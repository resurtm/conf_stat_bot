const knex = require('knex')(require('./knexfile'));
const bookshelf = require('bookshelf')(knex);

const ApiEntry = bookshelf.Model.extend({
  tableName: 'api_entries',
  userMessage: () => this.hasOne(UserMessage),
});

const UserMessage = bookshelf.Model.extend({
  tableName: 'user_messages',
  apiEntry: () => this.belongsTo(ApiEntry),
});

const RateLimit = bookshelf.Model.extend({
  tableName: 'rate_limits',
});

module.exports = {knex, bookshelf, ApiEntry, UserMessage, RateLimit};
