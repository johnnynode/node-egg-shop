'use strict';

const BaseController = require('./base.js');

class AccessController extends BaseController {
    async index() {
        // var result=await this.ctx.model.Access.find({});
        // console.log(result);
        // 1、在access表中找出  module_id=0的数据        管理员管理 _id    权限管理 _id    角色管理  (模块)
        // 2、让access表和access表关联    条件：找出access表中  module_id等于_id的数据

        try {
            const result = await this.ctx.model.Access.aggregate([{
                    $lookup: {
                        from: 'access',
                        localField: '_id',
                        foreignField: 'module_id',
                        as: 'items',
                    },
                },
                {
                    $match: {
                        module_id: '0',
                    },
                },
            ]);

            await this.ctx.render('admin/access/index', {
                list: result,
            });
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async add() {
        // 获取模块列表
        try {
            const result = await this.ctx.model.Access.find({ module_id: '0' });
            await this.ctx.render('admin/access/add', {
                moduleList: result,
            });
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async doAdd() {
        const addResult = this.ctx.request.body;
        const module_id = addResult.module_id;
        // console.log('addResult: ', addResult);

        try {
            // 菜单  或者操作
            if (module_id !== '0') {
                // 调用mongoose里面的方法把字符串转换成ObjectId
                addResult.module_id = this.app.mongoose.Types.ObjectId(module_id);
            }
            const access = new this.ctx.model.Access(addResult);
            access.save();
            await this.success('/admin/access', '增加权限成功');
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async edit() {
        const id = this.ctx.request.query.id;
        // 获取编辑的数据
        try {
            const accessResult = await this.ctx.model.Access.find({ _id: id });
            const result = await this.ctx.model.Access.find({ module_id: '0' });
            await this.ctx.render('admin/access/edit', {
                list: accessResult[0],
                moduleList: result,
            });
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async doEdit() {
        // console.log(this.ctx.request.body);
        const updateResult = this.ctx.request.body;
        const id = updateResult.id;
        const module_id = updateResult.module_id;

        // 若有必要，检查传输字段的合法性 TODO
        try {
            // 菜单或者操作 注意：模块的'0'是无法转换ObjectId的
            if (module_id !== '0') {
                // 调用mongoose里面的方法把字符串转换成ObjectId
                updateResult.module_id = this.app.mongoose.Types.ObjectId(module_id);
            }
            await this.ctx.model.Access.updateOne({ _id: id }, updateResult);
            await this.success('/admin/access', '修改权限成功');
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }
}
module.exports = AccessController;