const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const main = require("./config/db");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const contestRouter = require('./routes/contest');
const aiChatRouter = require('./routes/aiChat')
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./utils/socketUtils');

const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://code-drilin-git-main-swapnils-projects-99b5228d.vercel.app',
  https://code-drilin-a50ihxw93-swapnils-projects-99b5228d.vercel.app/signup
];
const io = initSocket(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});


app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());



io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_contest_room', (contestId) => {
        const roomName = `contest_${contestId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});



app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/contest', contestRouter);
app.use('/ai', aiChatRouter)

main()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server with Socket.IO listening at PORT: ${PORT}`);
        });
    })
    .catch(err => console.log("Error connecting to DB: " + err));
