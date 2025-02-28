const ChallengeSession = require("../models/challengeSession");

// Endpoint to create a new challengeSession
exports.createChallengeSession = async (req, res) => {
  try {
    const { interviewSessionId, stackBlitzUrl, name } = req.body;
    if (!interviewSessionId || !stackBlitzUrl || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newChallengeSession = new ChallengeSession(req.body);
    await newChallengeSession.save();
    res.status(201).json( newChallengeSession );
  } catch (error) {
    res.status(500).json({ message: "Error saving challengeSession" });
  }
};

// Endpoint to get all challengeSessions
exports.getAllChallengeSessions = async (req, res) => {
  try {
    const challengeSessions = await ChallengeSession.find().populate(
      "interviewSessionId"
    );
    if (!challengeSessions) {
      return res.status(404).json({ message: "No challengeSessions found" });
    }
    console.log(challengeSessions);
    res.status(200).json({ challengeSessions });
  } catch (error) {
    res.status(404).json({ message: "No challengeSessions found" });
  }
};

// Endpoint to get a specific challengeSession by ID
exports.getChallengeSessionById = async (req, res) => {
  try {
    const challengeSession = await ChallengeSession.findById(
      req.params.id
    ).populate("interviewSessionId");
    if (!challengeSession) {
      return res.status(404).json({ message: "ChallengeSession not found" });
    }
    res.status(200).json({ challengeSession });
  } catch (error) {
    res.status(404).json({ message: "No challengeSessions found" });
  }
};

// Endpoint to update a specific challengeSession by ID
exports.updateChallengeSessionById = async (req, res) => {
  try {
    const updatedChallengeSession = await ChallengeSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedChallengeSession) {
      return res.status(404).json({ message: "ChallengeSession not found" });
    }
    res.status(200).json({ challengeSession: updatedChallengeSession });
  } catch (error) {
    res.status(500).json({ message: "Error: " + error.message });
  }
};

exports.updateChallengeSessionStatus = async (req, res) => {
  try {
    // const { isActive, challengeSessionStatus } = req.body;

    const challengeSession = await ChallengeSession.findByIdAndUpdate(
      req.params.id,
      { isActive: false, challengeSessionStatus: "Completed" },
      { new: true }
    );

    if (!challengeSession) {
      return res
        .status(404)
        .json({ success: false, message: "ChallengeSession not found" });
    }

    res.status(200).json({
      success: true,
      message: "ChallengeSession updated successfully",
      challengeSession,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating challengeSession",
        error,
      });
  }
};

// Endpoint to delete a specific challengeSession by ID
exports.deleteChallengeSessionById = async (req, res) => {
  try {
    const deletedChallengeSession = await ChallengeSession.findByIdAndDelete(
      req.params.id
    );
    if (!deletedChallengeSession) {
      return res.status(404).json({ message: "ChallengeSession not found" });
    }
    res.status(200).json({ message: "ChallengeSession deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
