'use strict';

const sd = require('silly-datetime');
const path = require('path');

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
    }
};