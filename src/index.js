const express = require("express");

const http = require("http");
const dbConnection = require("./configdb/configdb");
const socketIo = require("socket.io");
require('dotenv').config()
const challengeSessionRoutes = require("./routes/challengeSession.routes");
const interviewSessionRoutes = require("./routes/interviewSession.routes");
const projectRoutes = require("./routes/project.routes");
const reportRoutes = require("./routes/report.routes");
const cors = require("cors");
const app = express();

// database connection
dbConnection();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] ,  allowedHeaders: ['Content-Type', 'Authorization']}
});

// Middleware to parse JSON request bodies
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// routes
app.use("/api/challengesession", challengeSessionRoutes);
app.use("/api/interviewsession", interviewSessionRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/report", reportRoutes);


io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);

    // here data is the data send during emiting
    socket.on("startChallenge", () => {
        io.emit("challengeStarted"); // Notifying all clients (interviewer)
    });
    socket.on("endChallenge", () => {
        io.emit("challengeEnded"); 
    });
    socket.on("saveCode", () => {
        io.emit("codeSaved"); 
    });
    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);
    });

    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
    });
});


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


