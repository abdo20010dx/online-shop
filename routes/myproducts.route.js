const Router=require('express').Router()
const protector=require('../protectors/auth.protector')
const bodyParser = require('body-parser')
const multer = require('multer')
// const { check } = require('express-validator')
const orderscontroller=require('../controllers/orders.controller')
const myproductscontroller=require('../controllers/myproducts.controller')




Router.get('/orders',
protector.isUser,
orderscontroller.getMangeOrders
)
Router.post('/orders/edit',
protector.isUser,
bodyParser.urlencoded({extended:true}),
orderscontroller.updateItem
)

Router.get('/add',
myproductscontroller.getAdd
)

Router.post('/add',
protector.isUser,
multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'images')
        },
        filename:(req,file,cb)=>{
            cb(null,`${Date.now()}-${file.originalname}`)
        }
    }),
    limits:{fileSize:500000},
    fileFilter:(req,file,cb)=>{
        if((file.mimetype != 'image/jpeg') && (file.mimetype != 'image/png')){
            
            console.log(file.mimetype != 'image/png')
            req.fileError='something went wrong ,file extension must be jpg or png '
            return cb(null,false, new Error('something went wrong ,file extension must be jpg or png'))
        }
        cb(null,true)
    }
}).single('image'),
myproductscontroller.saveAdd
)


Router.post('/edit',
protector.isUser,
bodyParser.urlencoded({extended:true}),
myproductscontroller.updateProduct
)
Router.post('/delete',
protector.isUser,
bodyParser.urlencoded({extended:true}),
myproductscontroller.deleteProduct
)


// Router.get('/users',
// protector.isUser,
// protector.isAdmin,
// myproductscontroller.getManageUsers
// )

// Router.post('/users/update',
// protector.isUser,
// protector.isAdmin,
// bodyParser.urlencoded({extended:true}),
// myproductscontroller.updateUser
// )





module.exports=Router