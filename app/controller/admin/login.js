'use strict';

const BaseController = require('./base');

class LoginController extends BaseController {
  async index() {
    const { ctx } = this;
    await ctx.render('admin/login');
  }

  /*
    注意事项：

    1）主要步骤
    1、需要在前端页面用js验证用户输入的信息是否正确
    2、后台获取数据以后判断数据格式是否正确
    3、后台获取表单提交的数据
    4、后台判断验证码是否正确

    2）数据库相关
    1、配置mongoose
    2、创建操作数据库的model
    3、在用户表（集合）中查询当前用户是否存在
    （mongoose操作mongodb数据库）https://www.npmjs.com/package/egg-mongoose
    4、如果数据库有此用户（登录成功） ：保存用户信息 跳转到后台管理系统
    5、如果数据库有此用户（登录失败）： 跳转到登录页面
    6、验证码错误： 跳转到登录页面, 提示验证码不正确
  */

  async doLogin() {
    // await this.success('/admin/login');
    const { ctx } = this;
    // console.log(ctx.request.body);

    // 获取提交的数据
    const code = ctx.request.body.code;
    // console.log('code: ', code);
    // console.log('.........');
    // 相关校验工作 先校验验证码
    if (code.toUpperCase() === ctx.session.code.toUpperCase()) {
      // 获取提交的数据
      const username = ctx.request.body.username;
      const password = await this.service.tools.md5(ctx.request.body.password); // 前端也要三次加密

      // 通过model查询数据库
      const result = await ctx.model.Admin.find({ username, password });
      if (result.length) {
        // 登录成功
        // 1、保存用户信息到session
        this.ctx.session.userinfo = result[0];
        // 2、跳转到用户中心
        ctx.redirect('/admin/manager');
      } else {
        await this.error('/admin/login', '用户名或者密码不对');
      }
    } else {
      // 注意：异步和await
      await this.error('/admin/login', '验证码错误');
    }
  }

  // 退出登录
  async loginOut() {
    const { ctx } = this;
    ctx.session.userinfo = null;
    ctx.redirect('/admin/login');
  }
}

module.exports = LoginController;
