require('dotenv').config();
const jwtHelper = require("../Helper/jwt.helper");
const UserModel = require('../Models/User')
const bcrypt = require('bcrypt');
const token_secretSignature = process.env.token_secrecSignature;
const token_Timelife = process.env.token_Timelife;
const refreshtoken_secretSignature = process.env.refreshtoken_secretSignarture;
const refreshtoken_Timelife = process.env.refreshtoken_timelife;
const saltRounds = 10;
const register = async (req,res)=>{
    const userName = req.body.userName.toLowerCase();
    const User = await UserModel.find({
        userName:userName,
    })
    if(User.length==0){
        const hashPassword = bcrypt.hashSync(req.body.Password,saltRounds);
        const NewUser = new UserModel({
            userName:userName,
            Password:hashPassword,
            Gender:req.body.Gender,
            Phone:req.body.Phone,
            Age:req.body.Age,
            AvatarPath:req.body.AvatarPath,
        });
       NewUser.save();
        if(!NewUser){
            res.json({
                msg:'Tạo tài khoản thất bại',
                msgID : 1,
            })
        }
        res.json({
            msg:'Tạo tài khoản thành công',
            msgID : 2,
        });
    }
    else{
        res.json({
            msg:'Tài khoản đã tồn tại',
            msgID:3
        });
    }
}

const login =async (req,res)=>{
    const userName = req.body.userName;
    const password = req.body.Password;
    const checkUserName = await UserModel.findOne({
        userName:userName,
    })
    if(!checkUserName){
        res.json({
            msg:'Tài khoản không tồn tại',
            isError:true,
        })
    }
    const checkPassword = bcrypt.compareSync(password,checkUserName.Password);
    if(!checkPassword){
        res.json({ 
        msg:'Mật khẩu không chính xác',});
    }
    let generateToken = await jwtHelper.generateToken(checkUserName,token_secretSignature,token_Timelife);
    let generateRefreshToken = await jwtHelper.generateToken(checkUserName,refreshtoken_secretSignature,refreshtoken_Timelife)
    if(!generateToken){
        res.json({
            msg:'Đăng nhập không thành công',
        });
    }
    if(!checkUserName.RefreshToken){
        UserModel.findByIdAndUpdate(checkUserName._id,{
            RefreshToken:generateRefreshToken,
        })
    }
    else{
        generateRefreshToken=checkUserName.RefreshToken;
    }
     res.json({
        accessToken: generateToken,
        refreshToken:generateRefreshToken,
        user : checkUserName,        
    })
}
const refreshToken = async (req,res)=>{
    const tokenFromHeader = req.headers.x_authorization;
    if(!tokenFromHeader){
        res.send('Không tìm thấy Token');
    }
    try{
        const decodeToken = await jwtHelper.verifyToken(tokenFromHeader,'anh');
    }
    catch(err){
        res.send(err)
    }

    const idUser = decodeToken.data._id;
    const user = await UserModel.findOne({_id:idUser});
    if(!user){
        res.send('User không tồn tại');
    }
    if(tokenFromHeader!=user.RefreshToken){
        res.send('Refresh Token không hợp lệ');
    }
    let generateToken = await jwtHelper.generateToken(user,token_secretSignature,token_Timelife);
    res.json( {
        accessToken : generateToken
    })

}

module.exports = {register,login,refreshToken};