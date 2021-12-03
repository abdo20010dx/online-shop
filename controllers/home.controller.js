const productsModel=require('../models/products.model')
const userModel=require('../models/auth.model')

exports.gethome=(req,res,next)=>{
    // console.log(req.params.id)
//this method for chat
console.log('here is 1 '+req.params.id)
let id = req.params.id || req.session.userId

if(req.session.userId){

userModel.getUser({_id:id}).then(userData=>{
    console.log(req.query.from)
    console.log(req.query.to)
    let checkFriend;
    userData[0].friends.find(user=>{
        if(user.id == req.session.userId){
            checkFriend=user.id
        }
    })
    //save friendData , my data and (condition if friend) in session to use in socket 
    
    if(checkFriend){
        req.session.checkFriend=checkFriend
    }else{
        req.session.FriendData=userData[0]
    }
    



   let filterAvailable=['phones','beauty','cameras','test']
   let searchValue=req.query.search
   let categoryValue=req.query.category
   let errcart=req.flash('cartitemvalid')[0]
   let errcart2=req.flash('cartitemvalid2')[0]
   let categorysearch =filterAvailable.includes(categoryValue) || new RegExp('')

//    console.log(errcart)
//    console.log(errcart2)
   let renderView=(product)=>{
       req.session.Product=product
    //    console.log(req.session.Product)
    //render interface.ejs
    console.log('im in home')
res.render('interface',{
    checkfriend:checkFriend,
    products:product,
    isuser:req.session.userId,
    admin:req.session.Admin,
    itemcarterr:errcart,
    itemcarterr2:errcart2,
    seller:req.params.id,
    isowner:req.params.id == req.session.userId,
    user:req.session.User
})
}

        //get products from database
        productsModel.getProducts({sellerid:id,category:categorysearch,name:RegExp(searchValue),price:{$gt:req.query.from||false,$lt:req.query.to||Infinity}}).then(renderView)


}).catch(err=>console.log(err))

}else{
console.log('from else')
// if not user
let filterAvailable=['phones','beauty','cameras','test']
let categoryValue=req.query.category
let searchValue=req.query.search
let errcart=req.flash('cartitemvalid')[0]
let errcart2=req.flash('cartitemvalid2')[0]
let categorysearch =filterAvailable.includes(categoryValue) || new RegExp('')

//    console.log(errcart)
//    console.log(errcart2)
let renderView=(product)=>{
    req.session.Product=product
 //    console.log(req.session.Product)
 //render interface.ejs
res.render('interface',{
 checkfriend:true,
 products:req.session.Product,
 isuser:req.session.userId,
 admin:req.session.Admin,
 itemcarterr:errcart,
 itemcarterr2:errcart2,
 seller:req.params.id
})
}

        //get products from database
        productsModel.getProducts({sellerid:id,category:categorysearch,name:RegExp(searchValue),price:{$gt:req.query.from||false,$lt:req.query.to||Infinity}}).then(renderView)


}

}