'use strict';

const sd = require('silly-datetime');
const path = require('path');
const showdown = require('showdown');

// 处理前台页面的公共方法

module.exports = {
    // parmas 时间戳 13位的时间戳
    formatTime(parmas) {
        return sd.format(new Date(parmas), 'YYYY-MM-DD HH:mm');
    },

    // 处理图片 封装不同尺寸的显示 对应后台中的工具方法：tools.js 中的jimpImg
    formatImg(dir, width, height) {
        if (!dir) {
            return '';
        }
        height = height || width;
        let extname = path.extname(dir);
        dir = dir.substr(0, dir.indexOf(extname));
        return dir + '_' + width + 'x' + height + extname;
    },

    // 商品详情中用于格式化商品 html
    formatAttr(str) {
        const converter = new showdown.Converter();
        return converter.makeHtml(str);
    }
};