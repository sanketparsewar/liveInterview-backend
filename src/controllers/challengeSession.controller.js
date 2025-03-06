const ChallengeSession = require("../models/challengeSession");

// Endpoint to create a new challengeSession
exports.createChallengeSession = async (req, res) => {
  try {
    const { interviewSessionId, stackBlitzUrl, name } = req.body;
    if (!interviewSessionId || !stackBlitzUrl || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Modify the StackBlitz URL
    // const modifiedStackBlitzUrl = stackBlitzUrl.replace("edit", "fork");

    const newChallengeSession = new ChallengeSession({
      ...req.body,
      // stackBlitzUrl: modifiedStackBlitzUrl,import sdk from '@stackblitz/sdk';

    });

    await newChallengeSession.save();
    console.log(newChallengeSession)
    res.status(201).json(newChallengeSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(200).json({ challengeSessions });
  } catch (error) {
    res.status(404).json({ message: "No challengeSessions found" });
  }
};

// Endpoint to get a specific challengeSession by ID
exports.getChallengeSessionById = async (req, res) => {
  try {
    const challengeSession = await ChallengeSession.findById(req.params.id);

    if (!challengeSession) {
      return res.status(404).json({ message: "Challenge session not found" });
    }

    if (!challengeSession.isActive) {
      const filteredChallengeSession = await ChallengeSession.findById(req.params.id)
        .select("-stackBlitzUrl");
      return res.status(200).json(filteredChallengeSession);
    }

    if (!challengeSession) {
      return res.status(404).json({ message: "ChallengeSession not found" });
    }
    res.status(200).json(challengeSession);
  } catch (error) {
    res.status(404).json({ message: "No challengeSessions found" });
  }
};

exports.getChallengeSessionsByInterviewId = async (req, res) => {
  try {
    const challengeSessions = await ChallengeSession.find({
      interviewSessionId: req.params.id,
    });
    if (!challengeSessions) {
      return res.status(404).json({ message: "No challengeSessions found" });
    }
    res.status(200).json({ challengeSessions });
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

exports.startChallenge = async (req, res) => {
  try {
    const challengeSession = await ChallengeSession.findByIdAndUpdate(
      req.params.id,
      { isActive: true, challengeSessionStatus: "In-progress", startTime: Date.now() },
      { new: true }
    );

    if (!challengeSession) {
      return res
        .status(404)
        .json({ success: false, message: "ChallengeSession not found" });
    }

    res.status(200).json({
      success: true,
      message: "ChallengeSession started successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.updateChallengeSessionStatus = async (req, res) => {
  try {
    // const {stackBlitzUrl} = req.body
    const challengeSession = await ChallengeSession.findById(req.params.id);

    if (!challengeSession) {
      return res.status(404).json({ message: "Challenge session not found" });
    }

    const endTime = Date.now();
    // const totalTime = (endTime - challengeSession.startTime) / (1000 * 60); // Convert ms to seconds
    const totalMilliseconds = endTime - challengeSession.startTime;
    const totalMinutes = Math.floor(totalMilliseconds / (1000 * 60));
    const remainingSeconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);

    const formattedTime = `${totalMinutes}.${remainingSeconds}`;
    // console.log(formattedTime);


    const updatedSession = await ChallengeSession.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        challengeSessionStatus: "Completed",
        endTime: endTime,
        totalTime: formattedTime, // Store time in minutes
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "ChallengeSession updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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
