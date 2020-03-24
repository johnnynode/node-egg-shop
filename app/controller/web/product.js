'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {
    async list() {
        /*
        1、获取分类id   cid
        2、根据分类id获取当前的分类信息
        3、判断是否是顶级分类
        4、如果是二级分类自己获取二级分类下面的数据, 如果是顶级分类, 获取顶级分类下面的二级分类, 根据二级分类获取下面所有的数据
        */

        let cid = this.ctx.request.query.cid;
        //根据分类id获取当前的分类新
        let curentCate = await this.ctx.model.GoodsCate.find({ "_id": cid });
        let goodsList = {};

        //判断是否是顶级分类
        if (curentCate[0].pid !== '0') {
            // 二级分类
            goodsList = await this.ctx.model.Goods.find({ "cate_id": cid }, '_id title price sub_title goods_img shop_price');
            // console.log(goodsList);
        } else {
            //顶级分类  获取当前顶级分类下面的所有的子分类
            let subCatesIds = await this.ctx.model.GoodsCate.find({ "pid": this.app.mongoose.Types.ObjectId(cid) }, '_id');
            let tempArr = [];
            for (let i = 0; i < subCatesIds.length; i++) {
                tempArr.push({
                    "cate_id": subCatesIds[i]._id
                })
            }
            // 使用$or 查询一次即可
            goodsList = await this.ctx.model.Goods.find({
                $or: tempArr
            }, '_id title price sub_title goods_img shop_price');
        }

        let tpl = curentCate[0].template ? curentCate[0].template : 'web/product_list.html';
        await this.ctx.render(tpl, {
            goodsList: goodsList
        });
    }

    async info() {
        await this.ctx.render('web/product_info.html');
    }
}

module.exports = ProductController;