require('dotenv').config();
const jwtHelper = require('../Helper/jwt.helper');
const refreshToken = require('../Helper/refeshToken.helper')
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
            if(err.name=='TokenExpiredError'){

            }
            return res.json({
                message: err,
              });
        }
    }
    else{
        res.send('Không hợp lệ');
    }
}
module.exports = {isAuth}