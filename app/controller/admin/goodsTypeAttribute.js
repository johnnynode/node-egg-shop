'use strict';

const BaseController = require('./base.js');
class GoodsTypeAttributeController extends BaseController {
    async index() {
        // 显示对应类型的属性
        // 获取当前属性的类型id   分类id
        const cate_id = this.ctx.request.query.id;
        const result = await this.ctx.model.GoodsTypeAttribute.aggregate([{
                $lookup: {
                    from: 'goods_type',
                    localField: 'cate_id',
                    foreignField: '_id',
                    as: 'goods_type',
                },
            },
            {
                $match: { // cate_id字符串
                    cate_id: this.app.mongoose.Types.ObjectId(cate_id), // 注意
                },
            },
        ]);

        // console.log(result)
        await this.ctx.render('admin/goodsTypeAttribute/index', {
            list: result,
            cate_id,
        });
    }

    async add() {
        // 获取类型数据
        const cate_id = this.ctx.request.query.id;
        const goodsTypes = await this.ctx.model.GoodsType.find({});
        await this.ctx.render('admin/goodsTypeAttribute/add', {
            cate_id,
            goodsTypes,
        });
    }

    async doAdd() {
        const res = new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body);
        await res.save(); // 注意
        await this.success('/admin/goodsTypeAttribute?id=' + this.ctx.request.body.cate_id, '增加商品类型属性成功');
    }

    // 功能还没有实现
    async edit() {
        const id = this.ctx.query.id;
        const result = await this.ctx.model.GoodsType.find({ _id: id });
        console.log('result', result);
        console.log('.......');
        await this.ctx.render('admin/goodsType/edit', {
            list: result[0],
        });
    }

    async doEdit() {
        const _id = this.ctx.request.body._id;
        const title = this.ctx.request.body.title;
        const description = this.ctx.request.body.description;
        await this.ctx.model.GoodsType.updateOne({ _id }, {
            title,
            description,
        });
        await this.success('/admin/goodsType', '编辑类型成功');
    }
}
module.exports = GoodsTypeAttributeController;