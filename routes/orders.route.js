const Router=require('express').Router()
const protector=require('../protectors/auth.protector')
const bodyParser = require('body-parser')
const { check } = require('express-validator')
const orderscontroller=require('../controllers/orders.controller')

Router.post('/confirm',
protector.isUser,
bodyParser.urlencoded({extended:true}),
orderscontroller.saveorder
)
Router.post('/',
protector.isUser,
bodyParser.urlencoded({extended:true}),
orderscontroller.confirm
)

Router.get('/',
protector.isUser,
orderscontroller.getorders
)
Router.get('/confirm',
protector.isUser,
protector.confirm,
orderscontroller.getconfirm
)

Router.post('/cancel',
protector.isUser,
bodyParser.urlencoded({extended:true}),
orderscontroller.cancelItem
)
Router.post('/cancel/all',
protector.isUser,
bodyParser.urlencoded({extended:true}),
orderscontroller.cancelAll
)
Router.post('/edit',
protector.isUser,
bodyParser.urlencoded({extended:true}),
check('amount').isInt({min:1}),
orderscontroller.updateItem
)




module.exports=Router