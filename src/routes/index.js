const express = require('express');
const tokenMiddleware = require('./tokenMiddleware');
const webhookHandler = require('./webhookHandler');

const router = express.Router();

router.use(tokenMiddleware);
router.post('/webhook/', webhookHandler);

module.exports = router;
