const _ = require('lodash');
const db = require('../src/db');
const elastic = require('../src/elastic');
const tools = require('../src/tools');

function topPostersLast24HoursQuery(chatId) {
  const timestamp = Math.round(+new Date() / 1000);
  return elastic.client.search({
    index: 'conf-stat-bot-user-message',
    body: {
      from: 0,
      size: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                tg_chat_id: chatId,
              },
            },
            {
              range: {
                timestamp: {
                  from: timestamp - 60 * 60 * 24,
                  to: timestamp,
                },
              },
            },
          ],
        },
      },
      aggregations: {
        users: {
          terms: {
            field: 'tg_user_id',
            size: 10,
          },
        },
      },
    },
  });
}

async function topPostersLast24Hours(chatId) {
  const buckets = (await topPostersLast24HoursQuery(chatId)).aggregations.users.buckets;
  let res = [];
  for (let i in buckets) {
    const user = await db.User.where('tg_user_id', buckets[i].key).fetch();
    res.push({
      userId: user.attributes.tg_user_id,
      messageCount: buckets[i].doc_count,
      displayName: tools.displayName({
        username: user.attributes.user_name,
        first_name: user.attributes.first_name,
      }),
    });
  }
  return res;
}

module.exports = {topPostersLast24Hours};
