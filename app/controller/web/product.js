'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {
    async list() {
        await this.ctx.render('web/product_list.html');
    }

    async info() {
        await this.ctx.render('web/product_info.html');
    }
}

module.exports = ProductController;