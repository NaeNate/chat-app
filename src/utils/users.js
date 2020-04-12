const users = []

const addUser = ({ id, username, room }) => {
    //Clean Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // check duplicates
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate user

    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //store user

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
      return users.splice(index, 1)[0]  
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getRoomUsers = (room) => {
    return users.filter((user) => user.room === room)
}

const hadDuplicates = (arr) => {
    return new Set(arr).size !== arr.length
}

const getRooms = () => {
    const rooms = []
    users.forEach((user) => {
        rooms.push(user.room)
        if (hadDuplicates(rooms)) {
            rooms.pop()
            return rooms
        } else {
            return rooms
        }
    })
    return rooms
}

module.exports = {
    addUser,
    removeUser,
    getRoomUsers,
    getUser,
    getRooms
}