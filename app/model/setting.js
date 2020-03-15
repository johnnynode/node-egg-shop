'use strict';

// 系统设置模块只存放一条数据
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const SettingSchema = new Schema({
        site_title: {
            type: String,
            default: '',
        },
        site_logo: {
            type: String,
            default: '',
        },
        site_keywords: {
            type: String,
            default: '',
        },
        site_description: {
            type: String,
            default: '',
        },
        no_picture: {
            type: String,
            default: '',
        },
        site_icp: {
            type: String,
            default: '',
        },
        site_tel: {
            type: String,
            default: '',
        },
        search_keywords: {
            type: String,
            default: '',
        },
        tongji_code: {
            type: String,
            default: '',
        }
    });

    return mongoose.model('Setting', SettingSchema, 'setting');
}