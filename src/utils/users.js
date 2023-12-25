const users=[] //array that will contain all users of chatapp
//functionalities in this file
//1.add user
//2.removeuser
//3.getuser
//4.getuserroom

const adduser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: `'${username}' username already exists`
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}
//remove user functionality
const removeuser=(id)=>{
   const index=users.findIndex((user)=>{
    return user.id===id
   })
   if(index!=-1){
    return users.splice(index,1)[0] //this returns an array
   }
}
//getuser
const getuser=(id)=>{
    const get_user=users.find((user)=>{
        return user.id===id
    })
    if(!get_user){
        return {error:'No user found!!!'}
    }
    return get_user
}
//add user in room
const get_add_user=(room)=>{
    room=room.trim().toLowerCase()
    const in_room = users.filter(user => user.room === room);
    return in_room;
}

//testing starts

// adduser({
//     id:1,
//     username:'Aditi           ',
//     room:'city'
// })
// console.log(users)

// const res=adduser({
//     id:2,
//     username:'Aditi',
//     room:'city'
// })
// console.log(res)

// // const uu=removeuser(1)
// // console.log(uu)
// // console.log(users)
// // const gg=getuser(7)
// // console.log(gg)
// const cc=get_add_user('c')
// console.log(cc)

// //testing ends

module.exports={
    adduser,
    removeuser,
    getuser,
    get_add_user
}