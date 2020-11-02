const cartmodel=require('../models/cart.model')
const validationResult=require('express-validator').validationResult


exports.addItem=(req,res,next)=>{
    let Product=req.session.Product
    let productData
let {productid,amount}=req.body
Product.map(producto=>{
    if(producto._id == productid){
        productData=producto
    }
})

let {name,price,category,description,image,_id,offer,buyername,sellername,arrive,sellerid}=productData
let itemdata={
        buyerid:req.session.userId,
        sellerid:sellerid,
        timestamp:Date.now(),
        productid:_id,
        name:name,
        price:price,
        amount:amount,
        image:image,
        category:category,
        description:description,
        offer:offer,
        buyername:buyername,
        sellername:sellername,
        arrive,arrive
    
    }
    // console.log(productData._id)
    // console.log(productid)
    // console.log(itemdata)


    cartmodel.noRepeat({buyerid:req.session.userId,productid:_id}).then(repeated=>{
        // console.log(repeated)
        if(validationResult(req).isEmpty()  && repeated.length<=0){
            cartmodel.saveToCart(itemdata).then(()=>{
                res.redirect('/cart')
            }).catch(err=>{
                console.log(err)
            })
        }else{
            
            if(repeated.length>0 &&validationResult(req).isEmpty()){
                cartmodel.getFromCart({buyerid:req.session.userId,productid:_id}).then(items=>{
                    console.log(items[0])

                        cartmodel.updateItem(items[0]._id,{amount:+req.body.amount+items[0].amount,timestamp:Date.now()}).then(updated=>{
                            console.log('the updated'+updated)
                            res.redirect('/cart')
                        }).catch(err=>{
                            console.log(err)
                            res.redirect('/cart')
                        })
    

                    // console.log(items)
                }).catch(err=>{
                    console.log(err)
                })
                
            req.flash('cartitemvalid','the Quantity has been added to item')
        }else if(validationResult(req).array().length >0){
            req.flash('cartitemvalid2',validationResult(req).array())
              res.redirect(req.body.redirected)
        }

        } 
       })


}



exports.getItem=(req,res,next)=>{
    cartmodel.getFromCart({buyerid:req.session.userId}).then(items=>{
        req.session.Allorders=items
        res.render('cart',{
            items:items,
            isuser:req.session.userId,
            itemcarterr2:req.flash('cartitemvalid2')[0],
            itemcarterr:req.flash('cartitemvalid')[0],
            itemdeleted:req.flash('cartitemvdeleted')[0],
            user:req.session.User

        })
        // console.log(items)
    }).catch(err=>{
        console.log(err)
    })
}

exports.deleteItem=(req,res,next)=>{
    cartmodel.deleteItem(req.body.itemid).then(deleteditem=>{
        req.flash('cartitemvdeleted',`the Item ${deleteditem.name} has been deleted`)
        // console.log(deleteditem)
        res.redirect('/cart')
    }).catch(err=>{
        console.log(err)
        res.redirect('/cart')
    })
}
exports.deleteALL=(req,res,next)=>{
    cartmodel.deleteALL({buyerid:req.session.userId}).then(deleteditem=>{
        req.flash('cartitemvdeleted',` ${deleteditem.deletedCount} Item  has been deleted`)
        // console.log(deleteditem)
        res.redirect('/cart')
    }).catch(err=>{
        console.log(err)
        res.redirect('/cart')
    })
}

exports.updateItem=(req,res,next)=>{
    if(validationResult(req).isEmpty()){
    cartmodel.updateItem(req.body.itemid,{amount:req.body.amount,timestamp:Date.now()}).then(updated=>{
        req.flash('cartitemvalid','the Quantity has been updated')
        // console.log(updated)
        res.redirect('/cart')
    }).catch(err=>{
        console.log(err)
        res.redirect('/cart')
    })
}else{
    if(validationResult(req).array().length >0) req.flash('cartitemvalid2',validationResult(req).array())
    res.redirect('/cart')
}
}