'use strict';

const Controller = require('egg').Controller;

class CartController extends Controller {

    //增加购物车
    async addCart() {
        /*
               1、购物车数据保存在本地    （cookies）
               2、购物车数据保存到服务器   （必须登录）
               3、购物车数据保存到本地      登录成功后同步到服务器  （用的最多）

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

            // this.ctx.body = '加入购物车成功';
            this.ctx.redirect('/addCartSuccess?goods_id=' + goods_id + '&color_id=' + color_id);
        }
    }

    // 增加购物车成功页面
    async addCartSuccess() {
        let goods_id = this.ctx.request.query.goods_id;
        let color_id = this.ctx.request.query.color_id;

        //1、获取商品信息
        let goodsResult = await this.ctx.model.Goods.find({ "_id": goods_id });
        let colorResult = await this.ctx.model.GoodsColor.find({ "_id": color_id });

        if (!goodsResult.length || !colorResult.length) {
            this.ctx.status = 404;
            this.ctx.body = '错误404'; //404
        } else {
            let title = goodsResult[0].title + '--' + goodsResult[0].goods_version + "--" + colorResult[0].color_name;
            await this.ctx.render('web/cart/add_cart_suc.html', {
                title: title,
                goods_id: goods_id
            });
        }
    }

    // 购物车商品列表
    async cartList() {
        let cartList = this.service.cookies.get('cartList');
        let allPrice = 0;
        // 存在购物列表，则处理相应数据
        if (cartList && cartList.length) {
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }
        }
        await this.ctx.render('web/cart/index.html', {
            cartList: cartList,
            allPrice: allPrice
        });
    }

    //增加购物车数量
    async incCart() {
        let goods_id = this.ctx.request.query.goods_id;
        let color = this.ctx.request.query.color;
        let goodsResult = await this.ctx.model.Goods.find({ "_id": goods_id });
        if (!goodsResult.length) {
            this.ctx.body = {
                "success": false,
                msg: '修改数量失败'
            }
        } else {
            let cartList = this.service.cookies.get('cartList');
            let currentNum = 0; // 当前数量
            let allPrice = 0; // 总价格
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    cartList[i].num += 1;
                    currentNum = cartList[i].num;
                }
                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }
            this.service.cookies.set('cartList', cartList);
            this.ctx.body = {
                "success": true,
                num: currentNum,
                allPrice: allPrice
            }
        }
    }

    //减少购物车数量  
    async decCart() {
        let goods_id = this.ctx.request.query.goods_id;
        let color = this.ctx.request.query.color;
        let goodsResult = await this.ctx.model.Goods.find({ "_id": goods_id });
        if (goodsResult.length == 0) {
            this.ctx.body = {
                "success": false,
                msg: '修改数量失败'
            }
        } else {
            let cartList = this.service.cookies.get('cartList');
            let currentNum = 0; //当前数量
            let allPrice = 0; //总价格
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    if (cartList[i].num > 1) {
                        cartList[i].num -= 1;
                    }
                    currentNum = cartList[i].num;
                }
                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }

            this.service.cookies.set('cartList', cartList);

            this.ctx.body = {
                "success": true,
                num: currentNum,
                allPrice: allPrice
            }
        }
    }

    //改变购物车商品的状态  
    async changeOneCart() {
        let goods_id = this.ctx.request.query.goods_id;
        let color = this.ctx.request.query.color;
        let goodsResult = await this.ctx.model.Goods.find({ "_id": goods_id });
        if (!goodsResult || goodsResult.length == 0) {
            this.ctx.body = {
                "success": false,
                msg: '改变状态失败'
            }
        } else {
            let cartList = this.service.cookies.get('cartList');
            let allPrice = 0; //总价格
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    cartList[i].checked = !cartList[i].checked;
                }
                //计算总价
                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }
            this.service.cookies.set('cartList', cartList);
            this.ctx.body = {
                "success": true,
                allPrice: allPrice
            }
        }
    }

    //改变所有购物车商品的状态  
    async changeAllCart() {
        let type = this.ctx.request.query.type;
        let cartList = this.service.cookies.get('cartList');
        let allPrice = 0; //总价格
        for (let i = 0; i < cartList.length; i++) {
            cartList[i].checked = type == 1; // 处理选中
            //计算总价
            if (cartList[i].checked) {
                allPrice += cartList[i].price * cartList[i].num;
            }
        }
        this.service.cookies.set('cartList', cartList);
        this.ctx.body = {
            "success": true,
            allPrice: allPrice
        }
    }

    async removeCart() {
        let goods_id = this.ctx.request.query.goods_id;
        let color = this.ctx.request.query.color;
        let goodsResult = await this.ctx.model.Goods.find({ "_id": goods_id });
        if (!goodsResult || !goodsResult.length) {
            this.ctx.redirect('/cart');
        } else {
            let cartList = this.service.cookies.get('cartList');
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    cartList.splice(i, 1);
                }
            }
            this.service.cookies.set('cartList', cartList);
            this.ctx.redirect('/cart');
        }
    }
}

module.exports = CartController;