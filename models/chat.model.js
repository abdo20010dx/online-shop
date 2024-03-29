const mongoose=require('mongoose')
const chatSchema=mongoose.Schema({
    users:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
    archieve:{type:[String],default:[]},
    blocked:{type:[String],default:[]}
})
const Chat=mongoose.model('chat',chatSchema)
const mongoosedb=(db)=>{
    return `mongodb+srv://abdo:mythologyofpasswordthroughdecades@cluster0.kxzcn.mongodb.net/${db}?retryWrites=true&w=majority`
}




// exports.Chat=Chat

exports.Chat=async (myId,friendId)=>{
    try {
       await mongoose.connect(mongoosedb('ecommerce'))
       let newChat= new Chat({
           users:[myId,friendId]
       })
       let chatDoc=await newChat.save()
       mongoose.disconnect()
       return chatDoc
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error)
        
    }
}
exports.updateChat=async (query,dataObj)=>{
    try {
       await mongoose.connect(mongoosedb('ecommerce'))
       let updatedchat=await Chat.findOneAndUpdate(query,dataObj)
       mongoose.disconnect()
       return updatedchat
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error)
        
    }
}
exports.getChat=async (dataObj)=>{
    try {
       await mongoose.connect(mongoosedb('ecommerce'))
       let getchat=await Chat.find(dataObj).populate({
           path:'users',
           model:'user',
           select:'name image'
       })
       mongoose.disconnect()
       return getchat
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error)
        
    }
}