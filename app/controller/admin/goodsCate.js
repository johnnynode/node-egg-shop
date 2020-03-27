'use strict';

const fs = require('fs');
const pump = require('mz-modules/pump');

const BaseController = require('./base.js');
class GoodsCateController extends BaseController {
    async index() {
        // 表自关联进行分类查询
        const result = await this.ctx.model.GoodsCate.aggregate([{
                $lookup: {
                    from: 'goods_cate',
                    localField: '_id',
                    foreignField: 'pid',
                    as: 'items',
                },
            },
            {
                $match: {
                    pid: '0',
                },
            },
        ]);
        // console.log('===========');
        // console.log(JSON.stringify(result));
        await this.ctx.render('admin/goodsCate/index', {
            list: result,
        });
    }
    async add() {
        const result = await this.ctx.model.GoodsCate.find({ pid: '0' });
        await this.ctx.render('admin/goodsCate/add', {
            cateList: result,
        });
    }

    async doAdd() {
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

            // 上传图片成功以后生成缩略图
            this.service.tools.jimpImg(target);
        }
        // console.log(parts.field.pid);
        if (parts.field.pid !== '0') {
            parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid); // 调用mongoose里面的方法把字符串转换成ObjectId
        }
        const goodsCate = new this.ctx.model.GoodsCate(Object.assign(files, parts.field));
        await goodsCate.save();
        await this.success('/admin/goodsCate', '增加分类成功');
    }

    async edit() {
        const id = this.ctx.request.query.id;
        const result = await this.ctx.model.GoodsCate.find({ _id: id });
        const cateList = await this.ctx.model.GoodsCate.find({ pid: '0' });

        await this.ctx.render('admin/goodsCate/edit', {
            cateList,
            list: result[0],
        });
    }

    async doEdit() {
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
            // 生成缩略图
            this.service.tools.jimpImg(target);
        }

        if (parts.field.pid !== '0') {
            parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid); // 调用mongoose里面的方法把字符串转换成ObjectId
        }

        const id = parts.field.id;
        const updateResult = Object.assign(files, parts.field);
        await this.ctx.model.GoodsCate.updateOne({ _id: id }, updateResult);
        await this.success('/admin/goodsCate', '修改分类成功');
    }
}
module.exports = GoodsCateController;