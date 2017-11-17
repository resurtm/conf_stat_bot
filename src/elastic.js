const elasticsearch = require('elasticsearch');
const _ = require('lodash');
const config = require('./config');

let client = null;
const indexPrefix = 'conf-stat-bot-';

if (client === null) {
  client = new elasticsearch.Client({
    host: config.elastic.host,
    apiVersion: config.elastic.apiVersion,
  });
}

function indices() {
  return ['user-message']
}

function mappings() {
  return {
    'user-message': {
      properties: {
        tg_user_id: {type: 'string', index: 'not_analyzed'},
        tg_chat_id: {type: 'string', index: 'not_analyzed'},
        timestamp: {type: 'long', index: 'not_analyzed'},
      },
    },
  };
}

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

module.exports = {
  indexPrefix,
  client,
  indices,
  mappings,
  reindexUserMessage,
};
