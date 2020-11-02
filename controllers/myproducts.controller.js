const productModel=require('../models/products.model')
const cartModel=require('../models/cart.model')
const ordersModel=require('../models/orders.model')
const authModel=require('../models/auth.model')
const fs =require('fs')
const path=require('path')
exports.getAdd=(req,res,next)=>{
    res.render('add-product',{
        isuser:req.session.userId
    })
}

exports.saveAdd=(req,res,next)=>{
    // console.log(req.file)
    let {name,price,category,description,offer,arrive,slide}=req.body

    let product={
        name:name,
        price:price,
        category:category,
        description:description,
        offer:offer,
        image:req.file.filename,
        sellerid:req.session.userId,
        buyername:req.session.User.name,
        arrive:+arrive * 60 *60*1000,
        slide:slide == 'on'?true:false
    
    }
    // let getDaysAndHours=(milliS)=>{
    //     let hours=milliS / 1000 /60 / 60
    //     let arrive=hours >= 24 ? {hours:hours % 24, days:Math.floor(hours /24)}:{hours:hours}
    //     return arrive
    // }

    
    // console.log(new Date().getTime())

    productModel.addProduct(product).then((savedproduct,test)=>{
        console.log('saved happened' +savedproduct)
        res.redirect('/home')
        req.flash('addsuccess','The Operation Has Been Succeeded')
    }).catch(err=>{
        console.log('error happened' +err)
        res.redirect(req.body.redirected)
        req.flash('addfailure','The Operation Has Been failed')

    })
}

exports.updateProduct=(req,res,next)=>{
    let Product=req.session.Product
    let {productid,name,price,category,description,offer}=req.body
    let data
    console.log(req.body)

    Product.map(producto=>{
        if(producto._id==productid){
            console.log(producto._id)
            console.log(productid)
             data={
                name:name,
                price:price,
                category:category,
                description:description,
                offer:offer,
                buyername:req.session.User.name       
            }
        }
    })
    
    productModel.updateProduct(productid,data).then((updated)=>{
        console.log(`the updated: ${updated}`)
        res.redirect(req.body.redirected)
    }).catch(err=>{
        console.log(err)
        res.redirected(req.body.redirected)
    })

}






exports.deleteProduct=(req,res,next)=>{
    let Product=req.session.Product
    let {productid}=req.body
    Product.map(producto=>{
        if(producto._id==productid){
            productModel.deleteProduct(productid).then(deleted=>{
                cartModel.deleteALL({productid:productid})
                fs.unlinkSync(path.join(__dirname,'../images',deleted.image))
                // console.log(`the deleted: ${deleted}`)
                res.redirect('/home')
            }).catch(err=>{
                console.log(err)
                res.redirect('/home')
            })
        }
    })   
}



// exports.getManageUsers=(req,res,next)=>{
//     let email=req.query.search
//     authModel.getUser({email:email}).then(user=>{
//         // console.log(user[0])
//         res.render('manage-users',{
//             isuser:req.session.userId,
//             user:user[0]
//         })
    
//     }).catch(err=>{
//         console.log(err)
//     })
// }


// exports.updateUser=(req,res,next)=>{
//     let {email}=req.body
//     console.log(req.body.updated)
//     if(req.body.updated == 'chief'){
//         authModel.updateUser({email:email},{admin:true,chief:true}).then(updated=>{
//             req.flash('userupdated','This user became an Chief')
//             res.redirect('/admin/users')
//         }).catch(err=>{
//             console.log(err)
//             res.redirect('/error')
//         })
//     }else if(req.body.updated == 'admin'){
//         authModel.updateUser({email:email},{admin:true,chief:false}).then(updated=>{
//             req.flash('userupdated','This user became an Admin')
//             res.redirect('/admin/users')
//         }).catch(err=>{
//             console.log(err)
//             res.redirect('/error')
//         })
//     }else if(req.body.updated == 'user'){
//         authModel.updateUser({email:email},{admin:false,chief:false}).then(updated=>{
//             req.flash('userupdated','This user became an User')
//             res.redirect('/admin/users')
//         }).catch(err=>{
//             console.log(err)
//             res.redirect('/error')
//         })
//     }else if(req.body.updated == 'block'){
//         authModel.updateUser({email:email},{block:true}).then(updated=>{
//             req.flash('userupdated','This user has been blocked')
//             res.redirect('/admin/users')
//         }).catch(err=>{
//             console.log(err)
//             res.redirect('/error')
//         })
//     }else if(req.body.updated == 'blockclear'){
//         authModel.updateUser({email:email},{block:true}).then(updated=>{
//             // console.log(updated)
//             cartModel.deleteALL({userid:updated._id})
//             ordersModel.cancelALL({userid:updated._id})

//             req.flash('userupdated','This user has been blocked and Cart with Orders Deleted')
//             res.redirect('/admin/users')
//         }).catch(err=>{
//             console.log(err)
//             res.redirect('/error')
//         })
//     }else if(req.body.updated == 'unblock'){
//         authModel.updateUser({email:email},{block:false}).then(updated=>{
//             req.flash('userupdated','This user has been Unblocked')
//             res.redirect('/admin/users')
//         }).catch(err=>{
//             console.log(err)
//             res.redirect('/error')
//         })
//     }else if(req.body.updated == 'delete'){
//         authModel.deleteUser({email:email}).then(deleted=>{
//             console.log(deleted)
//             cartModel.deleteALL({userid:deleted._id})
//             ordersModel.cancelALL({userid:deleted._id})

//             req.flash('userupdated','This user has been deleted')
//             res.redirect('/admin/users')
//         }).catch(err=>{
//             console.log(err)
//             res.redirect('/error')
//         })
//     }

// }