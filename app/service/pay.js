'use strict';

const Service = require('egg').Service;
const Alipay = require('alipay-mobile');

/**
 * 用于微信和支付宝相关的支付服务功能
 */
class PayService extends Service {

    /* 支付宝相关服务 */
    async alipay(orderData) {
        return new Promise((resolve, reject) => {
            //实例化 alipay
            const service = new Alipay(this.config.pay.alipay.options);
            //获取返回的参数
            service.createPageOrderURL(orderData, this.config.pay.alipay.basicParams)
                .then(result => {
                    console.log(result);
                    resolve(result.data);
                })
        })
    }

    // 验证异步通知的数据是否正确 params 是支付宝post给我们服务器的数据
    alipayNotify(params) {
        //实例化 alipay
        const service = new Alipay(this.config.pay.alipay.options);
        return service.makeNotifyResponse(params);
    }
}

module.exports = PayService;