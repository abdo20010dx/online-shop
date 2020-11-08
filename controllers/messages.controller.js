exports.viewMessages=(req,res,next)=>{
res.render('messages',{
    user:req.session.User,
    isuser:req.session.userId,
})
}