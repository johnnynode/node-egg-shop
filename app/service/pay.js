'use strict';

const Service = require('egg').Service;
const wechatPay = require('../lib/wechatPay.js'); // 引入自己封装的微信支付库
const Alipay = require('alipay-mobile').default; // 这里是一个issue: https://github.com/Luncher/alipay/issues/49

/**
 * 用于微信和支付宝相关的支付服务功能
 */
class PayService extends Service {
    /* ************************ 微信支付相关服务 ************************ */
    async wechat(orderData) {
        return new Promise((resolve) => {
            let pay = new wechatPay(this.config.pay.wechat.config);
            let notify_url = this.config.pay.wechat.basicParams.notify_url;
            let out_trade_no = orderData.out_trade_no;
            let title = orderData.title;
            let price = orderData.price * 100; // 单位为分
            let ip = this.ctx.request.ip.replace(/::ffff:/, '');

            pay.createOrder({
                openid: '',
                notify_url: notify_url, //微信支付完成后的回调
                out_trade_no: out_trade_no, //订单号
                attach: title,
                body: title,
                total_fee: price.toString(), // 此处的额度为分
                spbill_create_ip: ip
            }, function(error, responseData) {
                console.log(responseData);
                if (error) {
                    console.log(error);
                }
                resolve(responseData.code_url)
            });
        })
    }

    /*params微信官方post给我们服务器的数据*/
    wechatNotify(params) {
        let pay = new wechatPay(this.config.pay.wechat.config);
        let notifyObj = params;
        let signObj = {};
        for (let attr in notifyObj) {
            // 去除微信post的sign字段
            if (attr != 'sign') {
                signObj[attr] = notifyObj[attr]
            }
        }
        let sign = pay.getSign(signObj);
        return sign;
    }

    /* ************************ 支付宝相关服务 ************************ */
    async ali(orderData) {
        return new Promise((resolve, reject) => {
            //实例化 alipay
            const service = new Alipay(this.config.pay.ali.options);
            //获取返回的参数
            service.createPageOrderURL(orderData, this.config.pay.ali.basicParams)
                .then(result => {
                    console.log(result);
                    resolve(result.data);
                });
        })
    }

    // 验证异步通知的数据是否正确 params 是支付宝post给我们服务器的数据
    aliNotify(params) {
        //实例化 alipay
        const service = new Alipay(this.config.pay.ali.options);
        return service.makeNotifyResponse(params);
    }
}

module.exports = PayService;