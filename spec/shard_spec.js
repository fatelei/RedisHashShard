'use strict';

const RedisHashShard = require('../index');

describe('Test RedisHashShard', function () {
  describe('Test servers is object', function () {
    it('should be ok', function () {
      let servers = [
        {
          host: 'localhost',
          port: 6379,
          name: 'test'
        }
      ];
      const shard = new RedisHashShard(servers);
      const rst = shard instanceof RedisHashShard;
      expect(rst).toBe(true);
    });
  });

  describe('Test servers is string', function () {
    it('should be ok', function () {
      let servers = [
        'redis://localhost:6379/0?name=test'
      ];
      const shard = new RedisHashShard(servers);
      const rst = shard instanceof RedisHashShard;
      expect(rst).toBe(true);
    });
  });

  describe('Test redis set command', function () {
    it('should be ok', function (done) {
      let servers = [
        'redis://localhost:6379/0?name=test'
      ];
      const shard = new RedisHashShard(servers);
      shard.set('test', 1).then((value) => {
        done();
      });
    });
  });

  describe('Test redis get command', function () {
    it('should be ok', function (done) {
      let servers = [
        'redis://localhost:6379/0?name=test'
      ];
      const shard = new RedisHashShard(servers);
      shard.set('test', 1).then(() => {
        shard.get('test').then((value) => {
          expect(value).toBe('1');
          done();
        });
      });
    });
  });
});
