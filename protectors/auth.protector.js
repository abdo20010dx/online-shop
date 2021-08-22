const session = require("express-session")
const authModel=require('../models/auth.model')


exports.notUser=(req,res,next)=>{
    if(!req.session.userId)next()
    else res.redirect('/signup')
}
exports.isUser=(req,res,next)=>{
    if(req.session.userId)next()
    else res.redirect('/login')
}

exports.confirm=(req,res,next)=>{
    if(req.session.Order){next()}
    else if(req.session.Allorders){next()}
    else{ res.redirect('/cart')}
}

exports.isAdmin=(req,res,next)=>{
    if(req.session.Admin) next()
    else res.redirect('/')
}

exports.scope=(req,res,next)=>{
    authModel.getUser({_id:req.params.id}).then(user=>{
        if(req.session.User.profession == 'customer' && user[0].profession == 'shop'){
            next()
    }else if(req.session.User.profession == 'shop' && user[0].profession == 'trader'){
        next()
}else if(req.session.User.profession == 'trader' && user[0].profession == 'factory'){
    next()
}else if(req.session.userId == req.params.id){
    next()
}else{
    res.redirect('/home')
}
    }).catch(err=>{
        console.log(err)
        res.redirect('/home')

    })

}
