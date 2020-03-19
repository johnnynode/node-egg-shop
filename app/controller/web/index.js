'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async index() {
        //获取顶部导航的数据
        let topNav = await this.ctx.model.Nav.find({ "position": 1 });
        //轮播图
        let focus = await this.ctx.model.Focus.find({ "type": 1 });
        //商品分类
        let goodsCate = await this.ctx.model.GoodsCate.aggregate([{
                $lookup: {
                    from: 'goods_cate',
                    localField: '_id',
                    foreignField: 'pid',
                    as: 'items'
                }
            },
            {
                $match: {
                    "pid": '0'
                }
            }
        ])

        //获取中间导航的数据
        let middleNav = await this.ctx.model.Nav.find({ "position": 2 });
        middleNav = JSON.parse(JSON.stringify(middleNav)); // 处理不可扩展对象
        // 处理数据
        for (let i = 0; i < middleNav.length; i++) {
            if (middleNav[i].relation) {
                // 数据库查找relation对应的商品            
                try {
                    let tempArr = middleNav[i].relation.replace(/，/g, ',').split(',');
                    let tempRelationIds = [];
                    tempArr.forEach((value) => {
                        tempRelationIds.push({
                            "_id": this.app.mongoose.Types.ObjectId(value)
                        })
                    })
                    let relationGoods = await this.ctx.model.Goods.find({
                        $or: tempRelationIds
                    }, 'title goods_img');

                    middleNav[i].subGoods = relationGoods;

                } catch (err) {
                    // 如果用户输入了错误的ObjectID（商品id）
                    middleNav[i].subGoods = [];
                }
            } else {
                middleNav[i].subGoods = [];
            }
        }

        // 这里封装了首页推荐的楼层，但是_id是硬编码出来的，是从数据库或后台管理系统中拿来的，可以做成配置的
        // 手机
        var mobileResult = await this.service.goods.get_category_recommend_goods('5e55b4fbe9ab76893131640f', 'best', 8);
        // 其他...

        console.log('mobileResult', mobileResult);

        await this.ctx.render('web/index', {
            topNav: topNav,
            focus: focus,
            goodsCate: goodsCate,
            middleNav: middleNav,
            mobileResult: mobileResult
        });
    }
}

module.exports = IndexController;