'use strict';

const svgCaptcha = require('svg-captcha'); // 引入验证
const md5 = require('md5');

const Service = require('egg').Service;

class ToolsService extends Service {

  // 生成验证码
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#cc9966',
    });

    this.ctx.session.code = captcha.text; /* 验证码上面的信息*/
    return captcha;
  }

  // md5 加密 三次
  async md5(str) {
    return md5(md5(md5(str)));
  }
}

module.exports = ToolsService;
