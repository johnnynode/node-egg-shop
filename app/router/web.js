'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const webMiddleware = app.middleware.webauth({}, app); // 获取配置的前台路由中间件

    router.get('/', webMiddleware, controller.web.index.index);
    router.get('/plist', webMiddleware, controller.web.product.list); // 商品列表
    router.get('/pinfo', webMiddleware, controller.web.product.info); // 商品详情
    router.get('/getImagelist', webMiddleware, controller.web.product.getImagelist); // 商品详情-图片列表

    // 购物车
    router.get('/addCart', webMiddleware, controller.web.cart.addCart);
    router.get('/addCartSuccess', webMiddleware, controller.web.cart.addCartSuccess);
    router.get('/cart', webMiddleware, controller.web.cart.cartList);
    router.get('/incCart', controller.web.cart.incCart);
    router.get('/decCart', controller.web.cart.decCart);
    router.get('/changeOneCart', controller.web.cart.changeOneCart);
    router.get('/changeAllCart', controller.web.cart.changeAllCart);
    router.get('/removeCart', controller.web.cart.removeCart);

    // 用户相关 如果存在用户信息，一些接口和路由可以在中间件中进行一些处理屏蔽 todo
    router.get('/user/registerStep1', webMiddleware, controller.web.user.registerStep1);
    router.get('/user/sendCode', webMiddleware, controller.web.user.sendCode);
    router.get('/user/registerStep2', webMiddleware, controller.web.user.registerStep2);
    router.get('/user/validatePhoneCode', webMiddleware, controller.web.user.validatePhoneCode);
    router.get('/user/registerStep3', webMiddleware, controller.web.user.registerStep3);
    router.post('/user/doRegister', webMiddleware, controller.web.user.doRegister);

    /*
    router.get('/user/login', controller.web.user.login);
    router.get('/user', controller.web.user.welcome); // 用户中心
    router.get('/user/order', controller.web.user.order);
    */

    // 通用功能
    router.get('/web/verify', controller.web.base.verify); // 验证码

}