'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async index() {
        //获取顶部导航的数据
        var topNav = await this.ctx.model.Nav.find({ "position": 1 });

        //轮播图
        var focus = await this.ctx.model.Focus.find({ "type": 1 });

        //商品分类
        var goodsCate = await this.ctx.model.GoodsCate.aggregate([{
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

        // console.log(topNav);
        await this.ctx.render('web/index', {
            topNav: topNav,
            focus: focus,
            goodsCate: goodsCate
        });
    }
}

module.exports = IndexController;