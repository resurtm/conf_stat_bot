#!/usr/bin/env node

const _ = require('lodash');
const db = require('../src/db');
const elastic = require('../src/elastic');

console.log('resetting ElasticSearch indices...');

async function manageUserMessages() {
  const rawIndex = 'user-message';
  const index = elastic.indexPrefix + rawIndex;

  if (await elastic.client.indices.exists({index})) {
    await elastic.client.indices.delete({index});
  }

  await elastic.client.indices.create({
    index,
    body: {
      mappings: {
        [index + '-type']: elastic.mappings[rawIndex],
      },
    },
  });

  const userMessages = await db.UserMessage.fetchAll();
  for (let i in userMessages.models) {
    await elastic.reindexUserMessage(userMessages.models[i]);
  }
}

Promise.all([manageUserMessages()])
  .then(() => db.knex.destroy())
  .then(() => console.log('done!'))
  .catch(err => console.log(err));
