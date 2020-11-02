const router=require('express').Router()
const activationController=require('../controllers/active.controller')
const protector=require('../protectors/auth.protector')
const bodyParser = require('body-parser')

router.get('/',protector.notUser,activationController.viewActive)
router.post('/',bodyParser.urlencoded({extended:true}),protector.notUser,activationController.postActive)
router.get('/:id',protector.notUser,activationController.active)

module.exports=router