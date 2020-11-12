const mongoose  = require('mongoose')
const authModel=require('../models/auth.model')
const chatModel=require('../models/Chat.model')

exports.friendSocket=(Io,app)=>{
    Io.on('connection',socket=>{


        socket.on('signedin',(userdata)=>{
            Io.sockets.emit(`online${userdata.seller}`,userdata)
            Io.onlineUsers[userdata.seller]=true
            authModel.getUserAndFilter({_id:userdata.seller},{friends:true}).then(friends=>{
                let myOnlineUsers=friends[0].friends.filter(friend=>Io.onlineUsers[friend.id])
                socket.emit('myOnlineFriends',myOnlineUsers)
            })



            socket.on('disconnect',()=>{
                Io.onlineUsers[userdata.seller]=false
            let userData={
                name:socket.handshake.session.User.name,
                profession:socket.handshake.session.User.profession,
                image:socket.handshake.session.User.image,
                seller:socket.handshake.session.User._id,
            }
    
                Io.sockets.emit(`offline${userData.seller}`,userData)
            })
    

        })
    })


Io.on('connection',socket=>{
    // console.log(socket.handshake.session.FriendData)
    //preventer to prevent this method happen again
    // let preventer
    //this method to save friend data to  ->(current user friends array) and current user data to ->(friend friends array)
    socket.on('addfriend', ()=>{
        if(socket.handshake.session.FriendData ){
                      
            let friendData=socket.handshake.session.FriendData
            let myData=socket.handshake.session.User
            let myId=String(myData._id)
            let friendId=String(friendData._id)
    
        if(friendId  != myId){
            chatModel.Chat(myId,friendId).then(async chatDoc=>{
                await authModel.updateUser({_id:myId},{$push:{friends:{id:friendId,image:friendData.image,name:friendData.name,chatid:chatDoc._id}}}).then(updated=>console.log(updated)).catch(err=>{console.log(err)})
                await authModel.updateUser({_id:friendId},{$push:{friends:{id:myId,image:myData.image,name:myData.username,chatid:chatDoc._id}}}).then(updated=>{ delete socket.handshake.session.FriendData }).catch(err=>{console.log(err)})
                await authModel.getUser({_id:myId}).then(user=>{
                    socket.handshake.session.User=user[0]
                    socket.handshake.session.save()
                }).catch(err=>{
                    console.log(err)
                })
                //  preventer=true
        
            })
    }
        }

    })

    //  socket.on('joinRoom',()=>{
    //      socket.join('Room')
    //      console.log('joined')
    //  })
})

}