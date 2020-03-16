'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;

    router.get('/', controller.web.index.index);
    router.get('/plist', controller.web.product.list);
    router.get('/pinfo', controller.web.product.info);
    router.get('/cart', controller.web.flow.cart);

    //用户中心
    router.get('/login', controller.web.user.login);
    router.get('/register', controller.web.user.register);
    router.get('/user', controller.web.user.welcome);
    router.get('/user/order', controller.web.user.order);
}