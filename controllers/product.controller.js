const productsModel=require('../models/products.model')

exports.getProduct=(req,res,next)=>{
    let errcart=req.flash('cartitemvalid')[0]
    let errcart2=req.flash('cartitemvalid2')[0]
 
    //get id 
    //get product
    //render
    let renderView=(OneProduct)=>{
        req.session.Product=OneProduct
        //render product.ejs
    res.render('product',{
        product:OneProduct[0],
        isuser:req.session.userId,
        admin:req.session.Admin,
        itemcarterr:errcart,
        itemcarterr2:errcart2
    
    })
    }
    
    let idValue=req.params.id
    productsModel.getProducts({_id:idValue}).then(renderView).catch(err=>{
        res.render('product',{product:null,
            isuser:req.session.userId,
            itemcarterr:errcart,
            itemcarterr2:errcart2    
        })

    })
}