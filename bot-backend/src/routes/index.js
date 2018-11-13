const express = require('express');
const { webhook } = require('./webhook');

const routes = express.Router();

routes.post('/webhook/', webhook);

module.exports = {
    routes,
};
