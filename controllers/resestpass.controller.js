const mail =require('./nodemailer.controller')
const authModel=require('../models/auth.model')
const bcrypt=require('bcrypt')
const { validationResult } = require('express-validator')



exports.getResest=(req,res,next)=>{
    res.render('resestpass',{
        isuser:req.session.userId,
        resest:req.flash('resest')[0],
        passchanged:req.flash('passchanged')[0],
        resestsent:req.flash('resestsent')[0],
        passvalid:req.flash('passvalid'),
        user:0,

    })
}

exports.sendResest=(req,res,next)=>{
    let randomNumber=Math.floor(Math.random() * 99999999999999)
    console.log(randomNumber)
    authModel.updateUser({email:req.body.email},{resestpass:randomNumber}).then(user=>{
        let fullUrl=`${req.protocol}://${req.get('host')}/resest/${user._id}/${randomNumber}`
        let mess= `Hello ${user.name} to resest your password in gomla-express please click on this link 
           ${fullUrl}  
           thanks for joining gomla (:
           `
    
     mail.nodemailer(user.email,'account Activation',mess)

     req.flash('resestsent',"The Link to Resest Password Has been Sent To Your Email,Please Check Your Inbox !! ")
     console.log(fullUrl)
     res.redirect('/resest')

    })

}

exports.getResestLink=(req,res,next)=>{
    console.log(req.params.id)
    console.log(req.params.hashed)
    authModel.getUser({_id:req.params.id,resestpass:req.params.hashed}).then(user=>{
        if(user[0]){
            req.flash('resest',{
                mess:'please insert new password',
                id:req.params.id,
                hashed:req.params.hashed
            })
            res.redirect('/resest')        
        }else{
            req.flash('resestsent',"The Resest Link  is Wrong !! ")
            res.redirect('/resest')        
        }
    }).catch(err=>{
        req.flash('resestsent',"The Resest Link  is Wrong !! ")
        res.redirect('/resest')        

        console.log('the err   '+err)
    })
}

exports.changePass=async (req,res,next)=>{
    let {id,hashed,newpass}=req.body
     let password=await bcrypt.hash(newpass,15)

    console.log(id)
    console.log(hashed)
    console.log(password)
    if(validationResult(req).array().length < 1){
    authModel.updateUser({_id:id,resestpass:hashed},{password:password}).then(updated=>{
        req.flash('passchanged',"The Password Has Been Changed Successfully (:")
        res.redirect('/resest')        

    }).catch(err=>{
        console.log(err)
    })
}else{
    req.flash('resest',{
        mess:'please insert new password',
        id:id,
        hashed:hashed
    })

    req.flash('passvalid',validationResult(req).array())
    res.redirect('/resest')

}
}