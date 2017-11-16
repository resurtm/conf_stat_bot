exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user_messages', (table) => {
      table.increments('id');
      table.string('tg_user_id', 32);
      table.string('tg_chat_id', 32);
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
