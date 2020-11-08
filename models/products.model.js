const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    name:String,
    price:Number,
    category:String,
    description:String,
    offer:String,
    image:String,
    sellerid:String,
    sellername:String,
    arrive:Number,
    slide:Boolean,
    search:{
        type:Boolean,
        default:true
    },
    countries:[String]
});

const product=mongoose.model('product',productSchema);
const mongoosedb=(db)=>{
    return `mongodb://localhost:27017/${db}`
}

exports.getProducts=(QueryObject)=>{
return new Promise((resolve,reject)=>{
        //connect to db
        mongoose.connect(mongoosedb('ecommerce'),{useNewUrlParser:true},()=>{
            //get products
        
                product.find(QueryObject).then(products=>{
            //disconnect
            mongoose.disconnect()
            resolve(products)

                }).catch(err=>{reject(err)}) 
            })
})
}

exports.addProduct=(data)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            let producto=new product(data)
            return producto.save()
        }).then(saved=>{
            resolve(saved)
            mongoose.disconnect()
        }).catch(err=>{
            reject(err)
            mongoose.disconnect()
        })
    })
}


exports.updateProduct=(query,newData)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            return product.findByIdAndUpdate(query,newData)
        }).then(updated=>{
            resolve(updated)
            mongoose.disconnect()
        }).catch(err=>{
            reject(err)
            mongoose.disconnect()
        })
    })
}


exports.deleteProduct=(query)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            return product.findByIdAndDelete(query)
        }).then(deleted=>{
            resolve(deleted)
            mongoose.disconnect()
        }).catch(err=>{
            reject(err)
            mongoose.disconnect()
        })
    })
}