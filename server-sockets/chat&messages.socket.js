const chatModel=require('../models/Chat.model')
const messagesModel=require('../models/messages.model')


exports.chatSocket=(Io)=>{
    Io.on('connection',socket=>{

        socket.on('archieve',(dataobj)=>{
            let {chatId,myId}=dataobj
            chatModel.updateChat({_id:chatId},{$push:{archieve:myId}})
        })

        socket.on('blocked',(dataobj)=>{
            let {chatId,myId}=dataobj
            chatModel.updateChat({_id:chatId},{$push:{blocked:myId}})
        })

    })
}

exports.messagesSocket=(Io)=>{
    Io.on('connection',socket=>{
        socket.on('join',chatid=>{
            socket.join(chatid)
        })

        socket.on('saveMessage',(dataObj)=>{
            let newMessage={
                chat:dataObj.chat,
                content:dataObj.content,
                sender:dataObj.sender,
                timestamp:Date.now(),
                readed:dataObj.readed
            }
            messagesModel.saveMessage(newMessage).then(saved=>{
                Io.to(dataObj.chat).emit('getMessage',newMessage)
            }).catch(err=>{
                console.log(err)
            })
    

        })

        socket.on('blocked',(dataobj)=>{
            let {chatId,myId}=dataobj
            chatModel.updateChat({_id:chatId},{$push:{blocked:myId}})
        })

    })
}


