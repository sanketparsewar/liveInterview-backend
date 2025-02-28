const express = require("express");
const router = express.Router();
const {
  createChallengeSession,
  getAllChallengeSessions,
  getChallengeSessionById,
  updateChallengeSessionStatus,
  updateChallengeSessionById,
  deleteChallengeSessionById,
} = require("../controllers/challengeSession.controller");

router.post("/", createChallengeSession);
router.get("/", getAllChallengeSessions);
router.get("/:id", getChallengeSessionById);
router.put("/sessionstatus/:id", updateChallengeSessionStatus);
router.put("/:id", updateChallengeSessionById);
router.delete("/:id", deleteChallengeSessionById);

module.exports = router;
