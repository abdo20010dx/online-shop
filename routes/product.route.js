const router=require('express').Router()
const productController=require('../controllers/product.controller')

router.get('/:id',productController.getProduct)
router.get('/',(req,res,next)=>{
    res.render('product',{product:null})
})

module.exports=router