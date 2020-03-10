'use strict';

const BaseController = require('./base.js');

class NavController extends BaseController {
    async index() {
        const page = this.ctx.request.query.page || 1;
        const pageSize = 15;
        // 获取当前数据表的总数量
        const totalNum = await this.ctx.model.Nav.find({}).count();
        // 分页查询
        const result = await this.ctx.model.Nav.find({}).skip((page - 1) * pageSize).limit(pageSize);

        await this.ctx.render('admin/nav/index', {
            list: result,
            totalPages: Math.ceil(totalNum / pageSize),
            page,
        });
    }

    async add() {
        await this.ctx.render('admin/nav/add');
    }

    async doAdd() {
        //  console.log();
        const nav = new this.ctx.model.Nav(this.ctx.request.body);
        await nav.save(); // 注意
        await this.success('/admin/nav', '增加导航成功');
    }

    async edit() {
        const id = this.ctx.query.id;
        const result = await this.ctx.model.Nav.find({ _id: id });
        await this.ctx.render('admin/nav/edit', {
            list: result[0],
        });
    }

    async doEdit() {
        const _id = this.ctx.request.body._id;
        await this.ctx.model.Nav.updateOne({ _id }, this.ctx.request.body);
        await this.success('/admin/nav', '编辑导航成功');
    }
}

module.exports = NavController;