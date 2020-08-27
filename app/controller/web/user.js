'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    //登录
    async login() {
        let returnUrl = this.ctx.request.query.returnUrl;
        returnUrl = returnUrl ? decodeURIComponent(returnUrl) : '/';
        await this.ctx.render('web/user/login.html', { returnUrl });
    }

    async doLogin() {
        let username = this.ctx.request.body.username;
        let password = this.ctx.request.body.password;
        let web_code = this.ctx.request.body.web_code;

        try {
            if (web_code != this.ctx.session.web_code) {
                //重新生成验证码 为了安全 多一道防线，防止用户从非浏览器通过接口请求过来突破验证码
                let captcha = await this.service.tools.captcha(120, 50);
                this.ctx.session.web_code = captcha.text;
                this.ctx.body = {
                    success: false,
                    msg: '输入的图形验证码不正确'
                }
            } else {
                password = this.service.tools.md5(password);
                let userResult = await this.ctx.model.User.find({ "phone": username, password: password }, '_id phone last_ip add_time email status');
                if (userResult.length) {
                    //cookies 安全 加密
                    this.service.cookies.set('userinfo', userResult[0]);
                    this.ctx.body = {
                        success: true,
                        msg: '登录成功'
                    }
                } else {
                    //重新生成验证码
                    let captcha = await this.service.tools.captcha(120, 50);
                    this.ctx.session.web_code = captcha.text;
                    this.ctx.body = {
                        success: false,
                        msg: '用户名或者密码错误'
                    }
                }
            }
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    // 注册第一步
    async registerStep1() {
        await this.ctx.render('web/user/register_step1.html');
    }

    // 第一步发送短信验证码
    async sendCode() {
        let phone = this.ctx.request.query.phone;
        let web_code = this.ctx.request.query.web_code; //用户输入的验证码

        try {
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
                    let sign = this.service.tools.md5(phone + '_' + add_day); //签名
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
                    let phone_code = this.service.tools.getRandomNum(4); // 发送短信的随机码    
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
                            this.ctx.body = { "success": false, msg: '当前手机号码或ip发送次数达到上限，明天重试' };
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
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
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

        try {
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
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    //验证验证码
    async validatePhoneCode() {
        let phone_code = this.ctx.request.query.phone_code;
        if (this.ctx.session.phone_code != phone_code) {
            return this.ctx.body = {
                success: false,
                msg: '您输入的手机验证码错误'
            };
        }

        try {
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
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    //注册第三步  输入密码
    async registerStep3() {
        let isSendMsgEnable = this.config.sendMsg.enable;
        let sign = this.ctx.request.query.sign;
        let phone_code = this.ctx.request.query.phone_code;
        let phone = this.ctx.request.query.phone; // 用于调试
        let msg = this.ctx.request.query.msg || '';
        // 调试状态下的处理
        if (!isSendMsgEnable) {
            return await this.ctx.render('web/user/register_step3.html', {
                sign,
                phone_code,
                phone,
                msg
            });
        }

        try {
            // 正常流程
            let add_day = await this.service.tools.getDay(); //年月日   
            let userTempResult = await this.ctx.model.UserTemp.find({ "sign": sign, add_day: add_day });
            if (!userTempResult.length) {
                this.ctx.redirect('/user/registerStep1');
            } else {
                await this.ctx.render('web/user/register_step3.html', {
                    sign: sign,
                    phone_code: phone_code,
                    msg: msg
                });
            }
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    //完成注册 post
    async doRegister() {
        let isSendMsgEnable = this.config.sendMsg.enable;
        let sign = this.ctx.request.body.sign;
        let phone_code = this.ctx.request.body.phone_code;
        let phone = this.ctx.request.body.phone;
        let add_day = await this.service.tools.getDay(); //年月日       
        let password = this.ctx.request.body.password;
        let rpassword = this.ctx.request.body.rpassword;
        let ip = this.ctx.request.ip.replace(/::ffff:/, '');

        if (this.ctx.session.phone_code != phone_code) {
            //非法操作
            return this.ctx.redirect('/user/registerStep1');
        }

        try {
            let userTempResult = await this.ctx.model.UserTemp.find({ "sign": sign, add_day: add_day });
            if (isSendMsgEnable && !userTempResult.length) {
                //非法操作
                return this.ctx.redirect('/user/registerStep1');
            }
            //传入参数正确 执行增加操作
            if (password.length < 6 || password != rpassword) {
                let msg = '密码不能小于6位并且密码和确认密码必须一致';
                return this.ctx.redirect('/user/registerStep3?sign=' + sign + '&phone_code=' + phone_code + '&msg=' + msg);
            }
            // 做的更安全的一些做法是将用户, 管理员登录的信息保存在一个用户表中, 登录用户名,时间,错误密码等存入新的user_log, admin_log表中 TODO
            // 处理调试环境下的一些问题
            phone = isSendMsgEnable ? userTempResult[0].phone : phone;
            console.log('phone: ', phone);
            let userModel = new this.ctx.model.User({
                    phone,
                    password: this.service.tools.md5(password),
                    last_ip: ip
                })
                //保存用户
            let userReuslt = await userModel.save();
            if (userReuslt) {
                //获取用户信息
                let userinfo = await this.ctx.model.User.find({ phone }, '_id phone last_ip add_time email status')
                    //用户注册成功以后默认登录
                    //cookies 安全 加密
                this.service.cookies.set('userinfo', userinfo[0]);
                this.ctx.redirect('/');
            }
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    //退出登录
    async loginOut() {
        this.service.cookies.set('userinfo', '');
        this.ctx.redirect('/');
    }

    // 用户中心 欢迎
    async welcome() {
        await this.ctx.render('web/user/welcome.html');
    }

    // 用户订单
    async order() {
        try {
            const uid = this.ctx.service.cookies.get('userinfo')._id;
            const page = this.ctx.request.query.page || 1;
            let order_status = this.ctx.request.query.order_status || -1;
            let keywords = this.ctx.request.query.keywords;
            let json = { "uid": this.app.mongoose.Types.ObjectId(uid) }; //查询当前用户下面的所有订单

            //筛选
            if (order_status != -1) {
                json = Object.assign(json, { "order_status": parseInt(order_status) });
            }

            //搜索
            if (keywords) {
                // 商品名 模糊查询
                let orderItemJson = Object.assign({ "uid": this.app.mongoose.Types.ObjectId(uid) }, { "product_title": { $regex: new RegExp(keywords) } });
                let orderItemResult = await this.ctx.model.OrderItem.find(orderItemJson);
                // 将查询到的数据进行数据转换
                if (orderItemResult.length) {
                    let tempArr = [];
                    orderItemResult.forEach(value => {
                        tempArr.push({
                            _id: value.order_id
                        });
                    });
                    // 拼接json
                    json = Object.assign(json, {
                        $or: tempArr // 这里拼接查询的条件
                    });
                } else {
                    json = Object.assign(json, {
                        $or: [{ 1: -1 }] // 这里是一个不成立的条件
                    });
                }
            }
            const pageSize = this.config.pageSize;
            // 总数量
            const totalNum = await this.ctx.model.Order.find(json).countDocuments();
            //聚合管道要注意顺序
            const result = await this.ctx.model.Order.aggregate([{
                    $lookup: {
                        from: 'order_item',
                        localField: '_id',
                        foreignField: 'order_id',
                        as: 'orderItems',
                    },
                },
                {
                    $sort: { "add_time": -1 }
                },
                {
                    $match: json //条件
                },
                {
                    $skip: (page - 1) * pageSize,
                },
                {
                    $limit: pageSize,
                }
            ]);
            await this.ctx.render('web/user/order.html', {
                list: result,
                totalPages: Math.ceil(totalNum / pageSize),
                page,
                order_status: order_status
            });
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async orderinfo() {
        try {
            const uid = this.ctx.service.cookies.get('userinfo')._id;
            const id = this.ctx.request.query.id;
            let orderResult = await this.ctx.model.Order.find({ "uid": uid, "_id": id });
            //不可扩展对象的解决方法
            orderResult = JSON.parse(JSON.stringify(orderResult));
            orderResult[0].orderItems = await this.ctx.model.OrderItem.find({ "order_id": id });
            await this.ctx.render('web/user/order_info.html', {
                orderInfo: orderResult[0]
            });
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async address() {
        this.ctx.body = '收货地址';
    }
}

module.exports = UserController;