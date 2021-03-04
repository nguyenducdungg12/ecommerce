const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Category = new Schema({
     CategoryName:{
         type:String,
     }
})
module.exports = mongoose.model('Category',Category);