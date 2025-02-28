const mongoose = require("mongoose");

const challengeSessionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    interviewSessionId: {
      type: String,
      required: true,
    },
    stackBlitzUrl: {
      type: String,
      required: true,
      unique: true,
    },
    challengeSessionStatus: {
      type: String,
      enum: ["In-progress", "Completed"],
      default: "In-progress",
    },
    score: {
      type: String,
      enum: ["Not Attempted", "Partial Solution", "Completed", "Outstanding"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ChallengeSession = mongoose.model("Session", challengeSessionSchema);

module.exports = ChallengeSession;
