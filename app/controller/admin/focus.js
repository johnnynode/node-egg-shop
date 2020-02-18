'use strict';

const path = require('path');
const fs = require('fs');
const pump = require('mz-modules/pump');

/*
1、安装mz-modules
https://github.com/node-modules/mz-modules
https://github.com/mafintosh/pump
*/

const Controller = require('egg').Controller;

class FocusController extends Controller {
  async index() {
    await this.ctx.render('admin/focus/index');
  }
  async doSingleUpload() {
    // 单文件上传
    const stream = await this.ctx.getFileStream(); // 获取表单提交的数据
    // console.log(stream);
    // 上传的目录    注意目录要存在            zzz/ewfrewrewt/dsgdsg.jpg    path.basename()        dsgdsg.jpg
    const target = 'app/public/admin/upload/' + path.basename(stream.filename);
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);
    // stream.pipe(writeStream);   //可以用， 但是不建议
    this.ctx.body = {
      url: target,
      fields: stream.fields, // 表单的其他数据
    };
  }

  async multi() {
    await this.ctx.render('admin/focus/multi');
  }

  async doMultiUpload() {
    // { autoFields: true }:可以将除了文件的其它字段提取到 parts 的 filed 中
    // 多个图片/文件
    const parts = this.ctx.multipart({ autoFields: true });
    const files = [];
    let stream;
    // 为了程序的严谨性和避免用户的误操作造成的服务器崩溃，建议加上try catch
    while ((stream = await parts())) {
      if (!stream.filename) { // 注意如果没有传入图片直接返回
        return;
      }
      const fieldname = stream.fieldname; // file表单的名字  face
      const target = 'app/public/admin/upload/' + path.basename(stream.filename);
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream); // 写入并销毁当前流   (egg  demo提供的)
      files.push({
        [fieldname]: target,
      });
    }
    this.ctx.body = {
      files,
      fields: parts.field, // 所有表单字段都能通过 `parts.fields`            放在while循环后面
    };
  }
}

module.exports = FocusController;

/*
其他说明信息：
为了防止浏览器卡死，建议在上传失败的时候，将上传文件流消费掉
const sendToWormhole = require('stream-wormhole');
try {
  result = await ctx.oss.put(name, stream);
} catch(err) {
  // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
  await sendToWormhole(stream);
  throw err;
}

上面是之前的eggjs官方处理版本，可参考新官方说明，找到文件上传部分：
https://eggjs.org/zh-cn/basics/controller.html#stream-%E6%A8%A1%E5%BC%8F

我们实现的部分 pump 模块底层已经做了这些工作
*/
