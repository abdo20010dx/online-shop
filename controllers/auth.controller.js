const authModel=require('../models/auth.model')
const validationResult=require('express-validator').validationResult
const ipInfo = require("ipinfo")
const mail=require('./nodemailer.controller')





exports.createUser=(req,res,next)=>{
    let myphone
    if(typeof req.body.myphone == 'object' && req.body.myphone.length > 0){
        myphone=req.body.myphone[req.body.myphone.length-1]
    }else{myphone=req.body.myphone}
    let {name,address,email,pass,profession,facebook,instagram,youtube}=req.body;
    let social={facebook,instagram,youtube}
    // console.log('first'+email)
    /*how to search more than one condition by find and or {$or:[{email:email} , {phone:myphone}]} */
    authModel.getUser({email:email}).then(user=>{
        // console.log('second'+email)
        // console.log(user)
    if(validationResult(req).isEmpty() && user.length<=0/*validationResult(req).array()===0 or validationResult(req).isEmpty()*/){
        // console.log('third '+email)

        authModel.saveUser(name,address,JSON.parse(myphone),email,pass,profession,social)
.then((saved)=>{

    let fullUrl=`${req.protocol}://${req.get('host')}/activation/${saved._id}`
   let mess= `Hello ${name} to activate your account in gomla-express please click on this link 
      ${fullUrl}  
      thanks for joining gomla (:
      `

mail.nodemailer(email,'account Activation',mess)

req.flash('activeMess',"The Activation Link has been sent to your Email ,Please check your inbox !!")


    res.redirect('/activation')
})
.catch(err=>{
    console.log(err)
    res.redirect('/signup')
})

}else{

if(validationResult(req).array().length > 0) {
    req.flash("validationErr",validationResult(req).array())
}
if(user.length > 0) req.flash('emailexist','This Email Is Already Exist')


// console.log(validationResult(req).array())
// console.log(req.flash('validationErr'))
console.log('hello from else')
res.redirect('/signup')
}


}).catch(err=>{
    console.log(err)
    res.redirect('/error')

})


}

exports.viewUser=(req,res,next)=>{

    if(validationResult(req).array().length===0){
        console.log('done')
    let {email,pass}=req.body;
    authModel.login(email,pass)
.then((user)=>{
    if(!user.active){
        
        let fullUrl=`${req.protocol}://${req.get('host')}/activation/${user._id}`
        let mess= `Hello ${user.name} to activate your account in gomla-express please click on this link 
           ${fullUrl}  
           thanks for joining gomla (:
           `
     
     mail.nodemailer(user.email,'account Activation',mess)

     console.log(fullUrl)
     
            req.flash('activeMess',"This Account Hasn't been Activated yet, The Activation Link has been sent to your Email ,Please check your inbox !!")
            res.redirect('/activation')
        }else if(!user.block){
    req.session.User=user
    req.session.Pass=user.password
    req.session.userId=user._id
    req.session.Admin=user.admin
    req.session.Address=user.address
    // console.log(req.session.userId)
    // console.log(req.session.Admin)
    // console.log(req.session.Address)
    res.redirect('/home')
    }else{
        req.flash('blocked','you have ben blocked')
        res.redirect('/login')
    }
})
.catch(err=>{
    req.flash('authErr',err)
    console.log(err)
    res.redirect('/login')
})
    }else{
        req.flash('loginvalid',validationResult(req).array())
        res.redirect('/login')
    }
}

exports.logout=(req,res,next)=>{
    // console.log(req.session)
    req.session.destroy(()=>{
        res.redirect('/')
        console.log('destroy')
    })
}


exports.viewsignup= (req,res,next)=>{

 ipInfo((err, cLoc) => {
     if(cLoc)req.session.myIp=cLoc
// myIpInfo=cLoc || err
// if(cLoc){req.session.myIp=cLoc}
// console.log('my ip'+req.session.myIp)

// { ip: "94. ... .77",
//   hostname: "... .com",
//   city: "...",
//   region: "England",
//   country: "GB",
//   loc: "5...,3...",
//   org: "... UK Limited",
//   postal: "..." }

//  console.log(req.session.myIp)

    let vErr=req.flash('validationErr')
    // console.log(vErr)
    res.render('signup',{
        validerr:vErr,
        isuser:false,
        emailexist:req.flash('emailexist')[0],
            myipinfo:req.session.myIp|| {country:'us'}
    })
})

}


exports.viewsignin=(req,res,next)=>{
    res.render('signin',{
        autherr:req.flash('authErr')[0],
        loginvalid:req.flash('loginvalid'),
        isuser:false,
        blocked:req.flash('blocked')[0]
    })
}
