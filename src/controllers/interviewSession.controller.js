const InterviewSession = require("../models/interviewSession");

// Endpoint to create a new interviewSession
exports.createInterviewSession = async (req, res) => {
  try {
    const { candidateName } = req.body;
    if (!candidateName ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newInterviewSession = new InterviewSession(req.body);
    await newInterviewSession.save();
    res.status(201).json({ newInterviewSession });
  } catch (error) {
    res.status(500).json({ message: "Error saving interviewSession" });
  }
};

// Endpoint to get all interviewSessions
exports.getAllInterviewSessions = async (req, res) => {
  try {
    const interviewSessions = await InterviewSession.find();
    if (!interviewSessions) {
      return res.status(404).json({ message: "No interviewSessions found" });
    }
    console.log(interviewSessions);
    res.status(200).json({ interviewSessions });
  } catch (error) {
    res.status(404).json({ message: "No interviewSessions found" });
  }
};

// Endpoint to get a specific interviewSession by ID
exports.getInterviewSessionById = async (req, res) => {
  try {
    const interviewSession = await InterviewSession.findById(req.params.id);
    if (!interviewSession) {
      return res.status(404).json({ message: "InterviewSession not found" });
    }
    res.status(200).json({ interviewSession });
  } catch (error) {
    res.status(404).json({ message: "No interviewSessions found" });
  }
};

// Endpoint to update a specific interviewSession by ID
exports.updateInterviewSessionById = async (req, res) => {
  try {
    const updatedInterviewSession = await InterviewSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInterviewSession) {
      return res.status(404).json({ message: "InterviewSession not found" });
    }
    res.status(200).json({ interviewSession: updatedInterviewSession });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
};

exports.updateInterviewSessionStatus = async (req, res) => {
  try {

    const interviewSession = await InterviewSession.findByIdAndUpdate(
      req.params.id,
      { isActive: false},
      { new: true }
    );

    if (!interviewSession) {
      return res
        .status(404)
        .json({ success: false, message: "InterviewSession not found" });
    }

    res.status(200).json({
      success: true,
      message: "InterviewSession updated successfully",
      interviewSession,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating interviewSession", error });
  }
};

// Endpoint to delete a specific interviewSession by ID
exports.deleteInterviewSessionById = async (req, res) => {
  try {
    const deletedInterviewSession = await InterviewSession.findByIdAndDelete(req.params.id);
    if (!deletedInterviewSession) {
      return res.status(404).json({ message: "InterviewSession not found" });
    }
    res.status(200).json({ message: "InterviewSession deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
