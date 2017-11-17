const _ = require('lodash');
const elastic = require('../src/elastic');
const db = require('../src/db');

function topPostersForLast24HoursInternal(chatID) {
  const ts = Math.round(+new Date() / 1000);
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
                tg_chat_id: chatID.toString(),
              },
            },
            {
              range: {
                timestamp: {
                  from: ts - 60 * 60 * 24,
                  to: ts,
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

function topPostersForLast24Hours(chatID) {
  const docCounts = {};
  return topPostersForLast24HoursInternal(chatID)
    .then(res => {
      const promises = [];
      _.forEach(res.aggregations.users.buckets, value => {
        docCounts[value.key] = value.doc_count;
        promises.push(db.User.where('tg_user_id', value.key).fetch());
      });
      return Promise.all(promises);
    })
    .then(res => {
      const result = {};
      _.forEach(res, value => {
        const attrs = value.attributes;
        result[attrs.tg_user_id] = {
          messageCount: docCounts[attrs.tg_user_id],
          displayName: attrs.user_name.length > 0 ? attrs.user_name : attrs.first_name,
          hasUserName: attrs.user_name.length > 0,
        };
      });
      return result;
    });
}

module.exports = {
  topPostersForLast24Hours,
};
