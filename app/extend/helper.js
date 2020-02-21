'use strict';

const sd = require('silly-datetime');

module.exports = {
  // parmas 时间戳 13位的时间戳
  formatTime(parmas) {
    return sd.format(new Date(parmas), 'YYYY-MM-DD HH:mm');
  },
};
