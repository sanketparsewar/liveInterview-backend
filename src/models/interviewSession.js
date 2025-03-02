const mongoose = require("mongoose");

const interviewSessionSchem = mongoose.Schema(
  {
    interviewerName: {
      type: String,
    },
    candidateName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewSession = mongoose.model(
  "InterviewSession",
  interviewSessionSchem
);

module.exports = InterviewSession;
