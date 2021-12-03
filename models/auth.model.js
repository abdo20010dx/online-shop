const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userSchema=mongoose.Schema({
    name:String,
    address:String,
    phone:{
    dialcode:String,
    number:String,
    iso2:String
    }
        ,
    password:String,
    email:String,
    about:String,
    profession:String,
    social:{
        facebook:String,
        instagram:String,
        youtube:String
    },
    image:{
        type:String,
        default:'profile.jpg'    
    },
    // online:{
    //     type:Boolean,
    //     default:false
    // },
    friends:{
        type:[{name:String,image:String,id:String,chatid:String,block:{type:Boolean,default:false}}],
        default:[]
    },
    admin:{
        type:Boolean,
        default:false
    },
    chief:{
        type:Boolean,
        default:false
    },
    block:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:true
    },
    resestpass:Number,
})
const User=mongoose.model('user',userSchema)
const mongoosedb=(db)=>{
    // return `mongodb://localhost:27017/${db}`
    return `mongodb+srv://abdo:mythologyofpasswordthroughdecades@cluster0.kxzcn.mongodb.net/${db}?retryWrites=true&w=majority`
}

exports.saveUser=(name,address,phone,email,pass,profession,social)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
           return User.findOne({email:email})

            }).then(found=>{
                if(found){
                reject("e-mail already exists")
                    }
                else{
                   return bcrypt.hash(pass,15)
                }
        }).then((hashedpass)=>{
            let user =new User({
                name:name,
                address:address,
                phone:phone,
                password:hashedpass,
                email:email,
                profession:profession,
                social:social
            
            })
           return user.save()
        }).then((saved)=>{
            resolve(saved)
        }).catch(err=>{
            reject(`there is error${err}`)
        })
    })
}


exports.login=(email,pass)=>{
return new Promise((resolve,reject)=>{
    mongoose.connect(mongoosedb('ecommerce')).then(()=>{
       return User.findOne({email:email})
    }).then(user=>{
        if(!user){
            reject('there no user matches that email')
        }else{
            bcrypt.compare(pass,user.password).then(same=>{
                if(!same){
                            reject('password is not correct')
                }else{
                            resolve(user)
                }
            })
        }
    }).catch(err=>{
        mongoose.disconnect()
        reject(`there is error of this account: ${err}`)
    })
})
}


exports.getUser=(queryobj)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            return User.find(queryobj)
        }).then(user=>{
            resolve(user)
        }).catch(err=>{
            reject(err)
        })
    })
}


exports.getUserAndFilter=(queryobj,filter)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
            return User.find(queryobj,filter)
        }).then(user=>{
            resolve(user)
        }).catch(err=>{
            reject(err)
        })
    })
}


exports.updateUser=(query,data)=>{
return new Promise((resolve,reject)=>{
    mongoose.connect(mongoosedb('ecommerce')).then(()=>{
        return User.findOneAndUpdate(query,data)
    }).then(updated=>{
        resolve(updated)
        mongoose.disconnect
    }).catch(err=>{
        reject(err)
        mongoose.disconnect()
    })
})
}


exports.updatePass=(encrypted,numberpass,newpass,query)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
           return bcrypt.compare(numberpass,encrypted)
        }).then(same=>{
            if(!same){
                reject('the password is wrong')
                }else{
                return bcrypt.hash(newpass,15)
            }
        }).then(hashedpass=>{
            User.findByIdAndUpdate(query,{password:hashedpass}).then(updated=>{
                let resolvedData={
                    updated:updated,
                    hashedpass:hashedpass
                }
                resolve(resolvedData)
                }).catch(err=>{
                reject(err)
                })
        })
    })
}


exports.deleteUser=(queryObj)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(mongoosedb('ecommerce')).then(()=>{
           return User.findOneAndDelete(queryObj)
        }).then(deleted=>{
            resolve(deleted)
        }).catch(err=>{
            reject(err)
        })
    })
}



