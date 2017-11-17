const elastic = require('../src/elastic');

function topPostersForLast24Hours(chatID) {
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

module.exports = {
  topPostersForLast24Hours
};
