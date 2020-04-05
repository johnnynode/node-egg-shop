'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const webMiddleware = app.middleware.webauth({}, app); // 获取配置的前台路由中间件
    const userAuthMiddleware = app.middleware.userauth({}, app); // 获取配置的前台路由中间件

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
    router.get('/cart/checkout', webMiddleware, userAuthMiddleware, controller.web.cart.checkout); // 去结算

    // 订单相关
    router.post('/order/submit', webMiddleware, userAuthMiddleware, controller.web.order.submit); // 购物车提交订单
    router.get('/order/confirm', webMiddleware, userAuthMiddleware, controller.web.order.confirm); // 确认订单

    // 用户相关 如果存在用户信息，一些接口和路由可以在中间件中进行一些处理屏蔽 todo
    router.get('/user/registerStep1', webMiddleware, controller.web.user.registerStep1);
    router.get('/user/sendCode', webMiddleware, controller.web.user.sendCode);
    router.get('/user/registerStep2', webMiddleware, controller.web.user.registerStep2);
    router.get('/user/validatePhoneCode', webMiddleware, controller.web.user.validatePhoneCode);
    router.get('/user/registerStep3', webMiddleware, controller.web.user.registerStep3);
    router.post('/user/doRegister', webMiddleware, controller.web.user.doRegister);
    router.get('/user/loginOut', webMiddleware, controller.web.user.loginOut);
    router.get('/user/login', webMiddleware, controller.web.user.login);
    router.post('/user/doLogin', webMiddleware, controller.web.user.doLogin);

    // 用户 address 收货地址（api接口）
    router.post('/user/addAddress', webMiddleware, userAuthMiddleware, controller.web.address.addAddress);
    router.get('/user/getAddressList', webMiddleware, userAuthMiddleware, controller.web.address.getAddressList);
    router.get('/user/getOneAddress', webMiddleware, userAuthMiddleware, controller.web.address.getOneAddress);
    router.get('/user/changeDefaultAddress', webMiddleware, userAuthMiddleware, controller.web.address.changeDefaultAddress);
    router.post('/user/editAddress', webMiddleware, userAuthMiddleware, controller.web.address.editAddress);

    // 通用功能
    router.get('/web/verify', controller.web.base.verify); // 验证码



}