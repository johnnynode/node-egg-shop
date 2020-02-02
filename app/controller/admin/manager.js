'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = '管理员列表';
    await ctx.render('admin/manager/index');
  }
  async add() {
    const { ctx } = this;
    // ctx.body = '管理员增加';
    await ctx.render('admin/manager/add');
  }
  async edit() {
    const { ctx } = this;
    // ctx.body = '管理员编辑';
    await ctx.render('admin/manager/edit');
  }
}

module.exports = UserController;
