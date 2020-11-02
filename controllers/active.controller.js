
const authModel=require('../models/auth.model')
const mail=require('./nodemailer.controller')
exports.viewActive=(req,res,next)=>{
    res.render('activation',{
        isuser:req.session.userId,
        activemess:req.flash('activeMess')[0]
    })

    
}

exports.postActive=(req,res,next)=>{
    
    authModel.getUser({email:req.body.email}).then(user=>{
        console.log(user)
        if(user.length < 1){
            req.flash('activeMess',"sorry this account doesn't exist")
            res.redirect('/activation')
            
        }else if(user.length > 0) {
            if(user[0].active){
                req.flash('activeMess',"this account is already activated")
                res.redirect('/activation')

            }else {
                // remember ${req.originalUrl}
                let fullUrl=`${req.protocol}://${req.get('host')}/activation/${user[0]._id}`
                let mess= `Hello ${user[0].name} to activate your account in gomla-express please click on this link 
                   ${fullUrl}  
                   thanks for joining gomla (:
                   `
             
             mail.nodemailer(req.body.email,'account Activation',mess)
    
            
             req.flash('activeMess',"The Activation Link has been sent to your Email ,Please check your inbox !!")
             res.redirect('/activation')

            }
        }
    }).catch(err=>{
        console.log('my err'+err)
    })
    
}


exports.active=(req,res,next)=>{
    authModel.updateUser({_id:req.params.id},{active:true}).then(updated=>{
        if(updated){
        req.flash('activeMess','Your Account Has been Activated, You Can log In (:')
        res.redirect('/activation')
        }else{
            req.flash('activeMess',"Wrong Activation Link !!")
            res.redirect('/activation')
    
        }
    }).catch(err=>{
        console.log(err)
    })
}