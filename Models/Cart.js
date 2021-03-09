const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Cart = new Schema({
      price: {
        type: Number
      },
      imagePath:{
        type:String,
      },
      title:{
        type:String,
      },
      userId: {
        type: String,
      },
      status:{
        type:String,
      },
      idProduct:{
        type:String,
      }


})
module.exports = mongoose.model('Cart',Cart);