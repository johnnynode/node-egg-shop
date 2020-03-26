'use strict';

const sd = require('silly-datetime');
const path = require('path');
const showdown = require('showdown');

module.exports = {
    // parmas 时间戳 13位的时间戳
    formatTime(parmas) {
        return sd.format(new Date(parmas), 'YYYY-MM-DD HH:mm');
    },

    // 处理图片 封装不同尺寸的显示
    formatImg(dir, width, height) {
        if (!dir) {
            return '';
        }
        height = height || width;
        return dir + '_' + width + 'x' + height + path.extname(dir);
    },

    // 商品详情中用于格式化商品 html
    formatAttr(str) {
        var converter = new showdown.Converter();
        return converter.makeHtml(str);
    }
};