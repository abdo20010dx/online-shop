const mongoose=require('mongoose')
const messageSchema=mongoose.Schema({
    chat:{type:mongoose.Schema.Types.ObjectId,ref:'chat'},
    content:String,
    sender:String,
    timestamp:Number,
    readed:String

})
const Message=mongoose.model('message',messageSchema)
const mongoosedb=(db)=>{
    return `mongodb+srv://abdo:mythologyofpasswordthroughdecades@cluster0.kxzcn.mongodb.net/${db}?retryWrites=true&w=majority`
}


exports.getMessages=async (queryobj)=>{
    try {
        await mongoose.connect(mongoosedb('ecommerce'))
       let messages= await Message.find(queryobj,null,{sort:{timestamp:1}}).populate({
            path:'chat',//field
            model:'chat',//model
            populate:{
                path:'users',
                model:'user',
                select:'name image'
            }
        })
    mongoose.disconnect()
    return messages
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error) 
    }
}

exports.saveMessage=async (dataObj)=>{
    try {
        await mongoose.connect(mongoosedb('commerce'))
        let newMessage=new Message({
            chat:dataObj.chat,
            content:dataObj.content,
            sender:dataObj.sender,
            timestamp:dataObj.timestamp,
            readed:dataObj.readed

        })
        let message=await newMessage.save()
    mongoose.disconnect()
    return message
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error) 
    }
}

exports.deleteMessage=async (dataObj)=>{
    try {
        await mongoose.connect(mongoosedb('commerce'))
        let deleted=await Message.findByIdAndDelete(dataObj)
        mongoose.disconnect()
        return deleted
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error) 
    }
}

exports.updateMessage=async (dataObj)=>{
    try {
        await mongoose.connect(mongoosedb('commerce'))
        let updated=await Message.update(dataObj)
        mongoose.disconnect()
        return updated
    } catch (error) {
        mongoose.disconnect()
        throw new Error(error) 
    }
}
