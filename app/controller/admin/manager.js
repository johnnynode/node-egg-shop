'use strict';

const BaseController = require('./base.js');

class ManagerController extends BaseController {
    async index() {
        // 查询管理员表并管理角色表 多表联查
        let list;
        try {
            list = await this.ctx.model.Admin.aggregate([{
                $lookup: {
                    from: 'role',
                    localField: 'role_id',
                    foreignField: '_id',
                    as: 'role',
                },
            }]);
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            list = [];
        } finally {
            await this.ctx.render('admin/manager/index', { list });
        }
    }

    async add() {
        const roleResult = await this.ctx.model.Role.find();
        await this.ctx.render('admin/manager/add', {
            roleResult,
        });
    }

    async doAdd() {
        const addResult = this.ctx.request.body;
        addResult.password = this.service.tools.md5(addResult.password);

        let adminResult;
        try {
            // 判断当前用户是否存在
            adminResult = await this.ctx.model.Admin.find({ username: addResult.username });
            if (adminResult.length) {
                await this.error('/admin/manager/add', '此管理员已经存在');
            } else {
                const admin = new this.ctx.model.Admin(addResult);
                admin.save();
                await this.success('/admin/manager', '增加用户成功');
            }
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
        }
    }

    async edit() {
        // 获取编辑的数据
        const id = this.ctx.request.query.id;

        try {
            const adminResult = await this.ctx.model.Admin.find({ _id: id });
            // 获取角色
            const roleResult = await this.ctx.model.Role.find();
            await this.ctx.render('admin/manager/edit', {
                adminResult: adminResult[0],
                roleResult,
            });
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
        }
    }

    async doEdit() {
        // 获取参数
        // console.log(this.ctx.request.body);
        const id = this.ctx.request.body.id;
        let password = this.ctx.request.body.password;
        const mobile = this.ctx.request.body.mobile;
        const email = this.ctx.request.body.email;
        const role_id = this.ctx.request.body.role_id;

        // 处理参数
        let updateObj = {
            mobile,
            email,
            role_id
        }
        if (password) {
            password = this.service.tools.md5(password); // 更新加密密码
            updateObj.password = password;
        }

        // 更新并跳转
        try {
            await this.ctx.model.Admin.updateOne({ _id: id }, updateObj);
            await this.success('/admin/manager', '修改用户信息成功');
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
        }
    }
}

module.exports = ManagerController;