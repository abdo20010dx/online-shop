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
        mongoose.connect(mongoosedb('ecommerce'),{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then(()=>{
            let saveItem=new Cart(cartitem)
            return saveItem.save()
        }).then(()=>{
            resolve()
            mongoose.disconnect()
        }).catch(err=>{
            reject(err)
            mongoose.disconnect
        })
    })
}

exports.getFromCart=(userid)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce'),{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then(()=>{
           return Cart.find(userid,{},{sort:{timestamp:-1}})
        }).then(items=>{
            if(items){
                resolve(items)
                mongoose.disconnect()
            }
        }).catch(err=>{
            reject(`there's err:${err}`)
            mongoose.disconnect()
        })
    })
}

exports.deleteItem=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce'),{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then(()=>{
            // Cart.findByIdAndDelete(id)
            Cart.findByIdAndDelete(id).then((deleted)=>{
                resolve(deleted)
                mongoose.disconnect()
            }).catch(err=>{
                reject(err)
                mongoose.disconnect()
            })
        })
    })
}
exports.deleteALL=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce'),{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then(()=>{
            // Cart.findByIdAndDelete(id)
            Cart.deleteMany(id).then((deleted)=>{
                resolve(deleted)
                mongoose.disconnect()
            }).catch(err=>{
                reject(err)
                mongoose.disconnect()
            })
        })
    })
}


exports.updateItem=(id,updatedItemData)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce'),{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then(()=>{
            Cart.updateOne({_id:id},updatedItemData).then(updated=>{
                resolve(`the updated on ${updated}`)
                mongoose.disconnect()
            }).catch(err=>{
                reject(err)
                mongoose.disconnect()
            })
        })
    })
}

exports.noRepeat=(queryObj)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce'),{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }).then(()=>{
            Cart.find(queryObj).then(repeated=>{
                resolve(repeated)
                mongoose.disconnect()
            }).catch(err=>{
                reject(`the error is:${err}`)
                mongoose.disconnect()
            })
        })
    })
}