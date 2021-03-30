const mongoose=require('mongoose')
const chatSchema=mongoose.Schema({
    users:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}]
})
const Chat=mongoose.model('chat',chatSchema)
const mongoosedb=(db)=>{
<<<<<<< Updated upstream
    return `mongodb://localhost:27017/${db}`
=======
    return `mongodb+srv://abdo:mythologyofpasswordthroughdecades@cluster0.kxzcn.mongodb.net/${db}?retryWrites=true&w=majority`
>>>>>>> Stashed changes
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