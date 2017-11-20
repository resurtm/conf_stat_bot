exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user_messages', (table) => {
      table.increments('id');

      table.bigInteger('tg_user_id');
      table.bigInteger('tg_chat_id');

      table.integer('api_entry_id').unsigned();
      table.foreign('api_entry_id').references('api_entries.id');

      table.integer('timestamp').unsigned();
      table.timestamps(true, true);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('user_messages'),
  ]);
};
