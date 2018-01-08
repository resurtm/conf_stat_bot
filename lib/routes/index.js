const express = require('express');
const tokenMiddleware = require('../middlewares/token');
const ignoreChatsMiddleware = require('../middlewares/ignoreChats');
const rateLimitMiddleware = require('../middlewares/rateLimit');
const webhookHandler = require('./webhook');
const apiStatsHandler = require('./apiStats');

const routes = express.Router();

routes.use(tokenMiddleware);
routes.use(ignoreChatsMiddleware);
routes.use(rateLimitMiddleware);
routes.post('/webhook/', webhookHandler);
routes.get('/api/stats/', apiStatsHandler);

module.exports = routes;
