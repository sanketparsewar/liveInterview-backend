const express = require("express");
const router = express.Router();
const {
  createInterviewSession,
  getAllInterviewSessions,
  getInterviewSessionById,
  updateInterviewSessionStatus,
  updateInterviewSessionById,
  deleteInterviewSessionById,
} = require("../controllers/interviewSession.controller");

router.post("/", createInterviewSession);
router.get("/", getAllInterviewSessions);
router.get("/:id", getInterviewSessionById);
router.put("/sessionstatus/:id", updateInterviewSessionStatus);
router.put("/:id", updateInterviewSessionById);
router.delete("/:id", deleteInterviewSessionById);

module.exports = router;
