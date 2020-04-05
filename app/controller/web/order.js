'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
    // 提交订单
    async submit() {
        /*
          1、获取收货地址信息
          2、需要获取购买商品的信息
          3、把这些信息  放在订单表  
          4、删除购物车里面的数据
        */

        const uid = this.ctx.service.cookies.get('userinfo')._id;
        let addressResult = await this.ctx.model.Address.find({ "uid": uid, "default_address": 1 }); // 获取当前用户的收货地址
        let cartList = this.service.cookies.get('cartList');
        let isAbleDoOrder = addressResult && addressResult.length && cartList && cartList.length; // 是否可以下单的标识

        // 不满足条件，不能生成订单跳转回去
        if (!isAbleDoOrder) {
            return this.ctx.redirect('/cart/checkout');
        }

        // 正常生成订单流程
        let all_price = 0;
        // 选出所有选中的商品放到订单列表中
        let orderList = cartList.filter((value) => {
            if (value.checked) {
                all_price += value.price * value.num;
                return value;
            }
        });

        //执行提交订单的操作
        let order_id = await this.service.tools.getOrderId();
        let addressObj = addressResult[0]; // 地址对象
        let name = addressObj.name;
        let phone = addressObj.phone;
        let address = addressObj.address;
        let zipcode = addressObj.zipcode;
        let pay_status = 0;
        let pay_type = '';
        let order_status = 0;
        // 首先生成 order 订单表
        let orderModel = new this.ctx.model.Order({ order_id, name, phone, address, zipcode, pay_status, pay_type, order_status, all_price });
        let orderResult = await orderModel.save();
        // 生成 order_item 商品信息表，order与order_item 是一对多的关系
        if (orderResult && orderResult._id) {
            // 增加商品信息
            for (let i = 0; i < orderList.length; i++) {
                let orderItem = orderList[i];
                let json = {
                    "order_id": orderResult._id, //订单id
                    "product_title": orderItem.title,
                    "product_id": orderItem._id,
                    "product_img": orderItem.goods_img,
                    "product_price": orderItem.price,
                    "product_num": orderItem.num
                }
                let orderItemModel = new this.ctx.model.OrderItem(json);
                await orderItemModel.save();
            }

            // 删除购物车中已经购买的商品 换句话说，也就是保留未选中的商品  
            let unCheckedCartList = cartList.filter((value) => {
                if (!value.checked) {
                    return value;
                }
            });
            // 同步到cookie中
            this.service.cookies.set('cartList', unCheckedCartList);
            // 流程跳转到订单确认页面
            this.ctx.redirect('/order/confirm?id=' + orderResult._id);
        } else {
            this.ctx.redirect('/cart/checkout');
        }
        console.log('提交订单');
    }

    // 确认订单  支付
    async confirm() {
        await this.ctx.render('web/order/confirm.html');
    }
}

module.exports = OrderController;