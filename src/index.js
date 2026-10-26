require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const dbConnection = require("./configdb/configdb");
const authRoutes = require("./routes/auth.routes");
const challengeSessionRoutes = require("./routes/challengeSession.routes");
const interviewSessionRoutes = require("./routes/interviewSession.routes");
const projectRoutes = require("./routes/project.routes");
const reportRoutes = require("./routes/report.routes");
const createSocketServer = require("./utilSockets");

const app = express();

// database connection
dbConnection();

// Middleware to parse JSON request bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Middleware to enable CORS
app.use(cors());

// routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/challengesession", challengeSessionRoutes);
app.use("/api/interviewsession", interviewSessionRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/report", reportRoutes);

const server = http.createServer(app);
const io = createSocketServer(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


