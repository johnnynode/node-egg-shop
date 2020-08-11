'use strict';

const BaseController = require('./base.js');

class GoodsTypeController extends BaseController {
    async index() {
        // 查询商品类型表
        try {
            const result = await this.ctx.model.GoodsType.find({});
            await this.ctx.render('admin/goodsType/index', {
                list: result,
            });
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async add() {
        await this.ctx.render('admin/goodsType/add');
    }

    async doAdd() {
        //  console.log(this.ctx.request.body);
        // 这里简写 需要校验每一个字段的合法性 【todo】
        try {
            const res = new this.ctx.model.GoodsType(this.ctx.request.body);
            await res.save(); // 注意
            await this.success('/admin/goodsType', '增加类型成功');
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async edit() {
        const id = this.ctx.query.id;

        try {
            const result = await this.ctx.model.GoodsType.find({ _id: id });
            await this.ctx.render('admin/goodsType/edit', {
                list: result[0],
            });
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async doEdit() {
        const _id = this.ctx.request.body._id;
        const title = this.ctx.request.body.title;
        const description = this.ctx.request.body.description;

        // 合法性校验 TODO

        try {
            await this.ctx.model.GoodsType.updateOne({ _id }, {
                title,
                description,
            });
            await this.success('/admin/goodsType', '编辑类型成功');
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }
}
module.exports = GoodsTypeController;