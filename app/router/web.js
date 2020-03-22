'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 配置前台路由中间件
    const webMiddleware = app.middleware.webauth({}, app);

    router.get('/', webMiddleware, controller.web.index.index);
    router.get('/plist', webMiddleware, controller.web.product.list);
    router.get('/pinfo', webMiddleware, controller.web.product.info);
    router.get('/cart', webMiddleware, controller.web.flow.cart);

    // 用户中心
    router.get('/login', controller.web.user.login);
    router.get('/register', controller.web.user.register);
    router.get('/user', controller.web.user.welcome);
    router.get('/user/order', controller.web.user.order);
}