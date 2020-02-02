'use strict';

// 基类ctrl, 所有控制器都要集成基类控制器

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl) {
    const { ctx } = this;
    await ctx.render('admin/public/success', { redirectUrl });
  }

  async error(redirectUrl) {
    const { ctx } = this;
    await ctx.render('admin/public/error', { redirectUrl });
  }

  async verify() {
    const captcha = await this.service.tools.captcha(); // 服务里面的方法
    this.ctx.response.type = 'image/svg+xml'; /* 指定返回的类型*/
    this.ctx.body = captcha.data; /* 给页面返回一张图片*/
  }
}

module.exports = BaseController;
