const socket=io() //this side acts as a client and as we have defined io.on function when it sees a connection it runs the callback function
// socket.on('countupdated',(count)=>{ 
//       console.log("Count has been updated",count)
// })

// document.getElementById('increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })

//query string
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
const autoscroll=()=>{
  const $newmsg=document.getElementById('new-msg').lastElementChild
  const newmsgstyles=getComputedStyle($newmsg)
  const newmsgmargin=parseInt(newmsgstyles.marginBottom)
  const newmsgheight=$newmsg.offsetHeight+newmsgmargin
  const visibleheight=document.getElementById('new-msg').offsetHeight
  const contentheight=document.getElementById('new-msg').scrollHeight
  const scrolloffset=document.getElementById('new-msg').scrollTop+visibleheight
  if(contentheight-newmsgheight<=scrolloffset){
    document.getElementById('new-msg').scrollTop=document.getElementById('new-msg').scrollHeight
  }
}
socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(document.getElementById('chat-temp').innerHTML,{
      username:message.username,
      chat_message:message.text, //dynamic rendering of message
      // createdAt:message.createdAt //to get createdAt time present in messages.js file in utils
     createdAt:moment(message.createdAt).format('HH:mm A')
    })
    document.getElementById('new-msg').insertAdjacentHTML('beforeEnd',html)
    autoscroll()
  })

socket.on('roomdata',({room,users})=>{
  const html=Mustache.render(document.getElementById('sidebar-template').innerHTML,{
    room,
    users
  })
  document.getElementById('sidebar').innerHTML=html
})
document.getElementById('chatform').addEventListener('submit',(e)=>{
  e.preventDefault()
  document.querySelector('#chatform').querySelector('button').setAttribute('disabled','disabled')
  const msg=document.querySelector('input').value
  socket.emit('sendmsg',msg)
  document.querySelector('#chatform').querySelector('button').removeAttribute('disabled')
  document.querySelector('input').value='' //to clear the entered text once submitted
  document.querySelector('input').focus() //to reset the cursor inside into input field
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
      alert(error)
      location.href = '/'
  }
})