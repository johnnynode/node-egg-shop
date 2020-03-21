'use strict';

const Service = require('egg').Service;
class CacheService extends Service {
    //设置值的方法
    async set(key, value, seconds) {
        if (!this.app.redis) {
            return;
        }
        value = JSON.stringify(value);
        await !seconds ? this.app.redis.set(key, value) : this.app.redis.set(key, value, 'EX', seconds)
    }

    //获取值的方法
    async get(key) {
        if (!this.app.redis) {
            return;
        }
        var data = await this.app.redis.get(key);
        if (!data) return;
        return JSON.parse(data);
    }
}

module.exports = CacheService;