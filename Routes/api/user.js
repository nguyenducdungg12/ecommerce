require('dotenv').config();
const app = require('express');
const router = app.Router();
const User = require('../../Models/User');
const AuthController = require('../../Controllers/AuthController')
const AuthMiddleware = require('../../Controllers/AuthMiddleware')
const WishList = require('../../Models/Cart')

router.get('/user',AuthMiddleware.isAuth,async (req,res)=>{
    idUser = req.user.data._id;
        User.findOne({_id:idUser},(err,user)=>{
            if(!err){
                res.json(user);
            }
            else{
                res.json(err);
            }
        }) 
})
router.get('/user/wishlist',AuthMiddleware.isAuth,(req,res)=>{
    const idUser = req.user.data._id;
    WishList.find({userId:idUser},(err,data)=>{
        if(!err){
            res.json(data);
        }
        else{
            res.json(err);
        }
    })
})
router.post('/user/wishlist',AuthMiddleware.isAuth,async (req,res)=>{
    const idUser = req.user.data._id;
    const data = req.body;
    let isProductInWishList = await WishList.findOne({
        imagePath:data.imagePath,
        title:data.title
    });
    if(isProductInWishList){
        return res.json({
            msgID:1,
            msg:'Sản phẩm đã thêm rồi',
        })
    }
    var newWishList = new WishList({
        price:data.price,
        imagePath:data.imagePath,
        status:data.status,
        title:data.title,
        userId : idUser,
    })
    if(!newWishList){
        return res.json({
            msgID:1,
            msg : 'Thêm sản phẩm lỗi',
        })
    }
    newWishList.save();
    res.json({
        msgID:2,
        msg : 'Thêm thành công'
    })
})
router.delete('/user/wishlist/:id',AuthMiddleware.isAuth,(req,res)=>{
    const idWishList = req.params.id;
    WishList.findByIdAndRemove(idWishList,(err,success)=>{
        if(err){
            res.json({msg:err});
        }
        else{
            res.json({msg:'Xóa thành công'});
        }
    })
})

router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
router.post('/refreshToken',AuthController.refreshToken);
module.exports = router;