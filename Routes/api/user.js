require('dotenv').config();
const app = require('express');
const router = app.Router();
const User = require('../../Models/User');
const AuthController = require('../../Controllers/AuthController')
const AuthMiddleware = require('../../Controllers/AuthMiddleware')
const WishList = require('../../Models/Cart')
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './Image')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
var upload = multer({ storage: storage })

router.post('/user/:id/removeToken',AuthMiddleware.isAuth,AuthMiddleware.isAdmin,async(req,res)=>{
    const idUser = req.params.id;
    console.log(idUser);
    User.findByIdAndUpdate(idUser,{
        refreshToken:null,
    },(err,user)=>{
        if(err){
            res.json({
                msg:err
            })
        }
        else{
            res.json({
                msg:'Xóa refreshToken thành công'
            })
        }
        
    })
})

router.post('/user/:id/authorization',AuthMiddleware.isAuth,AuthMiddleware.isAdmin,async(req,res)=>{
    const idUser = req.params.id;
    User.findByIdAndUpdate(idUser,{
        isAdmin:true,
    },(err,user)=>{
        if(err){
            res.json({
                msg:err
            })
        }
        else{
            res.json({
                msg:'Cấp quyền thành công '
            })
        }
        
    })
})

router.delete('/user/:id',AuthMiddleware.isAuth,AuthMiddleware.isAdmin,async(req,res)=>{
    const idUser = req.params.id;
    console.log(idUser);
    User.findByIdAndRemove(idUser,(err,user)=>{
        if(err){
            res.json({
                msg:err
            })
        }
        else{
            res.json({
                msg:'Xóa thành công'
            })
        }
        
    })
})
router.get('/user',AuthMiddleware.isAuth,async (req,res)=>{
    if(req.user.is_valid){
        res.json({
            userName: req.user.name,
            Password: hashPassword,
            Gender: req.body.Gender,
            Phone: req.body.Phone,
            isAdmin: true,
            Age: req.body.Age,
            AvatarPath: req.file.originalname,
            RefreshToken: null,
        })
    }
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
router.get('/users',AuthMiddleware.isAuth,AuthMiddleware.isAdmin,async (req,res)=>{
    idUser = req.user.data._id;
    await User.find((err,data)=>{
        res.json(data);
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
        title:data.title,
        userId:idUser,
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
        idProduct :  data._id,
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
router.post('/admin/register',AuthMiddleware.isAuth,AuthMiddleware.isAdmin,upload.single('image'),AuthController.registerAdmin);
router.post('/register',upload.single('image'),AuthController.register);
router.post('/login',AuthController.login);
router.post('/refreshToken',AuthController.refreshToken);
module.exports = router;