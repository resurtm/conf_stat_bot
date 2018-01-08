exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('api_entries', (table) => {
      table.increments('id');

      table.json('content');

      table.integer('timestamp').unsigned();
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('api_entries'),
  ]);
};
