exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('rate_limits', (table) => {
      table.increments('id');

      table.bigInteger('tg_user_id');
      table.bigInteger('tg_chat_id');

      table.boolean('second_try').defaultTo(false);
      table.boolean('third_try').defaultTo(false);

      table.integer('timestamp').unsigned();
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('rate_limits'),
  ]);
};
