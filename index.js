const express = require("express")
const { createServer } = require("http")
const { Server } = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 3030;
// const multer = require('multer')


// create storage for files 
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./uploads")
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.originalname}`)
//     }
// })

// const uploads = multer({ storage })



const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
})

app.use(cors({
    origin: "*",
    methods : ["GET" , "POST" , "PUT" , "PATCH", "DELETE"],
    credentials: true
}))

io.on("connection", (Socket) => {
    console.log('user Connected with ID : ', Socket.id)

    Socket.broadcast.emit('user-join', `${Socket.id} - joined server...`)

// getting message from socket
Socket.on('message', (data) => {
    console.log(data)
    if (data.room === '') io.emit('recieved-message', data.message) // send this message to all users
    io.to(data.room).emit('recieved-message', data.message) // sends data to perticular room
})

Socket.on('room-name', (roomName) => {
Socket.join(roomName)  // Join the room
Socket.emit('joined-room', `Joined ${roomName}`);   // Send back that they joined room
})

    Socket.on('disconnect', (Socket) => {
        console.log(`user disconnected`)
    })
})



app.get("/", (req, res) => {
    res.status(200).send("hello")
})

// for upload multiple files 
// app.post("/files", uploads.array('fname', 5), (req, res) => {
//     console.log("hey")
//     try {
//         console.log("files : ", req.files)
//         io.emit('file', req.files)
//         res.status(200).json("file uploaded");
//     }
//     catch (error) {
//         res.status(400).json({ error: "Error" });
//     }
// })

server.listen(PORT, () => {
    console.log("server started")
})


// const express = require("express");
// const http = require("http");
// const { Server } = require('socket.io');
// const cors = require('cors');
// const dotenv = require('dotenv')
// dotenv.config()
// const PORT = process.env.PORT || 3030;

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//         credentials: true
//     }
// });

// app.use(cors());
// app.use(express.json());

// io.on("connection", (socket) => {
//     console.log('User connected with ID:', socket.id);

//     socket.broadcast.emit('user-join', `${socket.id} - joined server...`);

//     socket.on('message', (data) => {
//         console.log(data);
//         try {
//             if (data.room === '') {
//                 io.emit('received-message', data.message); // send this message to all users
//             } else {
//                 io.to(data.room).emit('received-message', data.message); // send data to particular room
//             }
//         } catch (error) {
//             console.error('Error sending message:', error.message);
//         }
//     });

//     socket.on('room-name', (roomName) => {
//         try {
//             socket.join(roomName); // Join the room
//             socket.emit('joined-room', `Joined ${roomName}`); // Send back that they joined room
//         } catch (error) {
//             console.error('Error joining room:', error.message);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// app.get("/", (req, res) => {
//     res.status(200).send("Hello");
// });

// server.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });
