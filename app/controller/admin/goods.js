'use strict';

const BaseController = require('./base.js');

class GoodsController extends BaseController {
    async index() {
        await this.ctx.render('admin/goods/index');
    }

    async add() {
        await this.ctx.render('admin/goods/add');
    }
}

module.exports = GoodsController;