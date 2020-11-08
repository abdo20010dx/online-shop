const router=require('express').Router()
const messages=require('../controllers/messages.controller')
router.get('/',messages.viewMessages)


module.exports=router
