const mongoose=require('mongoose')
const cartSchema=mongoose.Schema({
    buyerid:String,
    sellerid:String,
    timestamp:Number,
    productid:String,
    name:String,
    price:Number,
    amount:Number,
    category:String,
    description:String,
    offer:String,
    arrive:Number,
    buyername:String,
    sellername:String,
    image:String
})
const Cart=mongoose.model('cart',cartSchema)
const mongoosedb=(db)=>{
    return `mongodb+srv://abdo:mythologyofpasswordthroughdecades@cluster0.kxzcn.mongodb.net/${db}?retryWrites=true&w=majority`
}


exports.saveToCart=(cartitem)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            let saveItem=new Cart(cartitem)
            return saveItem.save()
        }).then(()=>{
            resolve()
        }).catch(err=>{
            reject(err)
            mongoose.disconnect
        })
    })
}

exports.getFromCart=(userid)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
           return Cart.find(userid,{},{sort:{timestamp:-1}})
        }).then(items=>{
            if(items){
                resolve(items)
                }
        }).catch(err=>{
            reject(`there's err:${err}`)
        })
    })
}

exports.deleteItem=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            // Cart.findByIdAndDelete(id)
            Cart.findByIdAndDelete(id).then((deleted)=>{
                resolve(deleted)
                }).catch(err=>{
                reject(err)
                })
        })
    })
}
exports.deleteALL=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            // Cart.findByIdAndDelete(id)
            Cart.deleteMany(id).then((deleted)=>{
                resolve(deleted)
                }).catch(err=>{
                reject(err)
                })
        })
    })
}


exports.updateItem=(id,updatedItemData)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            Cart.updateOne({_id:id},updatedItemData).then(updated=>{
                resolve(`the updated on ${updated}`)
                }).catch(err=>{
                reject(err)
                })
        })
    })
}

exports.noRepeat=(queryObj)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            Cart.find(queryObj).then(repeated=>{
                resolve(repeated)
                }).catch(err=>{
                reject(`the error is:${err}`)
                })
        })
    })
}