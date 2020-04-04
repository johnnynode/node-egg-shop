'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const d = new Date();

    const AddressSchema = new Schema({
        uid: { type: Schema.Types.ObjectId },
        name: { type: String },
        phone: { type: Number },
        address: { type: String },
        zipcode: { type: String },
        default_address: { type: Number, default: 1 },
        add_time: {
            type: Number,
            default: d.getTime(),
        },
    });

    return mongoose.model('Address', AddressSchema, 'address');
};