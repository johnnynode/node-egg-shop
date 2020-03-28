'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 配置前台路由中间件
    const webMiddleware = app.middleware.webauth({}, app);

    router.get('/', webMiddleware, controller.web.index.index);
    router.get('/plist', webMiddleware, controller.web.product.list); // 商品列表
    router.get('/pinfo', webMiddleware, controller.web.product.info); // 商品详情
    router.get('/getImagelist', webMiddleware, controller.web.product.getImagelist); // 商品详情-图片列表

    // 购物车
    router.get('/addCart', controller.web.cart.addCart);
    router.get('/addCartSuccess', controller.web.cart.addCartSuccess);
    router.get('/cart', controller.web.cart.cartList);
    router.get('/incCart', controller.web.cart.incCart);
    router.get('/decCart', controller.web.cart.decCart);
    router.get('/changeOneCart', controller.web.cart.changeOneCart);
    router.get('/changeAllCart', controller.web.cart.changeAllCart);
    router.get('/removeCart', controller.web.cart.removeCart);

    // 用户中心
    router.get('/login', controller.web.user.login);
    router.get('/register', controller.web.user.register);
    router.get('/user', controller.web.user.welcome);
    router.get('/user/order', controller.web.user.order);
}