//basic way of creating express server
// const express=require('express')
// const path=require('path')
// const app=express();
// app.use(express.static(path.join(__dirname,'../public')))
// app.get('',(req,res)=>{
//     res.sendFile(path.join(__dirname,'../public/index.html'))
// })
// app.listen(3000,()=>{
//   console.log("running on port 3000")
// })

//another way that allows us to use both express and socket.io
const path=require('path')
const express=require('express')
const http=require('http')
const socketio=require('socket.io')
const generatemsg=require('./utils/messages')
const app=express();
const {adduser,get_add_user,getuser,removeuser}=require('./utils/users')
const server=http.createServer(app)
const io=socketio(server) //we need to specify server as argument on which we want socket.io to work
app.use(express.static(path.join(__dirname,'../public')))


// let count=0
io.on('connection',(socket)=>{ //used for connection with the client
    console.log("new connection")
    // socket.emit('countupdated',count) //used for sending event or data
    // socket.on('increment',()=>{ //on click of event increment
    //     count++;
    //     // socket.emit('countupdated',count)
    //     io.emit('countupdated',count)
    // })
    socket.on('join', (options, callback) => {
        const { error, user } = adduser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generatemsg('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generatemsg('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:get_add_user(user.room)
        })

        callback()
    })

    socket.on('sendmsg',msg=>{
        const user=getuser(socket.id)
        io.to(user.room).emit('message',generatemsg(user.username,msg))
    })
    socket.on('disconnect',()=>{
       const user= removeuser(socket.id)
       if(user){
        io.to(user.room).emit('message',generatemsg('Admin',`'${user.username}' has left the room`))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:get_add_user(user.room)
        })
       }
    })
})

server.listen(3000,()=>{
    console.log('server is up and running on port 3000')
})