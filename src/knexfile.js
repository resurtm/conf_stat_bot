const config = require('./config');

module.exports = {
  client: 'pg',
  connection: {
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
  },
};
