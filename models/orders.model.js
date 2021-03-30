const mongoose = require("mongoose")
const orderSchema=mongoose.Schema({
    buyerid:String,
    sellerid:String,
    arrive:Number,
    timestamp:Number,
    productid:String,
    name:String,
    price:Number,
    amount:Number,
    category:String,
    description:String,
    image:String,
    address:String,
    phone:String,
    buyername:String,
    sellername:String,
    unread:String,
    status:{
        type:String,
        default:'pending'
    }
})
const Order=mongoose.model('order',orderSchema)
const mongoosedb=(db)=>{
    return `mongodb+srv://abdo:mythologyofpasswordthroughdecades@cluster0.kxzcn.mongodb.net/${db}?retryWrites=true&w=majority`
}




exports.saveorders=(orderData)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            
            let order=new Order(orderData)
            return order.save()
        }).then(saved=>{
            resolve(saved)
            mongoose.disconnect()
        }).catch(err=>{
            reject(err)
            mongoose.disconnect()
        })
    })
}


exports.getorders=(ordersquery)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
          return  Order.find(ordersquery,{},{sort:{timestamp:1}})
        }).then(orders=>{
            resolve(orders)
            mongoose.disconnect()
        }).catch(err=>{
            reject(err)
            mongoose.disconnect()
        })
    })
}



exports.cancelItem=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            // Cart.findByIdAndDelete(id)
            Order.findByIdAndDelete(id).then((deleted)=>{
                resolve(deleted)
                mongoose.disconnect()
            }).catch(err=>{
                reject('there error'+err)
                mongoose.disconnect()
            })
        })
    })
}

exports.cancelALL=(id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            // Cart.findByIdAndDelete(id)
            Order.deleteMany(id).then((deleted)=>{
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
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            Order.updateOne({_id:id},updatedItemData).then(updated=>{
                resolve(updated)
                mongoose.disconnect()
            }).catch(err=>{
                reject(err)
                mongoose.disconnect()
            })
        })
    })
}
