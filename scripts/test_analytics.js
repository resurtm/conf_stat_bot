#!/usr/bin/env node

const _ = require('lodash');
const analytics = require('../src/analytics');
const db = require('../src/db');

const chatID = process.argv[2];

console.log('topPostersLast24Hours:');
analytics.topPostersLast24Hours(chatID)
  .then(res => console.log(res))
  .then(() => db.knex.destroy())
  .catch(err => console.log(err));
