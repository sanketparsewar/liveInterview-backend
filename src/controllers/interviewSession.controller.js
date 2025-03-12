const ChallengeSession = require("../models/challengeSession");
const InterviewSession = require("../models/interviewSession");

exports.createInterviewSession = async (req, res) => {
  try {
    const { interviewer,organization, candidateName } = req.body;
    if (!interviewer | !organization | !candidateName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingInterviewSession = await InterviewSession.findOne({
      candidateName: { $regex: `^${candidateName}$`, $options: "i" },
    });
    if (existingInterviewSession) {
      return res
        .status(400)
        .json({ message: "Interview session already exists" });
    }
    const newInterviewSession = new InterviewSession(req.body);

    await newInterviewSession.save();
    res.status(201).json({ newInterviewSession });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllInterviewSessions = async (req, res) => {
  try {
    let { interviewer, sortBy = "newest", search, limit, page } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    let skip = (page - 1) * limit;


    let filter = {};
    if (interviewer) {
      filter.interviewer = interviewer;
    }

    if (search) {
      filter.$or = [
        { candidateName: { $regex: search, $options: "i" } },
      ];
    }

    let sorting = {};

    // Handle sorting based on selected option
    if (sortBy) {
      if (sortBy === "newest") {
        sorting["createdAt"] = -1; // Newest first
      } else if (sortBy === "oldest") {
        sorting["createdAt"] = 1; // Oldest first
      } else if (sortBy === "asc") {
        sorting["candidateName"] = 1; // A to Z
      } else if (sortBy === "desc") {
        sorting["candidateName"] = -1; // Z to A
      }
    }

    let interviewSessions = await InterviewSession.find(filter)
      .sort(sorting).limit(limit)
      .skip(skip);


    if (interviewSessions.length === 0 && page > 1) {
      page = page - 1
      skip = (page - 1) * limit;
      interviewSessions = await InterviewSession.find(filter)
        .sort(sorting)
        .limit(limit)
        .skip(skip);
    }

    const totalInterviewSessions = await InterviewSession.countDocuments(filter); 

    res.status(200).json({
      interviewSessions, totalInterviewSessions,
      totalPages: Math.ceil(totalInterviewSessions / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(404).json({ message: "No interviewSessions found" });
  }
};

exports.getInterviewSessionById = async (req, res) => {
  try {
    const interviewSession = await InterviewSession.findById(req.params.id);
    if (!interviewSession) {
      return res.status(404).json({ message: "InterviewSession not found" });
    }
    res.status(200).json(interviewSession);
  } catch (error) {
    res.status(404).json({ message: "No interviewSessions found" });
  }
};

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
    res.status(500).json({ message:error.message });
  }
};

exports.updateInterviewSessionStatus = async (req, res) => {
  try {
    const interviewSession = await InterviewSession.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
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
    res.status(500).json({
      success: false,
      message: "Error updating interviewSession",
      error,
    });
  }
};

exports.deleteInterviewSessionById = async (req, res) => {
  try {
    const deletedInterviewSession = await InterviewSession.findByIdAndDelete(
      req.params.id
    );

    if (!deletedInterviewSession) {
      return res.status(404).json({ message: "InterviewSession not found" });
    }
    await ChallengeSession.deleteMany({ interviewSessionId: req.params.id });

    res.status(200).json({ message: "InterviewSession deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
