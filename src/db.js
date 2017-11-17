const knexLib = require('knex');
const bookshelfLib = require('bookshelf');
const knexfile = require('./knexfile');

let knex = null;
let bookshelf = null;

if (knex === null) {
  knex = knexLib(knexfile);
}
if (bookshelf === null) {
  bookshelf = bookshelfLib(knex);
}

const ApiEntry = bookshelf.Model.extend({
  tableName: 'api_entries',
  userMessage() {
    return this.hasOne(UserMessage);
  },
});

const UserMessage = bookshelf.Model.extend({
  tableName: 'user_messages',
  apiEntry() {
    return this.belongsTo(ApiEntry);
  },
  user() {
    return this.belongsTo(User);
  },
});

const User = bookshelf.Model.extend({
  tableName: 'users',
  userMessage() {
    return this.hasOne(UserMessage);
  },
});

module.exports = {
  knex,
  bookshelf,
  ApiEntry,
  UserMessage,
  User,
};
