#!/usr/bin/env node

const _ = require('lodash');
const elastic = require('../src/elastic');
const db = require('../src/db');

console.log('resetting ElasticSearch indices...');
const promises = [];

for (let i in elastic.indices()) {
  const index = elastic.indexPrefix + elastic.indices()[i];
  console.log('managing index: ' + index);

  const promise = elastic.client.indices.exists({index})
    .then(exists => exists ? elastic.client.indices.delete({index}) : Promise.resolve())
    .then(() => elastic.client.indices.create({index}))
    .then(() => db.UserMessage.fetchAll())
    .then(userMessages => {
      _.each(userMessages.models, model => {
        elastic.reindexUserMessage(model);
      });
    })
    .catch(err => console.log(err));

  promises.push(promise);
}

Promise.all(promises)
  .then(() => db.knex.destroy())
  .catch(err => console.log(err));
console.log('done!');
