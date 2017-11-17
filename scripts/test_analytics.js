#!/usr/bin/env node

const analytics = require('../src/analytics');

analytics.topPostersForLast24Hours('-1001262789346')
  .then(res => console.log(res.aggregations.users.buckets))
  .catch(err => console.log(err));
