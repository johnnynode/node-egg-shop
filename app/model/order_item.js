'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const d = new Date();
    const OrderItem = new Schema({
        order_id: { type: Schema.Types.ObjectId },
        product_title: { type: String },
        product_id: { type: Schema.Types.ObjectId },
        product_img: { type: String },
        product_price: { type: Number },
        product_num: { type: Number },
        add_time: {
            type: Number,
            default: d.getTime(),
        }
    });
    return mongoose.model('OrderItem', OrderItem, 'order_item');
};