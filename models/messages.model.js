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
    return `mongodb://localhost:27017/${db}`
}


exports.getMessages=async (queryobj)=>{
    try {
        await mongoose.connect(mongoosedb('commerce'))
       let messages= await Message.find(queryobj).populate({
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
