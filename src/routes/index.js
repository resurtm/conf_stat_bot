const express = require('express');
const tokenMiddleware = require('../middlewares/token');
const ignoreChatsMiddleware = require('../middlewares/ignoreChats');
const rateLimitMiddleware = require('../middlewares/rateLimit');
const webhookHandler = require('./webhook');

const routes = express.Router();

routes.use(tokenMiddleware);
routes.use(ignoreChatsMiddleware);
routes.use(rateLimitMiddleware);
routes.post('/webhook/', webhookHandler);

module.exports = routes;
