'use strict';

const sd = require('silly-datetime');

module.exports = {
    // parmas 时间戳 13位的时间戳
    formatTime(parmas) {
        return sd.format(new Date(parmas), 'YYYY-MM-DD HH:mm');
    },

    // 处理图片 封装不同尺寸的显示
    formatImg(dir, width, height) {
        height = height || width;
        return dir + '_' + width + 'x' + height + path.extname(dir);
    }
};