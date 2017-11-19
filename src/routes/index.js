const express = require('express');
const tokenMiddleware = require('../middlewares/token');
const ignoreChatsMiddleware = require('../middlewares/ignoreChats');
const webhookHandler = require('./webhook');

const routes = express.Router();

routes.use(tokenMiddleware);
routes.use(ignoreChatsMiddleware);
routes.post('/webhook/', webhookHandler);

module.exports = routes;
