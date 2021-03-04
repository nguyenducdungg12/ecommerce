const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DetailProduct = new Schema({
    ProductId: {
        type: String,
    },
    color:{
        type: String
    },
    size: {
        type: String
    },
    quantity: {
        type: Number
    },

})
module.exports = mongoose.model('DetailProduct',DetailProduct);