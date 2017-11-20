const _ = require('lodash');
const elasticsearch = require('elasticsearch');
const config = require('./config');

const client = new elasticsearch.Client({
  host: config.elastic.host,
  apiVersion: config.elastic.apiVersion,
});

const indexPrefix = 'conf-stat-bot-';
const indices = ['user-message'];
const mappings = {
  'user-message': {
    properties: {
      tg_user_id: {type: 'long', index: 'not_analyzed'},
      tg_chat_id: {type: 'long', index: 'not_analyzed'},
      timestamp: {type: 'long', index: 'not_analyzed'},
    },
  },
};

function reindexDocument(data, index) {
  return client.index({
    index: indexPrefix + index,
    type: indexPrefix + index + '-type',
    id: data.id,
    body: _.omit(data, ['id']),
  });
}

function reindexUserMessage(userMessage) {
  return reindexDocument(userMessage, 'user-message');
}

module.exports = {client, indexPrefix, indices, mappings, reindexUserMessage};
