const router=require('express').Router()
const authController=require('../controllers/auth.controller')
const bodyParser=require('body-parser')
// const express=require('express')
// const app = express()
const check=require('express-validator').check
const authProtect=require('../protectors/auth.protector')




// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
// app.use(bodyParser.json())

router.get('/login',authProtect.notUser,authController.viewsignin)


router.post('/signup',
authProtect.notUser,
bodyParser.urlencoded({ extended: true }),
check('name').not().isEmpty().withMessage('name is required').isString(),
check('email').not().isEmpty().withMessage('E-mail is required').isEmail().withMessage('invalid email format'),
check('address').not().isEmpty().withMessage('address is required'),
check('myphone').not().isEmpty().withMessage('phone is required'),
check('pass').isLength({min:6}).withMessage('password must be at least 6 characters'),
check('confirmpass').custom((value,{req})=>{
    let passValue=req.body.pass
    if(value === passValue)return true
    else throw 'password not same'
}),
check('profession').custom((value,{req})=>{
    let jobValue=['factory','trader','shop','customer']
    if(jobValue.includes(value) )return true
    else throw 'Account Type is required'
}),
authController.createUser)


router.get('/signup',authProtect.notUser,authController.viewsignup)

router.post('/login',
authProtect.notUser,
bodyParser.urlencoded({ extended: true }),
check('email').not().isEmpty().isEmail().withMessage('invalid login email format'),
check('pass').isLength({min:6}),
authController.viewUser)

router.all('/logout',authProtect.isUser,authController.logout)

module.exports=router