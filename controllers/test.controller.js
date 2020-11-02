exports.socketmsg=(req,res,next)=>{
    res.render('test',{isuser:req.session.userId})
}