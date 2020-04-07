'use strict';

const Controller = require('egg').Controller;

class PayController extends Controller {
    /* ************************ 微信相关 ************************ */

    /* ************************ 支付宝相关 ************************ */
    async alipay() {
        // this.ctx.body='支付宝支付';
        let d = new Date();
        const data = {
            subject: '辣条111',
            out_trade_no: d.getTime().toString(), // 必须是string类型
            total_amount: '0.1'
        }
        let url = await this.service.pay.alipay(data);
        this.ctx.redirect(url); // 这里跳转到支付宝 我的收银台 进行扫码支付或登录账户支付
    }

    // 这里是用户扫码之后的回调页面显示，扫码成功后会跳转到(重定向到)商户: /pay/alipay/alipayReturn 这里
    // 页面上会有一些携带参数，包括cartset,out_trade_no, method, total_amount, sign 等，但不能通过这些信息来更新我们自己数据库的订单，不安全
    // 我们需要用支付宝给我们服务器推送过来的数据，来做更新处理
    async alipayReturn() {
        this.ctx.body = '支付成功';
        //接收异步通知        
    }

    // 支付成功以后更新订单信息 必须正式上线, 或者起码配置一个测试的公网ip或域名
    async alipayNotify() {
        const params = this.ctx.request.body; // 接收 支付宝 post 的 XML 数据
        // console.log(params);
        let result = await this.service.pay.alipayNotify(params); // 进行异步通知的数据验证
        // console.log('-------------');
        // console.log(result);

        // 校验正确的时候
        if (result.code === '0') {
            if (params.trade_status == 'TRADE_SUCCESS') {
                // 更新订单
            }
        } else {
            // 如果校验失败 理论上要追踪记录一下的，记录至数据库
        }
    }
}

module.exports = PayController;