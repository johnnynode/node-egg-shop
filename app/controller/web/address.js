'use strict';

const Controller = require('egg').Controller;
class AddressController extends Controller {

    // 增加收货地址
    async addAddress() {
        /*
            1、获取表单提交的数据
            2、更新当前用户的所有收货地址的默认收货地址状态为0
            3、增加当前收货地址，让默认收货地址状态是1
            4、查询当前用户的所有收货地址返回
        */

        const uid = this.ctx.service.cookies.get('userinfo')._id;
        const name = this.ctx.request.body.name;
        const phone = this.ctx.request.body.phone;
        const address = this.ctx.request.body.address;
        const zipcode = this.ctx.request.body.zipcode;
        const addressCount = await this.ctx.model.Address.find({ uid }).count();

        // 增加收货地址的限制
        if (addressCount > 20) {
            this.ctx.body = {
                success: false,
                result: '增加收货地址失败 收货地址数量超过限制',
            };
        } else {
            // 正常添加地址流程 用户表与地址表是一对多的关系
            await this.ctx.model.Address.updateMany({ uid }, { default_address: 0 }); // 将该用户的所有收货地址默认收货地址属性置为0
            const addressModel = new this.ctx.model.Address({ uid, name, phone, address, zipcode }); // 配置当前新的地址
            await addressModel.save(); // 插入数据
            const addressList = await this.ctx.model.Address.find({ uid }).sort({ default_address: -1 }); // 重新查询地址列表 按地址倒序排序
            this.ctx.body = {
                success: true,
                result: addressList,
            };
        }
    }

    // 获取收货地址列表
    async getAddressList() {
        /*
           获取当前用户的所有收货地址
        */
        this.ctx.body = 'getAddressList';
    }

    // 获取一个收货地址 用于修改时，获取详情
    async getOneAddress() {
        /*
        返回指定收货地址id的收货地址
        */

        const uid = this.ctx.service.cookies.get('userinfo')._id;
        let id = this.ctx.request.query.id;
        let result = await this.ctx.model.Address.find({ uid: uid, "_id": id });
        this.ctx.body = {
            success: true,
            result: result,
        };
    }

    // 编辑收货地址
    async editAddress() {
        /*
          1、获取表单增加的数据
          2、更新当前用户的所有收货地址的默认收货地址状态为0
          3、修改当前收货地址，让默认收货地址状态是1
          4、查询当前用户的所有收货地址并返回
        */

        const uid = this.ctx.service.cookies.get('userinfo')._id;
        const id = this.ctx.request.body.id;
        const name = this.ctx.request.body.name;
        const phone = this.ctx.request.body.phone;
        const address = this.ctx.request.body.address;
        const zipcode = this.ctx.request.body.zipcode;

        await this.ctx.model.Address.updateOne({ "_id": id, "uid": uid }, { name, phone, address, zipcode });
        const addressList = await this.ctx.model.Address.find({ uid }).sort({ default_address: -1 });
        this.ctx.body = {
            success: true,
            result: addressList,
        };
    }

    // 修改默认的收货地址
    async changeDefaultAddress() {
        /*
            1、获取用户当前收货地址id 以及用户id
            2、更新当前用户的所有收货地址的默认收货地址状态为0
            3、更新当前收货地址的默认收货地址状态为1
        */
        const uid = this.ctx.service.cookies.get('userinfo')._id;
        const id = this.ctx.request.query.id;
        await this.ctx.model.Address.updateMany({ uid }, { default_address: 0 });
        await this.ctx.model.Address.updateMany({ uid, "_id": id }, { default_address: 1 });
        this.ctx.body = {
            success: true,
            msg: '更新默认收货地址成功'
        };

    }
}

module.exports = AddressController;