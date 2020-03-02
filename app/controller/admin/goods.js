'use strict';

const BaseController = require('./base.js');

class GoodsController extends BaseController {
    async index() {
        await this.ctx.render('admin/goods/index');
    }

    async add() {
        // 获取所有的颜色值
        const colorResult = await this.ctx.model
            .GoodsColor.find({});

        // 获取所有的商品类型
        const goodsType = await this.ctx.model.GoodsType.find({});
        await this.ctx.render('admin/goods/add', {
            colorResult,
            goodsType,
        });
    }

    async doAdd() {
        console.log(this.ctx.request.body);
    }

    // 获取商品类型的属性 api接口
    async goodsTypeAttribute() {
        const cate_id = this.ctx.request.query.cate_id;
        // 注意 await
        const goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ cate_id });
        console.log(goodsTypeAttribute);
        // 返回json数据
        this.ctx.body = {
            result: goodsTypeAttribute,
        };
    }
}

module.exports = GoodsController;