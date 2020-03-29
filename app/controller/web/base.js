'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
    //验证码
    async verify() {
        var captcha = await this.service.tools.captcha(120, 50); //服务里面的方法
        this.ctx.session.web_code = captcha.text; /*验证码的信息*/
        this.ctx.response.type = 'image/svg+xml'; /*指定返回的类型*/
        this.ctx.body = captcha.data; /*给页面返回一张图片*/
    }
}

module.exports = BaseController;