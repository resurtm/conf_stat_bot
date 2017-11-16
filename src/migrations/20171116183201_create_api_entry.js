exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('api_entries', (table) => {
      table.increments();
      table.json('content');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('api_entries'),
  ]);
};
