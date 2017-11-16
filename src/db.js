const knexLib = require('knex');
const bookshelfLib = require('bookshelf');
const knexfile = require('./knexfile');

const knex = knexLib(knexfile);
const bookshelf = bookshelfLib(knex);

const ApiEntry = bookshelf.Model.extend({
  tableName: 'api_entries',
});

module.exports = {
  knex,
  bookshelf,
  ApiEntry,
};
