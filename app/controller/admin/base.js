// 父类
'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(redirectUrl, message) {
    await this.ctx.render('admin/public/success', {
      redirectUrl,
      message: message || '操作成功!',
    });
  }

  async error(redirectUrl, message) {
    await this.ctx.render('admin/public/error', {
      redirectUrl,
      message: message || '操作失败!',
    });
  }

  async verify() {
    const captcha = await this.service.tools.captcha(); // 服务里面的方法
    this.ctx.response.type = 'image/svg+xml'; /* 指定返回的类型*/
    this.ctx.body = captcha.data; /* 给页面返回一张图片*/
  }

  // 封装一个删除方法
  async delete() {
    /*
    1、获取要删除的数据库表   model
    2、获取要删除数据的id   _id
    3、执行删除
    4、返回到以前的页面 ctx.request.headers['referer'] (上一页的地址)
    */

    // 获取参数
    const model = this.ctx.request.query.model; // Role
    const id = this.ctx.request.query.id;
    await this.ctx.model[model].deleteOne({ _id: id }); // 注意写法
    // this.ctx.redirect(this.ctx.request.headers['referer']); // 这种写法可以，但是需要在中间件中配置成全局变量，通用化
    this.ctx.redirect(this.ctx.state.prevPage);
  }

  // 改变状态的方法  Api接口
  async changeStatus() {


    const model = this.ctx.request.query.model; /* 数据库表 Model*/
    const attr = this.ctx.request.query.attr; /* 更新的属性 如:status is_best */
    const id = this.ctx.request.query.id; /* 更新的 id*/
    const result = await this.ctx.model[model].find({ _id: id });
    let json = {};
    if (result.length) {
      json = result[0][attr] === 1 ? { [attr]: 0 } : { [attr]: 1 };
      // 执行更新操作
      const updateResult = await this.ctx.model[model].updateOne({ _id: id }, json);
      if (updateResult) {
        this.ctx.body = { message: '更新成功', success: true, status: json[attr] };
      } else {
        this.ctx.body = { message: '更新失败', success: false };
      }
    } else {
      // 接口
      this.ctx.body = { message: '更新失败,参数错误', success: false };
    }
  }
}

module.exports = BaseController;
