const express = require("express");

const http = require("http");
const dbConnection = require("./configdb/configdb");
const socketIo = require("socket.io");
require('dotenv').config()
const challengeSessionRoutes = require("./routes/challengeSession.routes");
const interviewSessionRoutes = require("./routes/interviewSession.routes");
const projectRoutes = require("./routes/project.routes");
const cors = require("cors");
const app = express();

// database connection
dbConnection();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/challengesession", challengeSessionRoutes);
app.use("/api/interviewsession", interviewSessionRoutes);
app.use("/api/project", projectRoutes);


io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // here data is the data send during emiting
    socket.on("startChallenge", () => {
        io.emit("challengeStarted"); // Notifying all clients (interviewer)
    });
    socket.on("endChallenge", () => {
        io.emit("challengeEnded"); 
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


