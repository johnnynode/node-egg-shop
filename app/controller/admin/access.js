'use strict';

const Controller = require('egg').Controller;

class AccessController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = '权限列表';
  }
  async add() {
    const { ctx } = this;
    ctx.body = '权限增加';
  }
  async edit() {
    const { ctx } = this;
    ctx.body = '权限编辑';
  }
  async delete() {
    const { ctx } = this;
    ctx.body = '权限删除';
  }
}

module.exports = AccessController;
