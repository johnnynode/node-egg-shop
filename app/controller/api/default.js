'use strict';

const Controller = require('egg').Controller;

class DefaultController extends Controller {
    async index() {
        this.ctx.body = "api接口"
    }

    //商品列表的api接口
    async productList() {
        let page = this.ctx.request.query.page || 1;
        let pageSize = this.ctx.request.query.pageSize || 10;
        const goodsResult = await this.ctx.model.Goods.find({}).skip((page - 1) * pageSize).limit(pageSize);
        this.ctx.body = {
            result: goodsResult
        }
    }

    //post 增加数据
    async register() {
        console.log(this.ctx.request.body)
        this.ctx.body = {
            result: 'success_post'
        }
    }

    //put 修改数据
    async editUser() {
        console.log(this.ctx.request.body)
        this.ctx.body = {
            result: 'success_put'
        }
    }

    async deleteUser() {
        // console.log(this.ctx.request.body);
        console.log(this.ctx.request.query);
        this.ctx.body = {
            result: 'success_delete'
        }
    }
}

module.exports = DefaultController;