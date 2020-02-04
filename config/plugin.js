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
};
