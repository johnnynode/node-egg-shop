'use strict';

const Controller = require('egg').Controller;

class FlowController extends Controller {
    async cart() {
        await this.ctx.render('web/cart.html');
    }
}

module.exports = FlowController;