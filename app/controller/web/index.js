'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async index() {
        try {
            // 轮播图 (应用缓存技术)
            let focus = await this.ctx.service.cache.get('index_focus');
            if (!focus) {
                focus = await this.ctx.model.Focus.find({ "type": 1 });
                await this.ctx.service.cache.set('index_focus', focus, 60 * 60);
            }

            // 这里封装了首页推荐的楼层，但是_id是硬编码出来的，是从数据库或后台管理系统中拿来的，可以做成配置的(应该做成一个配置的)
            // 手机 (应用缓存技术)
            let mobileResult = await this.ctx.service.cache.get('index_mobile_result');
            if (!mobileResult) {
                mobileResult = await this.service.goods.get_category_recommend_goods('5e55b4fbe9ab76893131640f', 'best', 8);
                await this.ctx.service.cache.set('index_mobile_result', mobileResult, 60 * 60);
            }

            // 其他...

            // console.log('mobileResult', mobileResult);

            await this.ctx.render('web/index', {
                focus: focus,
                mobileResult: mobileResult
            });
        } catch (e) {
            // 如有必要 egg-logger 【记录日志】TODO
            console.log(err);
        }
    }
}

module.exports = IndexController;