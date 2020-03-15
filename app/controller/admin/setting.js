'use strict';

const fs = require('fs');
const pump = require('mz-modules/pump');
const BaseController = require('./base.js');

class SettingController extends BaseController {
    async index() {
        let list = await this.ctx.model.Setting.find({});
        list = list.length && list[0] || {};
        await this.ctx.render('admin/setting/index', {
            list
        });
    }

    async doEdit() {
        let parts = this.ctx.multipart({ autoFields: true });
        let files = {};
        let stream;
        while ((stream = await parts())) {
            if (!stream.filename) {
                break;
            }
            let fieldname = stream.fieldname; //file表单的名字

            // 上传图片的目录
            let dir = await this.service.tools.getUploadFile(stream.filename);
            let target = dir.uploadDir;
            let writeStream = fs.createWriteStream(target);
            await pump(stream, writeStream);
            files = Object.assign(files, {
                [fieldname]: dir.saveDir
            })
        }
        // 处理提交的数据
        let postResult = Object.assign(files, parts.field);
        // 先查询一下是否存在，存在则编辑，不存在则添加
        const oldRes = await this.ctx.model.Setting.find({});
        if (!oldRes.length) {
            const setting = new this.ctx.model.Setting(postResult);
            await setting.save(); // 注意
        } else {
            await this.ctx.model.Setting.updateOne({}, postResult);
        }
        await this.success('/admin/setting', (!oldRes.length ? '新增' : '修改') + '网站设置成功');
    }
}

module.exports = SettingController;