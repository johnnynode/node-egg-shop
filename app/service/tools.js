'use strict';

const svgCaptcha = require('svg-captcha'); // 引入验证
const md5 = require('md5');
const sd = require('silly-datetime');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');
const Jimp = require('jimp');
const Service = require('egg').Service;

class ToolsService extends Service {

    // 生成验证码
    async captcha() {
        const captcha = svgCaptcha.create({
            size: 4,
            fontSize: 50,
            width: 100,
            height: 40,
            background: '#cc9966',
        });

        this.ctx.session.code = captcha.text; /* 验证码上面的信息*/
        return captcha;
    }

    // md5 加密 三次
    async md5(str) {
        return md5(md5(md5(str)));
    }

    getTime() {
        const d = new Date();
        return d.getTime();
    }

    async getUploadFile(filename) {
        // 1、获取当前日期  20200220
        const day = sd.format(new Date(), 'YYYYMMDD');
        // 2、创建图片保存的路径
        const dir = path.join(this.config.uploadDir, day);
        await mkdirp(dir); // 创建路径
        const d = await this.getTime() + '_' + Math.random() + '_'; // 毫秒数 + 随机数
        // 返回图片保存的路径
        // const uploadDir = path.join(dir, d + path.basename(filename)); // 保留文件名
        const uploadDir = path.join(dir, d + path.extname(filename)); // 只保留后缀
        // app\public\admin\upload\20200220\1536895331444_xxxx_xxx.png
        return {
            uploadDir,
            saveDir: uploadDir.slice(3).replace(/\\/g, '/'), // 保存的是  /public/admin/upload/20200220/1536895331444_xxxx_xxx.png 这种地址
        };
    }

    // 生成缩略图的公共方法
    async jimpImg(target) {
        // 上传图片成功以后生成缩略图
        Jimp.read(target, (err, lenna) => {
            if (err) throw err;
            lenna.resize(200, 200) // resize
                .quality(90) // set JPEG quality
                .write(target + '_200x200' + path.extname(target)); // save
            lenna.resize(400, 400) // resize
                .quality(90) // set JPEG quality
                .write(target + '_400x400' + path.extname(target)); // save
        });
    }
}

module.exports = ToolsService;