'use strict';

const fs = require('fs');
const pump = require('mz-modules/pump');
const BaseController = require('./base.js');

class GoodsController extends BaseController {
    async index() {
        await this.ctx.render('admin/goods/index');
    }

    async add() {
        // 获取所有的颜色值
        const colorResult = await this.ctx.model
            .GoodsColor.find({});

        // 获取所有的商品类型
        const goodsType = await this.ctx.model.GoodsType.find({});
        await this.ctx.render('admin/goods/add', {
            colorResult,
            goodsType,
        });
    }

    async doAdd() {
        console.log(this.ctx.request.body);
    }

    // 获取商品类型的属性 api接口
    async goodsTypeAttribute() {
        const cate_id = this.ctx.request.query.cate_id;
        // 注意 await
        const goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ cate_id });
        console.log(goodsTypeAttribute);
        // 返回json数据
        this.ctx.body = {
            result: goodsTypeAttribute,
        };
    }

    async goodsUploadImage() {
        // 实现图片上传
        const parts = this.ctx.multipart({ autoFields: true });
        let files = {};
        let stream;
        while ((stream = await parts())) {
            if (!stream.filename) {
                break;
            }
            const fieldname = stream.fieldname; // file表单的名字

            // 上传图片的目录
            const dir = await this.service.tools.getUploadFile(stream.filename);
            const target = dir.uploadDir;
            const writeStream = fs.createWriteStream(target);

            await pump(stream, writeStream);

            files = Object.assign(files, {
                [fieldname]: dir.saveDir,
            });
        }
        console.log(files);
        // 图片的地址转化成 {link: 'path/to/image.jpg'}
        this.ctx.body = { link: files.file };
    }
}

module.exports = GoodsController;