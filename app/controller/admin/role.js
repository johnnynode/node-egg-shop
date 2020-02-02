'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = '角色列表';
    await ctx.render('admin/role/index');
  }
  async add() {
    const { ctx } = this;
    // ctx.body = '角色增加';
    await ctx.render('admin/role/add');
  }
  async edit() {
    const { ctx } = this;
    // ctx.body = '角色编辑';
    await ctx.render('admin/role/edit');
  }
  async delete() {
    const { ctx } = this;
    ctx.body = '角色删除';
  }
}

module.exports = RoleController;
