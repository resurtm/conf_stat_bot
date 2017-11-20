const _ = require('lodash');
const db = require('../src/db');
const elastic = require('../src/elastic');
const tools = require('../src/tools');

function topPostersLast24HoursQuery(chatId, topCount = 10) {
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
                  from: tools.timestamp() - 60 * 60 * 24,
                  to: tools.timestamp(),
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
            size: topCount,
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
    const userMessage = await db.UserMessage
      .where({
        tg_chat_id: chatId,
        tg_user_id: buckets[i].key,
      })
      .orderBy('timestamp', 'DESC')
      .fetch({withRelated: ['apiEntry']});
    const apiEntry = userMessage.related('apiEntry').attributes;

    res.push({
      userId: buckets[i].key,
      messageCount: buckets[i].doc_count,
      displayName: tools.displayName({
        username: _.get(apiEntry, 'content.message.from.username', null),
        first_name: _.get(apiEntry, 'content.message.from.first_name', null),
      }),
    });
  }
  return res;
}

module.exports = {topPostersLast24Hours};
