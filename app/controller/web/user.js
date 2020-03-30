'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    //登录
    async login() {
        await this.ctx.render('web/user/login.html');
    }

    // 注册第一步
    async registerStep1() {
        await this.ctx.render('web/user/register_step1.html');
    }

    // 第一步发送短信验证码
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
                let add_day = this.service.tools.getDay(); //年月日    
                let sign = await this.service.tools.md5(phone + '_' + add_day); //签名
                // 根据调试功能是否开启来具体是否发送短信验证
                let isSendMsgEnable = this.config.sendMsg.enable;
                if (!isSendMsgEnable) {
                    this.ctx.session.phone_code = '1234';
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
                        await this.ctx.model.UserTemp.updateOne({ "_id": userTemper._id }, { "send_count": send_count, "add_time": this.service.tools.getTime() });

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

    //注册第二步  验证码验证码是否正确
    async registerStep2() {
        let sign = this.ctx.request.query.sign;
        let web_code = this.ctx.request.query.web_code;
        let phone = this.ctx.request.query.phone; // 这里只用作调试模式下的参数
        let isSendMsgEnable = this.config.sendMsg.enable;
        if (!isSendMsgEnable) {
            return await this.ctx.render('web/user/register_step2.html', {
                sign,
                phone,
                web_code
            });
        }
        // 正常的查询验证流程
        let add_day = await this.service.tools.getDay(); //年月日   
        let userTempResult = await this.ctx.model.UserTemp.find({ "sign": sign, add_day: add_day });
        if (!userTempResult.length) {
            this.ctx.redirect('/user/registerStep1'); // 不存在则跳转回去
        } else {
            await this.ctx.render('web/user/register_step2.html', {
                sign,
                phone: userTempResult[0].phone,
                web_code
            });
        }
    }

    //验证验证码
    async validatePhoneCode() {
        let phone_code = this.ctx.request.query.phone_code;
        if (this.ctx.session.phone_code != phone_code) {
            this.ctx.body = {
                success: false,
                msg: '您输入的手机验证码错误'
            }
        } else {
            let sign = this.ctx.request.query.sign;
            let isSendMsgEnable = this.config.sendMsg.enable;
            if (!isSendMsgEnable) {
                return this.ctx.body = {
                    success: true,
                    msg: '验证码输入正确',
                    sign
                }
            }
            // 正常的查询校验流程
            let add_day = await this.service.tools.getDay(); //年月日   
            let userTempResult = await this.ctx.model.UserTemp.find({ "sign": sign, add_day: add_day });
            if (!userTempResult.length) {
                this.ctx.body = {
                    success: false,
                    msg: '参数错误'
                }
            } else {
                //判断验证码是否超时
                let nowTime = await this.service.tools.getTime();
                // 超过30分钟了，那么验证码过期
                if ((userTempResult[0].add_time - nowTime) / 1000 / 60 > 30) {
                    this.ctx.body = {
                        success: false,
                        msg: '验证码已经过期'
                    }
                } else {
                    // 用户表有没有当前这个手机号 手机号有没有注册
                    let userResult = await this.ctx.model.User.find({ "phone": userTempResult[0].phone });
                    if (userResult.length) {
                        this.ctx.body = {
                            success: false,
                            msg: '此用户已经存在'
                        }
                    } else {
                        this.ctx.body = {
                            success: true,
                            msg: '验证码输入正确',
                            sign
                        }
                    }
                }
            }
        }
    }

    //注册第三步  输入密码
    async registerStep3() {
        await this.ctx.render('web/user/register_step3.html');
    }

    //完成注册  post
    async doRegister() {
        this.ctx.body = '完成注册';
    }

}

module.exports = UserController;