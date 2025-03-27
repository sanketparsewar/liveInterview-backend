const express = require("express");

const http = require("http");
const dbConnection = require("./configdb/configdb");
const socketIo = require("socket.io");
require('dotenv').config()
const challengeSessionRoutes = require("./routes/challengeSession.routes");
const interviewSessionRoutes = require("./routes/interviewSession.routes");
const projectRoutes = require("./routes/project.routes");
const reportRoutes = require("./routes/report.routes");
const createSocketServer=require('./utilSockets')
const cors = require("cors");
const app = express();

const challengeRooms = {};

// database connection
dbConnection();

// Middleware to parse JSON request bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware to enable CORS
app.use(cors());

// routes
app.use("/api/challengesession", challengeSessionRoutes);
app.use("/api/interviewsession", interviewSessionRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/report", reportRoutes);


const server = http.createServer(app);
const io = createSocketServer(server);


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});


