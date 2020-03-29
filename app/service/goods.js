'use strict';

const Service = require('egg').Service;

class GoodsService extends Service {
    /*
      根据商品分类获取推荐商品 下面查询的是正常逻辑，也就是从商品分类中查询所有二级子分类, 通过子分类来查找商品，如果一些商品在配置的时候直接挂在顶级分类上是查不到这样的数据的
       @param {String} cate_id - 分类id
       @param {String} type - 类型 hot  best  new
       @param {Number} limit -  数量
    */
    async get_category_recommend_goods(cate_id, type, limit) {
        try {
            // 从商品分类表中 查出所有父分类id是条件分类id的数据
            // let cateIdsResult = await this.ctx.model.GoodsCate.find({ "pid": this.app.mongoose.Types.ObjectId(cate_id) }, '_id');
            let cateIdsResult = await this.ctx.model.GoodsCate.find({ "pid": cate_id }, '_id');
            if (!cateIdsResult.length) {
                cateIdsResult = [{ "_id": cate_id }]
            }

            //组装查找数据的条件
            let cateIdsArr = [];
            cateIdsResult.forEach((value) => {
                cateIdsArr.push({
                    "cate_id": value._id
                })
            })

            //查找条件
            let findJson = {
                "$or": cateIdsArr
            };

            //判断类型 合并对象
            switch (type) {
                case 'hot':
                    findJson = Object.assign(findJson, { "is_hot": 1 });
                    break;
                case 'best':
                    findJson = Object.assign(findJson, { "is_best": 1 });
                    break;
                case 'new':
                    findJson = Object.assign(findJson, { "is_new": 1 });
                    break;
                default:
                    findJson = Object.assign(findJson, { "is_hot": 1 });
                    break;
            }

            let limitSize = limit || this.config.pageSize; // 设置分页
            return await this.ctx.model.Goods.find(findJson, 'title shop_price goods_img sub_title').limit(limitSize);

        } catch (e) {
            console.log(e);
            return [];
        }
    }

    /*
      把商品id的字符串转化成数组
      @param {String} str - ids的字符串    
      5bc6a8c777dc3d1c849fba47，5be3f1d322f56e2fc8a694f2,5be940719567312f28240bff
      [{_id:5bc6a8c777dc3d1c849fba47},{_id:5be3f1d322f56e2fc8a694f2}]
    */
    strToArray(str) {
        try {
            let tempIds = [];
            if (str) {
                let idsArr = str.replace(/，/g, ',').split(',');
                for (let i = 0; i < idsArr.length; i++) {
                    tempIds.push({
                        "_id": this.app.mongoose.Types.ObjectId(idsArr[i])
                    });
                }
            } else {
                tempIds = [{ "1": -1 }]
            }
            return tempIds;
        } catch (error) {
            return [{ "1": -1 }]; //返回一个不成立的条件
        }
    }
}

module.exports = GoodsService;