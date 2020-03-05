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
    config.middleware = ['adminauth'];
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
                if (ctx.request.url === '/admin/goods/goodsUploadImage' || ctx.request.url == '/admin/goods/goodsUploadPhoto') {
                    return true;
                }
                return false;
            },
        },
    };

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    return {
        ...config,
        ...userConfig,
    };
};