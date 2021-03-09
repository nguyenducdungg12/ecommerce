const app = require('express');
const router = app.Router();
const Products = require('../../Models/Products');
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

router.get('/products',(req,res)=>{
    const category = req.query.category;
    const sortBy = req.query.sort;
    const Search = req.query.query &&'^'+req.query.query;
    if(category){
        if(sortBy){
            Products.find({
                category:category
            },null,{
                sort:{
                    price:sortBy,
                }
            },(err,product)=>{
                if(!err){
                    res.json(product)
                }
            })
        }
        else{
            Products.find({
                category:category
            },(err,product)=>{
                if(!err){
                    res.json(product);
                }
            })
        }
    }
    else if(Search){
        if(sortBy){
            Products.find(
                { title : {$regex:Search,$options: "i"}}
                ,null,{
                sort:{
                    price:sortBy,
                }
            },(err,product)=>{
                if(!err){
                    res.json(product)
                }
            })
        }
        else{
            Products.find(
                { title : {$regex:Search,$options: "i"}}
            ,(err,product)=>{
                if(!err){
                    res.json(product);
                }
            })
        }
    }
    else{
        Products.find({},(err,product)=>{
           if(!err){
               res.json(product);
           }
       })
    }
})
router.get('/product/:id',(req,res)=>{
    Products.findById(req.params.id,(err,product)=>{
        if(!err){
            res.json(product);
        }
        else{
            res.json(err);
        }
    })
})
router.post('/product',upload.single('image'),(req,res)=>{
    const data = req.body;
    if(data._id){
        Products.findByIdAndUpdate(data._id,{
            title:data.title,
            price:data.price,
            imagePath:req.file.originalname,
            category:data.category,
            description:data.description,
        },(err,product)=>{
            if(err){
                 return res.json({
                    msg:'Nhập sản phẩm thất bại',
                    msgID:1
                })
            }
            res.json({
                msg:'Sửa thành công sản phẩm',
                msgID:2
            })
        })
    }
    else{
        const newProduct = new Products({
            title:data.title,
            price:data.price,
            imagePath:req.file.originalname,
            category:data.category,
            description:data.description,
        })
        if(!newProduct){
            res.json({
                msg:'Nhập sản phẩm thất bại',
                msgID:1
            })
        }
        else{
            newProduct.save();
            res.json({
                msg:'Nhập sản phẩm thành công',
                msgID:2
            })
        }
    }
})
router.delete('/product/:id',(req,res)=>{
    const id = req.params.id;
    Products.findByIdAndRemove(id,(err,product)=>{
        if(err){
            return res.json({
               msg:'Xóa sản phẩm thất bại',
               msgID:1
           })
       }
       res.json({
           msg:'Xóa thành công sản phẩm',
           msgID:2
       })
    })
})
module.exports = router;