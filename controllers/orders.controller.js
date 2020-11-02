const { validationResult } = require("express-validator")
const cartmodel=require('../models/cart.model')
const ordersmodel=require('../models/orders.model')
const usermodel=require('../models/auth.model')


exports.saveorder=async (req,res,next)=>{
    let{itemid}=req.body
await cartmodel.getFromCart({_id:itemid,buyerid:req.session.userId}).then(item=>{
    req.session.Order=item[0]
    req.session.itemid=itemid
    // let {buyerid,timestamp,productid,name,price,amount,image,category,description}=item[0]
    // let savedOrder={
    //     buyerid:buyerid,
    //     timestamp:timestamp,
    //     productid:productid,
    //     name:name,
    //     price:price,
    //     amount:amount,
    //     category:category,
    //     description:description,
    //     image:image,
    // }
    // console.log(buyerid)
    res.redirect('/orders/confirm')
})
}


exports.confirm=async (req,res,next)=>{
    if(req.session.Order){
    console.log('i passed from just one order')
   await usermodel.getUser({_id:req.session.userId}).then(user=>{
    let {buyerid,sellerid,productid,name,price,amount,image,category,description,offer,arrive,buyername,sellername}=req.session.Order
    let savedOrder={
        buyerid:buyerid,
        sellerid:sellerid,
        timestamp:Date.now(),
        productid:productid,
        name:name,
        price:price,
        amount:amount,
        category:category,
        description:description,
        image:image,
        address:req.body.address,
        email:user[0].email,
        phone:user[0].phone,
        offer:offer,
        arrive:arrive,
        buyername:buyername,
        sellername:sellername,
        
    }
    // console.log(savedOrder.phone)

     ordersmodel.saveorders(savedOrder).then(()=>{
        cartmodel.deleteItem(req.session.itemid).then(deleted=>{
            // console.log('item deleted'+deleted)
        }).catch(err=>{
            console.log(err)
        })

    }).then(()=>{ 
        req.session.Order=undefined,req.session.itemid=undefined 
        res.redirect('/orders')
    }).catch(err=>{
        console.log(err)
    })

    })
}else if(req.session.Allorders){
    allOrders=req.session.Allorders
    allOrders.map(order=>{
        usermodel.getUser({_id:req.session.userId}).then(user=>{
            let {buyerid,productid,name,price,amount,image,category,description,_id,offer,arrive,buyername,sellername}=order
            let savedOrder={
                buyerid:buyerid,
                timestamp:Date.now(),
                productid:productid,
                name:name,
                price:price,
                amount:amount,
                category:category,
                description:description,
                image:image,
                address:req.body.address,
                email:user[0].email,
                phone:user[0].phone,
                offer:offer,
                arrive:arrive,
                buyername:buyername,
                sellername:sellername,
                    
            }
            // console.log(savedOrder.phone)
        
          ordersmodel.saveorders(savedOrder).then(()=>{
                cartmodel.deleteItem(_id).then(deleted=>{
                    // console.log('item deleted'+deleted)
                }).catch(err=>{
                    console.log(err)
                })
        
            }).then(()=>{ 
                // req.session.Order=undefined,req.session.itemid=undefined 
                res.redirect('/orders')
            }).catch(err=>{
                console.log(err)
            })
        
            })
        


    }).then(()=>{
    req.session.Allorders=undefined
    console.log('now allorders '+req.session.Allorders)

    })

}else{
    console.log('i didnt read')
}
}



exports.getorders=(req,res,next)=>{
    ordersmodel.getorders({buyerid:req.session.userId}).then(orders=>{
        res.render('orders',{
            isuser:req.session.userId,
            items:orders,
            user:req.session.User

        })
    }).catch(err=>{
        console.log(err)
    })
}
exports.getMangeOrders=(req,res,next)=>{
    // if(req.query.searchtype == 'email'){
    //     ordersmodel.getorders({email:req.query.search}).then(orders=>{
    //         // console.log(orders)
    //         res.render('manageorders',{
    //             isuser:req.session.userId,
    //             items:orders
    //         })
    //     }).catch(err=>{
    //         console.log(err)
    //     })
    
    // }else
     if(req.query.searchtype  == 'phone'){
        ordersmodel.getorders({sellerid:req.session.userId,phone:+req.query.search}).then(orders=>{
            // console.log(orders)
            res.render('manageorders',{
                isuser:req.session.userId,
                items:orders
            })
        }).catch(err=>{
            console.log(err)
        })

    }else if(req.query.searchtype  == 'status'){
        ordersmodel.getorders({sellerid:req.session.userId,status:req.query.search}).then(orders=>{
            // console.log(orders)
            res.render('manageorders',{
                isuser:req.session.userId,
                items:orders
            })
        }).catch(err=>{
            console.log(err)
        })

    }else{
    ordersmodel.getorders({sellerid:req.session.userId}).then(orders=>{
        // console.log(orders)
        res.render('manageorders',{
            isuser:req.session.userId,
            items:orders
        })
    }).catch(err=>{
        console.log(err)
    })
}
}



exports.getconfirm=(req,res,next)=>{
    res.render('confirm',{
        isuser:req.session.userId,
        address:req.session.Address
    })
}


exports.cancelItem=(req,res,next)=>{
    let{itemid}=req.body
    console.log(itemid)

    ordersmodel.cancelItem(itemid).then(deleted=>{
        res.redirect(req.body.redirected)

    }).catch(err=>{
        console.log(err)
    })
}

exports.cancelAll=(req,res,next)=>{
    ordersmodel.cancelALL({buyerid:req.session.userId}).then(deleted=>{
        res.redirect(req.body.redirected)
    }).catch(err=>{
        console.log(err)
    })
}



exports.updateItem=(req,res,next)=>{
    if(validationResult(req).isEmpty()){
        let data
        if(req.body.status){
            data={status:req.body.status}
        }else if(req.body.amount){
            data={amount:req.body.amount,timestamp:Date.now()}
        }
    ordersmodel.updateItem(req.body.itemid,data).then(updated=>{
        req.flash('cartitemvalid','the Quantity has been updated')
        console.log(updated)
        
        res.redirect(req.body.redirected)
    }).catch(err=>{
        console.log(err)
        res.redirect('/orders')
    })
}else{
    if(validationResult(req).array().length >0) req.flash('cartitemvalid2',validationResult(req).array())
    console.log('here from validation')
    res.redirect('/orders')
}
}