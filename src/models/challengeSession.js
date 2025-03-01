const mongoose = require("mongoose");

const challengeSessionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    interviewSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
    },
    stackBlitzUrl: {
      type: String,
      required: true,
      unique: true,
    },
    challengeSessionStatus: {
      type: String,
      enum: ["In-progress", "Completed"]
    },
    score: {
      type: String,
      enum: ["Not Attempted", "Partial Solution", "Completed", "Outstanding"],
    },
    isActive: {
      type: Boolean,
    },
    startTime: {
      type: Date,
      default: null,
    },
    endTime: {
      type: Date,
      default: null,
    },
    totalTime:{
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);

const ChallengeSession = mongoose.model("ChallengeSession", challengeSessionSchema);

module.exports = ChallengeSession;
