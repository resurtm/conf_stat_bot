const analytics = require('../analytics');

async function apiStatsHandler(req, res) {
  if (!('chatId' in req.query)) {
    res.sendStatus(400);
    return;
  }

  const posters = await analytics.topPostersLast24Hours(req.query.chatId);
  res.send(JSON.stringify(posters));
}

module.exports = apiStatsHandler;
