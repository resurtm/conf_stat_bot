exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id');
      table.string('tg_user_id', 32);
      table.string('first_name', 250);
      table.string('last_name', 250);
      table.string('user_name', 250);
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
  ]);
};
