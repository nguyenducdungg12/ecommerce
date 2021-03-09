require('dotenv').config();
const jwtHelper = require('../Helper/jwt.helper');
const token_secrecSignature = process.env.token_secrecSignature;

let isAuth = async (req,res,next)=>{
    const tokenFromClient = req.headers.x_authorization;
    if(tokenFromClient){
        try{
            const decodeToken = await jwtHelper.verifyToken(tokenFromClient,token_secrecSignature);
            req.user = decodeToken;
            next();
        }
        catch(err){
            return res.json({
                message: err,
              });
        }
    }
    else{
        res.send('Không hợp lệ');
    }
}
let isAdmin = async (req,res,next)=>{
    const admin = req.user;
    if(admin.data.isAdmin){
        next();
    }
    else{
        res.send('Bạn không có quyền truy cập');
    }
}
module.exports = {isAuth,isAdmin}