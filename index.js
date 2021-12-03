const express=require('express')
const app=express()
const server=require('http').createServer(app)
const Io=require('socket.io')(server)
const sharedsession=require('express-socket.io-session')
const path=require('path')
const homeRouter=require('./routes/home.route')
const productRouter=require('./routes/product.route')
const authRouter=require('./routes/auth.route')
const cartRouter=require('./routes/cart.route')
const orderRouter=require('./routes/orders.route')
const myproductsRouter=require('./routes/myproducts.route')
const profileRouter=require('./routes/profile.route')
const messagesRouter=require('./routes/messages.route')
const activationRouter=require('./routes/activation.route')
const resestPassRouter=require('./routes/resest.route')
const testRouter=require('./routes/test.route')
const flash=require('connect-flash')
const sessionServer=require('express-session')
const sessionStore=require('connect-mongodb-session')(sessionServer)
const STORE=new sessionStore({
    uri:`mongodb+srv://abdo:mythologyofpasswordthroughdecades@cluster0.kxzcn.mongodb.net/ecommerce?retryWrites=true&w=majority`,
    collection:'sessions'
})
const session=sessionServer({
    secret:'the mythology of secret session',
    store:STORE
})


app.use(session)



app.set('view engine','ejs')
app.set('views','views')
app.use(express.static(path.join(__dirname,'assets')))
app.use(express.static(path.join(__dirname,'images')))
app.use(express.static(path.join(__dirname,'./node_modules/intl-tel-input/build')))

app.use('/myproducts',express.static(path.join(__dirname,'images')))
app.use('/home',express.static(path.join(__dirname,'images')))
// i had an big error here that explode my head ,
// req.params.id every time give me src of image on path /home/:id
//but after i used app.use('/home/:id') for static images now just give me the id
app.use('/home/:id',express.static(path.join(__dirname,'images')))
app.use('/product',express.static(path.join(__dirname,'images')))
app.use('/profile',express.static(path.join(__dirname,'images')),(req,res,next)=>{next()})
app.use(flash())
Io.use(sharedsession(session))


app.use('/myproducts',myproductsRouter)
app.use('/profile',profileRouter)
app.use('/chat',messagesRouter)
app.use('/cart',cartRouter)
app.use('/orders',orderRouter)
app.use('/home',homeRouter)
app.use('/',authRouter)
app.use('/product',productRouter)
app.use('/activation',activationRouter)
app.use('/resest',resestPassRouter)
app.use('/test',testRouter)
// app.get('/',(req,res,next)=>{
//     res.send(req.params)
//     // res.render('interface')
// })

const nodemailer=require('nodemailer')
const friendSocket=require('./server-sockets/friends.socket')
const chat_messages_socket=require('./server-sockets/chat&messages.socket')
const intltelinput=require('intl-tel-input')
// const intlTelInput=require('intlTelInput')
// console.log(intlTelInput)
Io.onlineUsers={}
friendSocket.friendSocket(Io,app)
chat_messages_socket.chatSocket(Io)
chat_messages_socket.messagesSocket(Io)
// Io.on('connection',socket=>{
// })


function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
 
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


server.listen(port,(err)=>{
    if(err)console.error(err)
    console.log(`listen on http://localhost:80 http://192.168.1.1`)
})
console.log(Io.onlineUsers)
