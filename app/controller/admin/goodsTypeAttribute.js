'use strict';

const BaseController = require('./base.js');
class GoodsTypeAttributeController extends BaseController {
    async index() {
        // 显示对应类型的属性
        // 获取当前属性的类型id   分类id
        const cate_id = this.ctx.request.query.id;
        // console.log(cate_id);
        // 获取当前的类型
        const goodsType = await this.ctx.model.GoodsType.find({ _id: cate_id });
        //  var result=await this.ctx.model.GoodsTypeAttribute.find({"cate_id":cate_id});
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
            goodsType: goodsType[0],
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
        const result = await this.ctx.model.GoodsTypeAttribute.find({ _id: id });
        const goodsTypes = await this.ctx.model.GoodsType.find({});
        await this.ctx.render('admin/goodsTypeAttribute/edit', {
            list: result[0],
            goodsTypes,
        });
    }

    async doEdit() {
        const _id = this.ctx.request.body._id;
        // var title=this.ctx.request.body.title;
        // var cate_id=this.ctx.request.body.cate_id;
        // var attr_type=this.ctx.request.body.attr_type;
        // var attr_value=this.ctx.request.body.attr_value;
        // console.log(this.ctx.request.body);
        await this.ctx.model.GoodsTypeAttribute.updateOne({ _id }, this.ctx.request.body);
        await this.success('/admin/goodsTypeAttribute?id=' + this.ctx.request.body.cate_id, '修改商品类型属性成功');
    }
}
module.exports = GoodsTypeAttributeController;