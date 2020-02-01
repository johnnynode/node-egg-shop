'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = '管理员列表';
    await ctx.render('admin/manager/index', { username: 'zhangsan' });
  }
  async add() {
    const { ctx } = this;
    ctx.body = '管理员增加';
  }
  async edit() {
    const { ctx } = this;
    ctx.body = '管理员编辑';
  }
}

module.exports = UserController;
