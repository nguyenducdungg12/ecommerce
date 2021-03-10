const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    userName:{
        type:String,
        index:true,
        unique:true,
    },
    Password:{
        type:String,
    },
    Phone:{
        type:Number,
    },
    Age:{
        type:String,
    },
    Gender:{
        type:String,
    },
    AvatarPath:{
        type:String,
    }
    ,
    RefreshToken:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
    },
    isSocialMedia:{
        type:Boolean,
        default:false,
    },
    idUserSocialMedia:{
        type:String,
        default:'',
    }
})
module.exports = mongoose.model('User',User);