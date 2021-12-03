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
    return `mongodb+srv://abdo:mythologyofpasswordthroughdecades@cluster0.kxzcn.mongodb.net/${db}?retryWrites=true&w=majority`
}

exports.getProducts=(QueryObject)=>{
return new Promise((resolve,reject)=>{
        //connect to db
        mongoose.connect(mongoosedb('ecommerce'),()=>{
            //get products
        
                product.find(QueryObject).then(products=>{
            //disconnect
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
        }).catch(err=>{
            reject(err)
        })
    })
}


exports.updateProduct=(query,newData)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            return product.findByIdAndUpdate(query,newData)
        }).then(updated=>{
            resolve(updated)
        }).catch(err=>{
            reject(err)
        })
    })
}


exports.deleteProduct=(query)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            return product.findByIdAndDelete(query)
        }).then(deleted=>{
            resolve(deleted)
        }).catch(err=>{
            reject(err)
        })
    })
}