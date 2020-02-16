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
    // 多个图片/文件
  }
}

module.exports = FocusController;
