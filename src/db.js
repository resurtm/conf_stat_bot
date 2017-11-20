const knexfile = require('./knexfile');
const knex = require('knex')(knexfile);
const bookshelf = require('bookshelf')(knex);

const ApiEntry = bookshelf.Model.extend({
  tableName: 'api_entries',
  userMessage() {
    return this.belongsTo(UserMessage);
  },
});

const UserMessage = bookshelf.Model.extend({
  tableName: 'user_messages',
  apiEntry() {
    return this.belongsTo(ApiEntry);
  },
});

const RateLimit = bookshelf.Model.extend({
  tableName: 'rate_limits',
});

module.exports = {knex, bookshelf, ApiEntry, UserMessage, RateLimit};
