'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 后台登录
  router.get('/admin/login', controller.admin.login.index);
  router.post('/admin/doLogin', controller.admin.login.doLogin);

  // 通用功能路由
  router.get('/admin/verify', controller.admin.base.verify);
  router.get('/admin/loginOut', controller.admin.login.loginOut);
  router.get('/admin/changeStatus', controller.admin.base.changeStatus);
  router.get('/admin/editVal', controller.admin.base.editVal);

  // 通用删除功能
  router.get('/admin/delete', controller.admin.base.delete);

  // 管理员管理
  router.get('/admin/manager', controller.admin.manager.index);
  router.get('/admin/manager/add', controller.admin.manager.add);
  router.post('/admin/manager/doAdd', controller.admin.manager.doAdd);
  router.get('/admin/manager/edit', controller.admin.manager.edit);
  router.post('/admin/manager/doEdit', controller.admin.manager.doEdit);

  // 角色管理
  router.get('/admin/role', controller.admin.role.index);
  router.get('/admin/role/add', controller.admin.role.add);
  router.post('/admin/role/doAdd', controller.admin.role.doAdd);
  router.post('/admin/role/doEdit', controller.admin.role.doEdit);
  router.get('/admin/role/edit', controller.admin.role.edit);
  router.get('/admin/role/auth', controller.admin.role.auth);
  router.post('/admin/role/doAuth', controller.admin.role.doAuth);

  // 权限管理
  router.get('/admin/access', controller.admin.access.index);
  router.get('/admin/access/add', controller.admin.access.add);
  router.post('/admin/access/doAdd', controller.admin.access.doAdd);
  router.get('/admin/access/edit', controller.admin.access.edit);
  router.post('/admin/access/doEdit', controller.admin.access.doEdit);

  // 轮播图 上传图片
  router.get('/admin/focus/single', controller.admin.focus.single); // 测试程序
  router.get('/admin/focus/multi', controller.admin.focus.multi); // 测试程序
  router.post('/admin/focus/doSingleUpload', controller.admin.focus.doSingleUpload); // 测试程序
  router.post('/admin/focus/doMultiUpload', controller.admin.focus.doMultiUpload); // 测试程序

  router.get('/admin/focus', controller.admin.focus.index);
  router.get('/admin/focus/add', controller.admin.focus.add);
  router.get('/admin/focus/edit', controller.admin.focus.edit);
  router.post('/admin/focus/doEdit', controller.admin.focus.doEdit);
  router.post('/admin/focus/doAdd', controller.admin.focus.doAdd);
};
