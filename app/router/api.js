module.exports = app => {
    const { router, controller } = app;

    router.get('/api/index', controller.api.default.index);
    router.get('/api/productList', controller.api.default.productList);
    router.post('/api/register', controller.api.default.register);
    router.put('/api/editUser', controller.api.default.editUser);
    router.delete('/api/deleteUser', controller.api.default.deleteUser);
};