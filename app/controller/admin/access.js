'use strict';

const BaseController = require('./base');

class AccessController extends BaseController {
  async index() {
    const { ctx } = this;
    ctx.body = '权限列表';
    await ctx.render('admin/access/index');
  }
  async add() {
    const { ctx } = this;
    // ctx.body = '权限增加';
    await ctx.render('admin/access/add');
  }
  async edit() {
    const { ctx } = this;
    // ctx.body = '权限编辑';
    await ctx.render('admin/access/edit');
  }
  async delete() {
    const { ctx } = this;
    ctx.body = '权限删除';
  }
}

module.exports = AccessController;
