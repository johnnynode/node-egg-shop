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

    // 上传文件
    async getUploadFile(filename) {
        // 1、获取当前日期  20200220
        const day = sd.format(new Date(), 'YYYYMMDD');
        // 2、创建图片保存的路径
        const dir = path.join(this.config.uploadDir, day);
        await mkdirp(dir); // 创建路径
        const d = await this.getTime() + '_' + (Math.random() + '').substr(2); // 毫秒数 + 随机数(截取0.之后的数字，0.9641773493321022 => 9641773493321022) 
        // 返回图片保存的路径
        // const uploadDir = path.join(dir, d + path.basename(filename)); // 保留文件名
        const uploadDir = path.join(dir, d + path.extname(filename)); // 只保留后缀
        // app\public\admin\upload\20200220\1536895331444_xxxxxxxxxx.png
        return {
            uploadDir,
            saveDir: uploadDir.slice(3).replace(/\\/g, '/'), // 保存的是  /public/admin/upload/20200220/1536895331444_xxxxxxx.png 这种地址
        };
    }

    //生成缩略图的公共方法
    async jimpImg(target) {
        //上传图片成功以后生成缩略图
        Jimp.read(target, (err, lenna) => {
            if (err) throw err;
            for (let i = 0; i < this.config.jimpSize.length; i++) {
                let w = this.config.jimpSize[i].width;
                let h = this.config.jimpSize[i].height;
                let extname = path.extname(target); // 获取后缀名
                let picPath = target.substr(0, target.indexOf(extname)) + '_' + w + 'x' + h + extname; // 重新拼接
                lenna.resize(w, h) // resize
                    .quality(90) // set JPEG quality
                    .write(picPath);
            }
        });
    }
}

module.exports = ToolsService;