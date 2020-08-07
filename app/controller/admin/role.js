'use strict';

const BaseController = require('./base.js');

class RoleController extends BaseController {
    async index() {
        // 查询所有列表，有必要分页
        try {
            let result = await this.ctx.model.Role.find({});
            await this.ctx.render('admin/role/index', {
                list: result,
            });
        } catch (err) {
            // 输出日志  egg-logger 【增加鲁棒性 TODO】

        }
    }

    async add() {
        await this.ctx.render('admin/role/add');
    }

    async doAdd() {
        let msg = '增加角色成功';
        let flag = true;
        try {
            const role = new this.ctx.model.Role({
                title: this.ctx.request.body.title,
                description: this.ctx.request.body.description,
            });
            await role.save(); // 注意
        } catch (err) {
            msg = '增加角色失败';
            flag = false;
        } finally {
            await this[flag ? 'success' : 'error']('/admin/role', msg);
        }
    }

    async edit() {
        // 获取参数
        const id = this.ctx.query.id;

        // 数据库查询操作
        try {
            let result = await this.ctx.model.Role.find({ _id: id });
            await this.ctx.render('admin/role/edit', {
                list: result[0],
            });
        } catch (err) {
            // 打印日志  egg-logger 【增加鲁棒性 TODO】
            console.log(err);
        }
    }

    async doEdit() {
        // 获取参数
        const _id = this.ctx.request.body._id;
        const title = this.ctx.request.body.title;
        const description = this.ctx.request.body.description;

        // 有必要验证上述参数的合法性, 此处省略【增加鲁棒性 TODO】

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
            await this[flag ? 'success' : 'error']('/admin/role', msg);
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