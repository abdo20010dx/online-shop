const profileController=require('../controllers/profile.controller')
const protector=require('../protectors/auth.protector')
const bodyParser = require('body-parser')
const router = require('express').Router()
const check=require('express-validator').check
const myfunc=require('../server-sockets/friends.socket')


router.get('/settings',
protector.isUser,
profileController.profileSettings
)


router.get('/:id',
protector.isUser,
profileController.getProfile,
)
router.get('/',
protector.isUser,
(req,res,next)=>{
    if(req.session.userId){
        res.redirect(`/profile/${req.session.userId}`)
        }
}
)


router.post('/update',
protector.isUser,
bodyParser.urlencoded({extended:true}),
check('username').not().isEmpty().withMessage('this field required').isString(),
check('age').isInt().withMessage('this field must be number'),
check('city').not().isEmpty().withMessage('this field required'),
check('address').not().isEmpty().withMessage('this field required'),
check('phone').not().isEmpty().withMessage('this field required'),
profileController.updateProfile
)

router.post('/updatepass',
protector.isUser,
bodyParser.urlencoded({extended:true}),
check('newpass').isLength({min:6}).withMessage('the password must be at least 6 charcters'),
check('confirmpass').custom((value,{req})=>{
    let passValue=req.body.newpass
    if(value === passValue)return true
    else throw 'password not same'
}),
profileController.updatePass
)

router.get('/updatepass',
protector.isUser,
profileController.getUpdatePass
)

module.exports=router