'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = '管理员列表';
    await ctx.render('admin/login');
  }
}

module.exports = LoginController;
