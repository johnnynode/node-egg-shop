'use strict';

const BaseController = require('./base.js');

const fs = require('fs');
const pump = require('mz-modules/pump');

class GoodsController extends BaseController {
    // 商品列表
    async index() {
        const page = this.ctx.request.query.page || 1;
        const keyword = this.ctx.request.query.keyword;
        // 注意
        let json = {};
        if (keyword) {
            json = Object.assign({ title: { $regex: new RegExp(keyword) } });
        }
        const pageSize = this.config.pageSize;

        try {
            // 获取当前数据表的总数量
            const totalNum = await this.ctx.model.Goods.find(json).count();
            const goodsResult = await this.ctx.model.Goods.find(json).skip((page - 1) * pageSize).limit(pageSize);

            await this.ctx.render('admin/goods/index', {
                list: goodsResult,
                totalPages: Math.ceil(totalNum / pageSize),
                page,
                keyword,
            });
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    // 获取商品类型的属性 api接口
    async goodsTypeAttribute() {
        const cate_id = this.ctx.request.query.cate_id;

        try {
            // 注意 await
            const goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ cate_id });
            // console.log(goodsTypeAttribute);
            this.ctx.body = {
                result: goodsTypeAttribute,
            };
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    // 上传商品详情的图片
    async goodsUploadImage() {
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
        // console.log(files);
        // 图片的地址转化成 {link: 'path/to/image.jpg'}
        this.ctx.body = { link: files.file };
    }

    // 上传相册的图片
    async goodsUploadPhoto() {
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

            // 生成缩略图
            this.service.tools.jimpImg(target);
        }

        // 图片的地址转化成 {link: 'path/to/image.jpg'}
        this.ctx.body = { link: files.file };
    }

    // 修改图片颜色
    async changeGoodsImageColor() {
        let color_id = this.ctx.request.body.color_id;
        const goods_image_id = this.ctx.request.body.goods_image_id;
        // console.log(this.ctx.request.body);
        if (color_id) {
            color_id = this.app.mongoose.Types.ObjectId(color_id);
        }

        try {
            const result = await this.ctx.model.GoodsImage.updateOne({ _id: goods_image_id }, {
                color_id,
            });
            let flag = !!result;
            this.ctx.body = { success: flag, message: '更新数据' + (flag ? '成功' : '失败') };
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    // 删除图片
    async goodsImageRemove() {
        const goods_image_id = this.ctx.request.body.goods_image_id;
        // 注意  图片要不要删掉 fs模块删除以前当前数据对应的图片

        try {
            const result = await this.ctx.model.GoodsImage.deleteOne({ _id: goods_image_id }); // 注意写法
            let flag = !!result;
            this.ctx.body = { success: flag, message: '删除数据' + (flag ? '成功' : '失败') };
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    // 添加商品
    async add() {
        try {
            // 获取所有的颜色值
            const colorResult = await this.ctx.model.GoodsColor.find({});
            // 获取所有的商品类型
            const goodsType = await this.ctx.model.GoodsType.find({});
            // 获取商品分类
            const goodsCate = await this.ctx.model.GoodsCate.aggregate([{
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
            await this.ctx.render('admin/goods/add', {
                colorResult,
                goodsType,
                goodsCate,
            });
        } catch (err) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async doAdd() {
        try {
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

            const formFields = Object.assign(files, parts.field);
            // console.log(formFields);

            // 增加商品信息
            const goodsRes = new this.ctx.model.Goods(formFields);
            const result = await goodsRes.save();

            // console.log(result._id);
            // 增加图库信息
            let goods_image_list = formFields.goods_image_list;
            if (result._id && goods_image_list) {
                // 解决上传一个图库不是数组的问题
                if (typeof(goods_image_list) === 'string') {
                    goods_image_list = new Array(goods_image_list);
                }

                for (let i = 0; i < goods_image_list.length; i++) {
                    const goodsImageRes = new this.ctx.model.GoodsImage({
                        goods_id: result._id,
                        img_url: goods_image_list[i],
                    });
                    await goodsImageRes.save();
                }
            }
            // 增加商品类型数据
            let attr_value_list = formFields.attr_value_list;
            let attr_id_list = formFields.attr_id_list;
            if (result._id && attr_id_list && attr_value_list) {
                // 对只有一个属性进行数组转换
                if (typeof(attr_id_list) === 'string') {
                    attr_id_list = new Array(attr_id_list);
                    attr_value_list = new Array(attr_value_list);
                }

                for (let i = 0; i < attr_value_list.length; i++) {
                    // 查询goods_type_attribute
                    // 下面这个if, 是比较严格的判断，可以不用，让用户随便写，填写什么，提交什么，不填也可以
                    // if (attr_value_list[i]) {
                    const goodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
                    const goodsAttrRes = new this.ctx.model.GoodsAttr({
                        goods_id: result._id,
                        cate_id: formFields.cate_id,
                        attribute_id: attr_id_list[i],
                        attribute_type: goodsTypeAttributeResult[0].attr_type,
                        attribute_title: goodsTypeAttributeResult[0].title,
                        attribute_value: attr_value_list[i],
                    });
                    await goodsAttrRes.save();
                    // }
                }
            }
            await this.success('/admin/goods', '增加商品数据成功');
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async edit() {
        try {
            // 获取修改数据的id
            const id = this.ctx.request.query.id;
            // 获取所有的颜色值
            const colorResult = await this.ctx.model.GoodsColor.find({});
            // 获取所有的商品类型
            const goodsType = await this.ctx.model.GoodsType.find({});
            // 获取商品分类
            const goodsCate = await this.ctx.model.GoodsCate.aggregate([{
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
            // 获取修改的商品
            const goodsResult = await this.ctx.model.Goods.find({ _id: id });
            let goodsColorResult = []; // 生命颜色列表
            if (goodsResult[0].goods_color.length) {
                const colorArrTemp = goodsResult[0].goods_color.split(',');
                // console.log(colorArrTemp);
                const goodsColorArr = [];
                colorArrTemp.forEach(value => {
                    goodsColorArr.push({ _id: value });
                });
                goodsColorResult = await this.ctx.model.GoodsColor.find({
                    $or: goodsColorArr,
                });
            }

            // 获取规格信息
            const goodsAttsResult = await this.ctx.model.GoodsAttr.find({ goods_id: goodsResult[0]._id });
            let goodsAttsStr = '';
            goodsAttsResult.forEach(async val => {
                if (val.attribute_type == 1) {
                    goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <input type="text" name="attr_value_list"  value="${val.attribute_value}" /></li>`;
                } else if (val.attribute_type == 2) {
                    goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />  <textarea cols="50" rows="3" name="attr_value_list">${val.attribute_value}</textarea></li>`;
                } else {
                    // 获取 attr_value  获取可选值列表
                    const oneGoodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({
                        _id: val.attribute_id,
                    });
                    const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');
                    goodsAttsStr += `<li><span>${val.attribute_title}: 　</span><input type="hidden" name="attr_id_list" value="${val.attribute_id}" />`;
                    goodsAttsStr += '<select name="attr_value_list">';
                    for (let j = 0; j < arr.length; j++) {
                        if (arr[j] == val.attribute_value) {
                            goodsAttsStr += `<option value="${arr[j]}" selected >${arr[j]}</option>`;
                        } else {
                            goodsAttsStr += `<option value="${arr[j]}" >${arr[j]}</option>`;
                        }
                    }
                    goodsAttsStr += '</select>';
                    goodsAttsStr += '</li>';
                }
            });

            // 商品的图库信息
            const goodsImageResult = await this.ctx.model.GoodsImage.find({ goods_id: goodsResult[0]._id });
            // console.log(goodsImageResult);

            await this.ctx.render('admin/goods/edit', {
                colorResult,
                goodsType,
                goodsCate,
                goods: goodsResult[0],
                goodsAtts: goodsAttsStr,
                goodsImage: goodsImageResult,
                goodsColor: goodsColorResult,
                prevPage: this.ctx.state.prevPage,
            });
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }

    async doEdit() {
        try {
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
            let formFields = Object.assign(files, parts.field);
            // 修改商品的id
            const goods_id = parts.field.id;
            // 特别处理商品颜色
            if (!formFields.goods_color) {
                formFields.goods_color = '';
            } else {
                if (typeof(formFields.goods_color) !== 'string') {
                    formFields.goods_color = formFields.goods_color.toString();
                }
            }
            // 修改商品信息
            await this.ctx.model.Goods.updateOne({ _id: goods_id }, formFields);
            // 修改图库信息（增加）
            let goods_image_list = formFields.goods_image_list;
            if (goods_id && goods_image_list) {
                if (typeof(goods_image_list) === 'string') {
                    goods_image_list = new Array(goods_image_list);
                }
                for (let i = 0; i < goods_image_list.length; i++) {
                    const goodsImageRes = new this.ctx.model.GoodsImage({
                        goods_id,
                        img_url: goods_image_list[i],
                    });
                    await goodsImageRes.save();
                }
            }

            // 修改商品类型数据    1、删除以前的类型数据     2、重新增加新的商品类型数据
            // 1、删除以前的类型数据
            await this.ctx.model.GoodsAttr.deleteMany({ goods_id });
            // 2、重新增加新的商品类型数据
            let attr_value_list = formFields.attr_value_list;
            let attr_id_list = formFields.attr_id_list;

            if (goods_id && attr_id_list && attr_value_list) {
                // 解决只有一个属性的时候存在的bug
                if (typeof(attr_id_list) === 'string') {
                    attr_id_list = new Array(attr_id_list);
                    attr_value_list = new Array(attr_value_list);
                }

                for (let i = 0; i < attr_value_list.length; i++) {
                    // 查询goods_type_attribute
                    if (attr_value_list[i]) {
                        const goodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
                        const goodsAttrRes = new this.ctx.model.GoodsAttr({
                            goods_id,
                            cate_id: formFields.cate_id,
                            attribute_id: attr_id_list[i],
                            attribute_type: goodsTypeAttributeResult[0].attr_type,
                            attribute_title: goodsTypeAttributeResult[0].title,
                            attribute_value: attr_value_list[i],
                        });
                        await goodsAttrRes.save();
                    }
                }
            }

            const prevPage = parts.field.prevPage;
            await this.success(prevPage, '修改商品数据成功');
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }
}

module.exports = GoodsController;