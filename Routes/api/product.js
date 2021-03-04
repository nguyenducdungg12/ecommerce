const app = require('express');
const router = app.Router();
const Products = require('../../Models/Products');
router.get('/products',(req,res)=>{
    const category = req.query.category;
    if(category){
        Products.find({
            category:category
        },(err,product)=>{
            if(!err){
                res.json(product);
            }
        })
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

module.exports = router;