/**
 * Hash shard.
 */
'use strict';

const HashRing = require('hash-ring');
const bluebird = require('bluebird');
const redis = require('redis');

const helpers = require('./helpers');

bluebird.promisifyAll(redis.RedisClient.prototype);

/**
 * Redis commands.
 * @type {Array}
 */
const COMMANDS = [
  'set'
];

class RedisHashShard {
  constructor(servers, hashMethod) {
    servers = helpers.formatServer(servers);
    this.connections = {};
    this.nodes = [];
    hashMethod = hashMethod || 'crc32';

    let tmp;
    for (let server of servers) {
      tmp = redis.createClient(server.url);

      if (server.db) {
        tmp.select(server.db);
      }
      this.connections[server.name] = tmp;
      this.nodes.push(server.name);
    }

    this.hashRing = new HashRing(this.nodes, {
      hashMethod: hashMethod
    });
  }

  /**
   * Get server name.
   * @private
   * @return {String} Server name
   */
  getServerName(key) {
    let name = this.hashRing.getNode(key);
    return name;
  }

  /**
   * Get server.
   * @private
   * @return {Object} Redis client.
   */
  getServer(key) {
    let name = this.getServerName(key);
    return this.connections[name];
  }

  /**
   * Redis get command.
   */
  get(key) {
    let conn = this.getServer(key);
    return conn.getAsync(key).then((value) => {
      return value;
    });
  }
}

/**
 * Add redis command to `RedisHashShard` prototype.
 */
COMMANDS.forEach(function (command) {
  RedisHashShard.prototype[command] = function(key, arg) {
    let conn = this.getServer(key);
    return conn[command + 'Async'](key, arg).then((value) => {
      return value;
    });
  };
});

module.exports = RedisHashShard;
