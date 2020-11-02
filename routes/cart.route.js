
const router=require('express').Router()
const cartController=require('../controllers/cart.cotroller')
const check=require('express-validator').check
const bodyParser=require('body-parser')
const authProtect=require('../protectors/auth.protector')


// router.post('/',
// authProtect.isUser,
// bodyParser.urlencoded({extended:true}),
// check('amount').isInt({min:1}).withMessage("the amount must be at least one"),
// cartController.addItem
// )
router.post('/delete',
authProtect.isUser,
bodyParser.urlencoded({extended:true}),
cartController.deleteItem
)


router.post('/:id',
authProtect.isUser,
bodyParser.urlencoded({extended:true}),
check('amount').isInt({min:1}).withMessage("the amount must be at least one"),
cartController.addItem
)

router.get('/',
authProtect.isUser,
cartController.getItem
)


router.post('/delete/all',
authProtect.isUser,
bodyParser.urlencoded({extended:true}),
cartController.deleteALL
)

router.post('/save',
authProtect.isUser,
bodyParser.urlencoded({extended:true}),
check('amount').isInt({min:1}).withMessage("the amount must be at least one"),
cartController.updateItem
)

module.exports=router