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
        // 获取参数
        const _id = this.ctx.request.body._id;
        const title = this.ctx.request.body.title;
        const description = this.ctx.request.body.description;

        // 有必要验证上述参数的合法性, 此处省略 TODO 【增加鲁棒性】

        // 数据库更新操作
        let result;
        try {
            result = await this.ctx.model.Role.updateOne({ _id }, {
                title,
                description,
            });
        } catch (err) {
            result = {
                ok: 0,
                msg: err
            }
        } finally {
            let flag = result && result.ok;
            let msg = flag ? '编辑角色成功' : '编辑角色失败：' + result.msg;
            await this.success('/admin/role', msg);
        }
    }

    async auth() {
        const role_id = this.ctx.request.query.id;
        const result = await this.service.admin.getAuthList(role_id);

        await this.ctx.render('admin/role/auth', {
            list: result,
            role_id,
        });
    }

    async doAuth() {
        /*
        1、删除当前角色下面的所有权限
        2、把获取的权限和角色增加到数据库
        */
        console.log(this.ctx.request.body);
        const role_id = this.ctx.request.body.role_id;
        const access_node = this.ctx.request.body.access_node;

        // 1、删除当前角色下面的所有权限
        await this.ctx.model.RoleAccess.deleteMany({ role_id });

        // 2、给role_access增加数据 把获取的权限和角色增加到数据库
        for (let i = 0; i < access_node.length; i++) {
            const roleAccessData = new this.ctx.model.RoleAccess({
                role_id,
                access_id: access_node[i],
            });

            roleAccessData.save();
        }

        await this.success('/admin/role/auth?id=' + role_id, '授权成功');
    }

}

module.exports = RoleController;