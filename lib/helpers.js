/**
 * Helper module.
 */
'use strict';

const URL = require('url');
const assert = require('assert');
const querystring = require('querystring');

/**
 * Format server connection string.
 * @param  {Array} servers
 * @return {Array} A format server connection info.
 */
const formatServer = (servers) => {
  if (!Array.isArray(servers)) {
    throw new Error('server\'s config must be list');
  }

  let _type = servers[0];

  if (typeof _type === 'object') {
    return servers;
  }

  let config = [];
  let tmp;
  let query;
  let db;

  for (let server of servers) {
    tmp = URL.parse(server);
    assert.deepEqual(tmp.protocol, 'redis:');
    query = querystring.parse(tmp.query);
    db = tmp.path ? parseInt(tmp.path.replace('/', ''), 10) : 0;
    tmp.query = null;
    tmp.search = null;
    tmp.path = null;
    tmp.pathname = null;

    config.push({
      url: URL.format(tmp),
      db: db,
      name: query.name
    });
  }
  return config;
};

exports.formatServer = formatServer;
