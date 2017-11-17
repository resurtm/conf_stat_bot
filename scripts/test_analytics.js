#!/usr/bin/env node

const analytics = require('../src/analytics');
const _ = require('lodash');

const chatID = process.argv[2];

console.log('topPostersForLast24Hours:');
analytics.topPostersForLast24Hours(chatID)
  .then(res => {
    _.forEach(res.aggregations.users.buckets, value => {
      console.log('\tkey = ' + value.key + ', count = ' + value.doc_count);
    });
  })
  .catch(err => console.log(err));
