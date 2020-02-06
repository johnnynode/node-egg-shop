'use strict';

const BaseController = require('./base.js');

class RoleController extends BaseController {
  async index() {
    const result = await this.ctx.model.Role.find({});
    await this.ctx.render('admin/role/index', {
      list: result,
    });
  }

  async add() {
    await this.ctx.render('admin/role/add');
  }

  async doAdd() {
    const role = new this.ctx.model.Role({
      title: this.ctx.request.body.title,
      description: this.ctx.request.body.description,
    });

    await role.save(); // 注意
    await this.success('/admin/role', '增加角色成功');
  }

  async edit() {
    const id = this.ctx.query.id;
    const result = await this.ctx.model.Role.find({ _id: id });
    await this.ctx.render('admin/role/edit', {
      list: result[0],
    });
  }

  async doEdit() {
    const _id = this.ctx.request.body._id;
    const title = this.ctx.request.body.title;
    const description = this.ctx.request.body.description;

    await this.ctx.model.Role.updateOne({ _id }, {
      title, description,
    });
    await this.success('/admin/role', '编辑角色成功');
  }
}

module.exports = RoleController;
