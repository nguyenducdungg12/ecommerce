const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = new Schema({
    title: {
        type: String,
    },
    imagePath: {
        type: String,
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    price: {
        type: Number
    },
},  { timestamps: true }
)
module.exports = mongoose.model('Products',Product);