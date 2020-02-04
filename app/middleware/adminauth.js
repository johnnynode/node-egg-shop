'use strict';

const url = require('url');

module.exports = options => {
  return async function adminauth(ctx, next) {
    /*
        1、用户没有登录跳转到登录页面
        2、只有登录以后才可以访问后台管理系统
    */
    ctx.state.csrf = ctx.csrf; // 全局变量
    const pathname = url.parse(ctx.request.url).pathname;

    if (ctx.session.userinfo) {
      ctx.state.userinfo = ctx.session.userinfo; // 挂载全局变量
      await next();
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
