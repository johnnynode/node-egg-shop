'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    //登录
    async login() {
        await this.ctx.render('web/user/login.html');
    }

    //注册第一步 输入手机号
    async registerStep1() {
        await this.ctx.render('web/user/register_step1.html');
    }

    //注册第二步  验证码验证码是否正确
    async registerStep2() {
        await this.ctx.render('web/user/register_step2.html');
    }

    //注册第三步  输入密码
    async registerStep3() {
        await this.ctx.render('web/user/register_step3.html');
    }

    //完成注册  post
    async doRegister() {
        this.ctx.body = '完成注册';
    }

    //发送短信验证码
    async sendCode() {
        let phone = this.ctx.request.query.phone;
        let web_code = this.ctx.request.query.web_code; //用户输入的验证码
        if (web_code !== this.ctx.session.web_code) {
            this.ctx.body = {
                success: false,
                msg: '输入的图形验证码不正确'
            }
        } else {
            //判断手机格式是否合法
            let reg = /^[\d]{11}$/;
            if (!reg.test(phone)) {
                this.ctx.body = {
                    success: false,
                    msg: '手机号不合法'
                }
            } else {
                let add_day = await this.service.tools.getDay(); //年月日    
                let sign = await this.service.tools.md5(phone + '_' + add_day); //签名
                // 根据调试功能是否开启来具体是否发送短信验证
                let isSendMsgEnable = this.config.sendMsg.enable;
                if (!isSendMsgEnable) {
                    return this.ctx.body = {
                        success: true,
                        msg: '调试环境-默认手机验证码为：1234',
                        sign: sign
                    };
                }

                let ip = this.ctx.request.ip.replace(/::ffff:/, ''); //获取客户端ip         
                let phone_code = await this.service.tools.getRandomNum(4); // 发送短信的随机码    
                let userTempResult = await this.ctx.model.UserTemp.find({ "sign": sign, add_day: add_day });
                //1个ip 一天只能发10个手机号
                let ipCount = await this.ctx.model.UserTemp.find({ "ip": ip, add_day: add_day }).count();
                if (userTempResult.length) {
                    const userTemper = userTempResult[0];
                    if (userTemper.send_count < 6 && ipCount < 10) { // 执行发送
                        let send_count = userTemper.send_count + 1;
                        await this.ctx.model.UserTemp.updateOne({ "_id": userTemper._id }, { "send_count": send_count });

                        //发送短信
                        // this.service.sendCode.send(phone,'随机验证码')
                        this.ctx.session.phone_code = phone_code;
                        // console.log('---------------------------------')
                        // console.log(phone_code, ipCount);

                        this.ctx.body = {
                            success: true,
                            msg: '短信发送成功',
                            sign: sign
                        }
                    } else {
                        this.ctx.body = { "success": false, msg: '当前手机号码发送次数达到上限，明天重试' };
                    }
                } else {
                    let userTmep = new this.ctx.model.UserTemp({
                        phone,
                        add_day,
                        sign,
                        ip,
                        send_count: 1
                    });
                    userTmep.save();

                    //发送短信
                    // this.service.sendCode.send(phone,'随机验证码')  
                    this.ctx.session.phone_code = phone_code;
                    this.ctx.body = {
                        success: true,
                        msg: '短信发送成功',
                        sign: sign
                    }
                }
            }
        }
    }
}

module.exports = UserController;