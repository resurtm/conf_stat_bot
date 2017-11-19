exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('rate_limits', (table) => {
      table.increments('id');
      table.boolean('second_try').defaultTo(false);
      table.boolean('third_try').defaultTo(false);
      table.bigInteger('tg_user_id');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('rate_limits'),
  ]);
};
