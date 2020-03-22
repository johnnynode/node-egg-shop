'use strict';

module.exports = (options, app) => {
    // 封装公共的请求
    return async function web(ctx, next) {
        //获取顶部导航的数据
        let topNav = await ctx.service.cache.get('index_top_nav');
        if (!topNav) {
            topNav = await ctx.model.Nav.find({ "position": 1 });
            await ctx.service.cache.set('index_top_nav', topNav, 60 * 60);
        }

        //商品分类
        let goodsCate = await ctx.service.cache.get('index_goods_cate');
        if (!goodsCate) {
            goodsCate = await ctx.model.GoodsCate.aggregate([{
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
            await ctx.service.cache.set('index_goods_cate', goodsCate, 60 * 60);
        }

        //中间导航以及关联商品
        let middleNav = await ctx.service.cache.get('index_middle_nav');
        if (!middleNav) {
            middleNav = await ctx.model.Nav.find({ "position": 2 });
            middleNav = JSON.parse(JSON.stringify(middleNav)); //1、不可扩展对象
            for (let i = 0; i < middleNav.length; i++) {
                if (middleNav[i].relation) {
                    //数据库查找relation对应的商品            
                    try {
                        let tempArr = middleNav[i].relation.replace(/，/g, ',').split(',');
                        let tempRelationIds = [];
                        tempArr.forEach((value) => {
                            tempRelationIds.push({
                                "_id": app.mongoose.Types.ObjectId(value)
                            })
                        })
                        let relationGoods = await ctx.model.Goods.find({
                            $or: tempRelationIds
                        }, 'title goods_img');
                        middleNav[i].subGoods = relationGoods;
                    } catch (err) { //2、如果用户输入了错误的ObjectID（商品id）
                        middleNav[i].subGoods = [];
                    }
                } else {
                    middleNav[i].subGoods = [];
                }
            }

            await ctx.service.cache.set('index_middle_nav', middleNav, 60 * 60);
        }

        ctx.state.topNav = topNav;
        ctx.state.goodsCate = goodsCate;
        ctx.state.middleNav = middleNav;

        // 最后的next一定要加上
        await next();
    };
};