'use strict';

/* 临时用户表主要保存 用户的手机, 当天发送了几次验证码, 也就是当前的签名(手机+日期)，是否存在，
存在要判断当天发送了几次验证码, 不存在，保存新的 
还有，是否有必要保存当前验证码, 这个可以根据需求来做 TODO
*/
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    var d = new Date();
    const UserTemp = new Schema({
        phone: { type: Number },
        send_count: { type: Number },
        sign: { type: String },
        add_day: {
            type: Number
        },
        ip: { type: String },
        add_time: {
            type: Number,
            default: d.getTime()
        }
    });

    return mongoose.model('UserTemp', UserTemp, 'user_temp');
}