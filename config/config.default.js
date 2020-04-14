/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1589092851067_1375';

    // session conf
    config.session = {
        key: 'SESSION_ID',
        maxAge: 864000000,
        httpOnly: true,
        encrypt: true,
        renew: true, //  延长会话有效期
    };

    // add your middleware config here
    config.middleware = ['adminauth', 'webauth'];
    config.adminauth = {
        match: '/admin',
    };

    // templates conf
    config.view = {
        mapping: {
            '.html': 'ejs',
            '.nj': 'nunjucks',
        },
    };

    // 文件上传加入白名单
    config.multipart = {
        fields: '50', // 这里配置支持的表单数量为50个表单元素，默认是10个
        fileExtensions: ['.apk', '.pdf'], // 加入白名单
    };

    // 文件上传配置的路径
    config.uploadDir = 'app/public/admin/upload';

    // mongoose 注意url最后面不能 添加多余的 /
    config.mongoose = {
        client: {
            url: 'mongodb://eggshopadmin:123456@127.0.0.1/eggshop',
            options: {},
        },
    };

    config.security = {
        csrf: {
            // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
            ignore: ctx => {
                // 屏蔽csrf验证的接口或路由
                let arr = [
                    '/admin/goods/goodsUploadImage',
                    '/admin/goods/goodsUploadPhoto',
                    '/user/doLogin',
                    '/user/addAddress',
                    '/user/editAddress',
                    '/pay/ali/notify',
                    '/pay/wechat/notify',
                ];
                let flag = false;
                // 进行匹配
                arr.some((item) => {
                    if (ctx.request.url === item) {
                        console.log(item);
                        flag = true;
                        return true;
                    }
                });
                return flag;
            },
        },
    };

    // 分页配置
    config.pageSize = 10;

    // 发送短信的 apiKey
    config.sendMsg = {
        yunApiKey: '', // 填入运营商提供的key (项目使用的是云片，当然后期可以切换多个)
        enable: false, // 是否开启发送短信，默认否，调试模式，开启后将走发送短信的流程
    }

    // 配置缩略图尺寸
    config.jimpSize = [{
        width: 180,
        height: 180
    }, {
        width: 400,
        height: 400
    }];

    // 配置redis数据库，使用的是egg-redis插件
    config.redis = {
        client: {
            port: 6379, // Redis port
            host: '127.0.0.1', // Redis host
            password: '', // 本机没有设置密码, 如有密码填写自己的密码
            db: 0
        }
    }

    // 支付相关配置：微信，支付宝
    config.pay = {
        wechat: {
            config: {
                mch_id: '', // 商户id
                wxappid: '', // 微信appid
                wxpaykey: '' // 微信paykey
            },
            basicParams: {
                notify_url: 'http://127.0.0.1:7001/pay/wechat/notify' //注意回调地址必须在 微信商户平台配置 不能用127，用配置的域名
            }
        },
        ali: {
            options: {
                app_id: '', // 支付宝应用id
                appPrivKeyFile: '', // 应用私钥 字符串即可，文件需要读取同样是字符串
                alipayPubKeyFile: '' // 支付宝公钥
            },
            basicParams: {
                return_url: 'http://127.0.0.1:7001/pay/ali/return', // 支付成功返回地址 此处仅作为举例 匹配路由 后期可配置调试环境、测试环境和线上环境 区分不同域名
                notify_url: 'http://127.0.0.1:7001/pay/ali/notify' //支付成功异步通知地址 此处仅作为举例
            }
        }
    }

    // 配置es
    config.elasticsearch = {
        host: 'localhost:9200',
        apiVersion: '7.x'
    };

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    return {
        ...config,
        ...userConfig
    };
};