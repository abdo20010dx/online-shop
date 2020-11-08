const userModel=require('../models/auth.model')
const { validationResult } = require('express-validator')



exports.profileSettings=(req,res,next)=>{
    let User=req.session.User
    // console.log(User)
    res.render('user',{
        user:User,
        isuser:req.session.userId,
        updateprofile:req.flash('updateprofile'),
        updatesuccess:req.flash('updatesuccess')[0]

    })
}

exports.updateProfile=(req,res,next)=>{
    if(validationResult(req).isEmpty()){
    let {username,address,phone,city,age}=req.body
    let id =req.session.userId
    let data={
        username:username,
        age:age,
        city:city,
        address:address,
        phone:phone,
    }
    
    userModel.updateUser({_id:id},data).then(updated=>{

        let data2={
            username:username,
            age:age,
            city:city,
            address:address,
            phone:phone,
            email:updated.email,
        }
      if(updated){
          // save message in flash say that profile updated
        req.flash('updatesuccess','the profile has been updated')
          //here i update the user information in session too
          req.session.User=data2
          req.session.Pass=updated.password
    }

        // console.log('the updated'+updated)
        res.redirect('/profile')


        
    }).catch(err=>{
        res.redirect('/error')
        console.log(err)
    })


}else{
    req.flash('updateprofile',validationResult(req).array())
    res.redirect('/profile')
}
}

exports.updatePass=(req,res,next)=>{
    if(validationResult(req).isEmpty()){

    // console.log(validationResult(req).array())

    let encryptedPass=req.session.Pass
    let id = req.session.userId
    let {pass,newpass}=req.body
    userModel.updatePass(encryptedPass,pass,newpass,id).then(updated=>{
        req.session.Pass=updated.hashedpass  //here i update the hashed password in session too
        // console.log( updated.hashedpass)
        // console.log( updated.updated)
        req.flash('updatesuccess',"the password has been updated")

        res.redirect('/profile')

    }).catch(err=>{
        req.flash('wrongpass',err)

        res.redirect('/profile/updatepass')

        console.log(err)
    })
    console.log(req.flash('updatesuccess') )
    console.log(req.flash('wrongpass') )

}else{
    req.flash('updatepass',validationResult(req).array())
    res.redirect('/profile/updatepass')
}

}

exports.getUpdatePass=(req,res,next)=>{
    // console.log(req.session.Pass)
    res.render('update-pass',{
        isuser:req.session.userId,
        updatepass:req.flash('updatepass'),
        wrongpass:req.flash('wrongpass')[0]
    })
}


exports.getProfile=(req,res,next)=>{
    
    let id = req.params.id || req.session.userId
    userModel.getUser({_id:id}).then(userData=>{
        let checkFriend;
        userData[0].friends.find(user=>{
            if(user.id == req.session.userId){
                checkFriend=user.id
            }
        })
        //save friendData , my data and (condition if friend) in session to use in socket 
        
        if(checkFriend){
            req.session.checkFriend=checkFriend
        }else{
            req.session.FriendData=userData[0]
        }

        res.render('profilePage',{
            isuser:req.session.userId,
            user:userData[0],
            seller:userData[0]._id,
            checkfriend:checkFriend,
            isowner:req.params.id == req.session.userId,
        })
    })
    // next()
}