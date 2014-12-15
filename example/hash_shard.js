/**
 * Redis Hash Shard Example
 */

var RedisHashShard = require('../index').RedisHashShard;

var options = {
  nodes: [
    'tcp://127.0.0.1:6379/0'
  ]
};

var rhs = new RedisHashShard(options);
rhs.nodes;
