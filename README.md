Redis Hash Shard
================

Redis hash shard implement in JS, using consistent hashing algorithm.

![Build Status](https://api.travis-ci.org/fatelei/RedisHashShard.svg)

# Install

```
npm install redis-hash-shard
```

# APIs

## RedisHashShard

Initialize a new `RedisHashShard` instance.

+ servers {Array}: Redis server connection string or object, it must include `name` in object or string
+ hashMethod {String}: Which hash method to be used, `md5` or `crc32`, default is `crc32`

### Usage

```
const servers = [
  {
    host: 'localhost',
    port: 6379,
    db: 0,
    auth: 'xxx',
    passwd: 'xxx',
    name: 'test'
  }
];

const shard = new RedisHashShard(servers);
```

Or

```
const servers = [
  'redis://xx:xx@localhost/0?name=test'
];

const shard = new RedisHashShard(servers);
```

## Redis command

Currently support commands:

+ get
+ set


# TODO

+ Support more redis commands.