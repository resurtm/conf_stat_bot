const express = require('express');
const tokenMiddleware = require('../middlewares/token');
const webhookHandler = require('./webhook');

const routes = express.Router();

routes.use(tokenMiddleware);
routes.post('/webhook/', webhookHandler);

module.exports = routes;
