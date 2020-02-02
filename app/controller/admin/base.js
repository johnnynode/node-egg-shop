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
}

module.exports = BaseController;
