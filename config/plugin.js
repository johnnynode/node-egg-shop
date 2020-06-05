'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    // had enabled by egg
    // static: {
    //   enable: true,
    // }

    // ejs template conf
    ejs: {
        enable: true,
        package: 'egg-view-ejs',
    },
    // nunjucks template conf
    nunjucks: {
        enable: true,
        package: 'egg-view-nunjucks',
    },
    // mongoose conf
    mongoose: {
        enable: true,
        package: 'egg-mongoose',
    },
    // 配置redis 缓存技术有文件缓存和内存缓存，内存缓存相对来说要快上很多，少了很多不必要的io操作, redis在这里很好用
    redis: {
        enable: false,
        package: 'egg-redis',
    },
    // 配置 es
    elasticsearch: {
        enable: true,
        package: 'egg-es'
    },
    // 配置跨域
    cors: {
        enable: true,
        package: 'egg-cors',
    }
};