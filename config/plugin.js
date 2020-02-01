'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // ejs 配置
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
};
