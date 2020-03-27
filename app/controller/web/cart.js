'use strict';

const Controller = require('egg').Controller;

class CartController extends Controller {

    //增加购物车
    async addCart() {
        /*
               1、购物车数据保存在本地    （cookies）
               2、购物车数据保存到服务器   （必须登录）
               3、购物车数据保存到本地      登录成功后同步到服务器  （用的最多）
         */

        /*
            增加购物车的实现逻辑：

            1、获取增加购物车的数据  （把哪一个商品加入到购物车）
            2、判断购物车有没有数据   （cookies）
            3、如果购物车没有任何数据  直接把当前数据写入cookies
            4、如果购物车有数据 
                4、1、判断购物车有没有当前数据  
                        有当前数据让当前数据的数量加1
                        如果没有当前数据重新写入cookies
        */


        let goods_id = this.ctx.request.query.goods_id;
        let color_id = this.ctx.request.query.color_id;


        //1、获取商品信息
        let goodsResult = await this.ctx.model.Goods.find({ "_id": goods_id });
        let colorResult = await this.ctx.model.GoodsColor.find({ "_id": color_id });
        // console.log(goodsResult);

        if (!goodsResult.length || !colorResult.length) {
            this.ctx.status = 404;
            this.ctx.body = '错误404'; //404
        } else {
            // 赠品
            let goodsGiftIds = this.ctx.service.goods.strToArray(goodsResult[0].goods_gift);
            let goodsGift = await this.ctx.model.Goods.find({
                $or: goodsGiftIds
            });

            let currentData = {
                _id: goods_id,
                title: goodsResult[0].title,
                price: goodsResult[0].shop_price,
                goods_version: goodsResult[0].goods_version,
                num: 1,
                color: colorResult[0].color_name,
                goods_img: goodsResult[0].goods_img,
                goods_gift: goodsGift,
                /*赠品*/
                checked: true /*默认选中*/
            }

            //2、判断购物车有没有数据
            let cartList = this.service.cookies.get('cartList');
            if (cartList && cartList.length) { //存在
                //4、判断购物车有没有当前数据  
                if (this.service.cart.cartHasData(cartList, currentData)) {
                    for (let i = 0; i < cartList.length; i++) {
                        if (cartList[i]._id == currentData._id) {
                            cartList[i].num = cartList[i].num + 1;
                        }
                    }
                    this.service.cookies.set('cartList', cartList);
                } else {
                    // 如果购物车里面没有当前数据 把购物车以前的数据和当前数据拼接 然后重新写入
                    let tempArr = cartList;
                    tempArr.push(currentData);
                    this.service.cookies.set('cartList', tempArr);
                }
            } else {
                // 3、如果购物车没有任何数据  直接把当前数据写入cookies
                let tempArr = [];
                tempArr.push(currentData);
                this.service.cookies.set('cartList', tempArr);
            }

            this.ctx.body = '加入购物车成功';
        }
    }

    async cartList() {
        let cartList = this.service.cookies.get('cartList');
        // console.log(cartList);
        this.ctx.body = cartList;
    }
}

module.exports = CartController;