const router = require("express").Router();
const protector=require('../protectors/auth.protector')
const resestCotroller=require('../controllers/resestpass.controller');
const bodyParser = require("body-parser");
const check=require('express-validator').check


router.get('/',protector.notUser,resestCotroller.getResest)
router.post('/',protector.notUser,bodyParser.urlencoded({extended:true}),resestCotroller.sendResest)
router.post('/pass',protector.notUser,bodyParser.urlencoded({extended:true}),
check('newpass').isLength({min:6}).withMessage('the password must be at least 6 charcters'),
check('confirmpass').custom((value,{req})=>{
    let passValue=req.body.newpass
    if(value === passValue)return true
    else throw 'password not same'
}),

resestCotroller.changePass)
router.get('/:id/:hashed',protector.notUser,resestCotroller.getResestLink)

module.exports=router