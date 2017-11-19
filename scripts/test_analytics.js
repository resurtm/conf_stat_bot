#!/usr/bin/env node

const _ = require('lodash');
const db = require('../src/db');
const analytics = require('../src/analytics');

analytics.topPostersLast24Hours(process.argv[2])
  .then(res => console.log('topPostersLast24Hours: ' + JSON.stringify(res, null, 2)))
  .then(() => db.knex.destroy())
  .catch(err => console.log(err));
