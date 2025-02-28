const express = require("express");
const dbConnection = require("./configdb/configdb");
const challengeSessionRoutes = require("./routes/challengeSession.routes");
const interviewSessionRoutes = require("./routes/interviewSession.routes");
const projectRoutes = require("./routes/project.routes");

const app = express();

// database connection
dbConnection();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/challengesession", challengeSessionRoutes);
app.use("/api/interviewsession", interviewSessionRoutes);
app.use("/api/project", projectRoutes);

module.exports = app;
