'use strict';

const https = require('https');
const qs = require('querystring');
const Service = require('egg').Service;

/*
短信接口运营商
https://www.juhe.cn/service
https://www.yunpian.com/
或者阿里云，腾讯云，百度都有提供短信接口
*/

class SendMsgService extends Service {

    /*
     这里配置的是 https://www.yunpian.com/ 云片的服务
     云片服务注意事项：
      1. 注册账户并实名认证
      2. 后台管理系统的控制台中创建签名, 签名显示在短信内容的最前面，显示这条短信来自哪家公司/产品/网站。因运营商要求，签名需经过审核。
      3. 后台管理系统的控制台中创建模板
      4. 找sdk以及官方文档实现发送短信，找到相关apikey在配置文件中填入
       @param {String} mobile - 手机号码: 您要发送的手机号码，多个号码用逗号隔开
       @param {String} code -  数量
     */
    async yunpianSend(mobile, code) {
        let apikey = this.config.sendMsg.yunApiKey;
        // 修改为您要发送的短信内容
        let text = '【网仹商城】您的验证码是: ' + code + ', 为了您的账户安全，请不要泄露给其他人，有效时间为10分钟, 请尽快验证';
        // 智能匹配模板发送https地址
        let sms_host = 'sms.yunpian.com';
        let send_sms_uri = '/v2/sms/single_send.json';
        // 指定模板发送接口https地址
        send_sms(send_sms_uri, apikey, mobile, text);

        function send_sms(uri, apikey, mobile, text) {
            let post_data = {
                'apikey': apikey,
                'mobile': mobile,
                'text': text,
            }; //这是需要提交的数据  
            let content = qs.stringify(post_data);
            post(uri, content, sms_host);
        }

        function post(uri, content, host) {
            let options = {
                hostname: host,
                port: 443,
                path: uri,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            let req = https.request(options, function(res) {
                // console.log('STATUS: ' + res.statusCode);  
                // console.log('HEADERS: ' + JSON.stringify(res.headers));  
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    console.log('BODY: ' + chunk); // 如果出现错误，可以尝试自己把它写入一个日志或者记录至数据库
                });
            });
            //console.log(content);
            req.write(content);
            req.end();
        }
    }
}

module.exports = SendMsgService;