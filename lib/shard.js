/**
 * Redis shard
 */

var events = require('events');
var util = require('util');
var url = require('url');

var Ring = require('hash-ring');
var redis = require('redis');


var commands = require('./commands.json');
var toArray = require('./to_array');


/**
 * Redis shard implemented by mod
 * @param {Object} options The config
 */
function RedisHashShard(options) {
  if (Object.keys(options).length === 0) {
    throw new Error("Arguments must contains one key at the least!");
  }

  if (!options.hasOwnProperty('nodes')) {
    throw new Error("You should have the servers config!");
  }

  if (!options.servers instanceof Array) {
    throw new Error("'servers' in options, the type must be Array!");
  }

  var replicas = options.replicas || 3;

  this.conn = {};

  this.servers = new Ring({
    nodes: options.nodes,
    replicas: replicas
  });

  // Create redis connection
  options.nodes.forEach(function (server) {
    var rst = url.parse(server);

    // Connect to the redis server.
    this.conn[server] = redis.createClient(rst.port, rst.hostname);

    // If the db is not null,
    // then select the db.
    if (rst.path !== null) {
      this.conn[server].select(rst.path.slice(1));
    }

    // Watch "error" event.
    this.conn[server].on('error', function (err) {
      this.emit('error', err);
    });

  }.bind(this));

  events.EventEmitter.call(this);
}

util.inherits(RedisHashShard, events.EventEmitter);

/* Bind commands */
commands.commands.forEach(function (fullcommand) {
  RedisHashShard.prototype[fullcommand] = function (args, callback) {
    var that = this;

    if (!args instanceof Array) {
      args = toArray(arguments);
    }

    var server = that.servers.getNode(args[0]);
    return that.conn[server][fullcommand](args, callback);
  };
});


/**
 * Add server to hash ring
 * @param {String} server Server host
 */
RedisHashShard.prototype.addServer = function (server) {
  var that = this;

  that.servers.addNode(server);
};

/**
 * Remove server from hash ring
 * @param  {String} server Server host
 */
RedisHashShard.prototype.removeServer = function (server) {
  var that = this;

  that.servers.removeNode(server);
};

module.exports = {
  RedisHashShard: RedisHashShard
};
