const router=require('express').Router()
const homeController=require('../controllers/home.controller')
const protector=require('../protectors/auth.protector')

router.get('/',(req,res,next)=>{
    if(req.session.userId){
    res.redirect(`/home/${req.session.userId}`)
    }else{
        res.redirect(`/`)
    }
})
router.get('/:id',protector.scope,homeController.gethome)

module.exports=router