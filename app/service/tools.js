'use strict';

const svgCaptcha = require('svg-captcha'); // 引入验证

const Service = require('egg').Service;

class ToolsService extends Service {

  // 生成验证码
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 6,
      fontSize: 50,
      width: 100,
      height: 40,
      background: '#cc9966',
    });

    this.ctx.session.code = captcha.text; /* 验证码上面的信息*/
    return captcha;
  }
}

module.exports = ToolsService;
