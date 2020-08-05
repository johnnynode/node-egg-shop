'use strict';

const url = require('url');

module.exports = (options, app) => {
    return async function adminauth(ctx, next) {
        /*
            1、用户没有登录跳转到登录页面
            2、只有登录以后才可以访问后台管理系统
        */
        ctx.state.csrf = ctx.csrf; // 全局变量
        ctx.state.prevPage = ctx.request.headers.referer; // 全局变量
        const pathname = url.parse(ctx.request.url).pathname;

        if (ctx.session.adminInfo) {
            ctx.state.adminInfo = ctx.session.adminInfo; // 挂载全局变量
            const hasAuth = await ctx.service.admin.checkAuth();
            // console.log('hasAuth', hasAuth);
            if (hasAuth) {
                // 获取权限列表
                ctx.state.sideList = await ctx.service.admin.getAuthList(ctx.session.adminInfo.role_id);
                // console.log('ctx.session.useadminInforinfo.role_id', ctx.session.adminInfo.role_id);
                // console.log('ctx.state.sideList', ctx.state.sideList);
                await next();
            } else {
                ctx.body = '您没有权限访问当前地址';
            }
        } else {
            // 排除不需要做权限判断的页面  /admin/verify?mt=0.7466881301614958
            if (pathname === '/admin/login' || pathname === '/admin/doLogin' || pathname === '/admin/verify') {
                await next();
            } else {
                ctx.redirect('/admin/login');
            }
        }
    };
};