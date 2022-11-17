const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productTitle: {
        require: true,
        type: String
    },
    description: {
        require: true,
        type: String
    },
    price: {
        require: true,
        type: Number
    },
    productImageUrl: {
        require: true,
        type: String
    },
    userId: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps:true})

module.exports = mongoose.model('Product', productSchema)