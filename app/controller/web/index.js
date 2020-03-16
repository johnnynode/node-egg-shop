'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
    async index() {
        await this.ctx.render('web/index');
    }
}

module.exports = IndexController;