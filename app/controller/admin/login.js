'use strict';

const BaseController = require('./base');

class LoginController extends BaseController {
    async index() {
        const { ctx } = this;
        await ctx.render('admin/login');
    }

    /*
        主要步骤
        1、需要在前端页面用js验证用户输入的信息是否正确
        2、后台获取表单提交的数据并判断数据格式是否正确 【暂未处理】
        3、后台判断验证码是否正确
        4、后台判断用户是否合法
      */

    async doLogin() {
        const { ctx } = this;

        // 获取提交的数据
        const code = ctx.request.body.code;
        // 相关校验工作 先校验验证码
        if (code.toUpperCase() === ctx.session.code.toUpperCase()) {
            // 获取提交的数据
            const username = ctx.request.body.username;
            const password = this.service.tools.md5(ctx.request.body.password);

            // 通过model查询数据库
            const result = await ctx.model.Admin.find({ username, password });
            if (result.length) {
                // 登录成功
                // 1、保存用户信息到session
                this.ctx.session.adminInfo = result[0];
                // 2、跳转到用户中心
                ctx.redirect('/admin');
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
        ctx.session.adminInfo = null;
        ctx.redirect('/admin/login');
    }
}

module.exports = LoginController;