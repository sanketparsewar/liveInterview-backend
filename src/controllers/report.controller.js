const ChallengeSession = require("../models/challengeSession");
const InterviewSession = require("../models/interviewSession");
const Project = require("../models/project");

exports.getAllReports = async (req, res) => {
    try {
        let { sortBy = "newest", search } = req.query;

        // Fetch reports with inactive interview sessions
        const reports = await ChallengeSession.find()
            .populate({
                path: "interviewSessionId",
                match: { isActive: false }, // Only fetch inactive interviews
                select: "candidateName isActive createdAt"
            })
            .select("-projectSnapshot -__v -stackBlitzUrl");

        // Filter out records where interviewSessionId is missing (i.e., was not populated)
        let filteredReports = reports.filter(report => report.interviewSessionId);

        // **Apply search after fetching data**
        if (search) {
            filteredReports = filteredReports.filter(report =>
                report.interviewSessionId.candidateName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Group challenges by candidate name with isActive & createdAt
        const groupedReports = new Map();

        filteredReports.forEach(report => {
            const { candidateName, isActive, createdAt } = report.interviewSessionId;

            if (!groupedReports.has(candidateName)) {
                groupedReports.set(candidateName, {
                    candidateName,
                    isActive,
                    createdAt,
                    challenges: []
                });
            }

            groupedReports.get(candidateName).challenges.push(report);
        });

        // Convert Map to an array
        let result = Array.from(groupedReports.values());

        // **Apply Sorting**
        if (sortBy === "newest") {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
        } else if (sortBy === "oldest") {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first
        } else if (sortBy === "asc") {
            result.sort((a, b) => a.candidateName.localeCompare(b.candidateName)); // A to Z
        } else if (sortBy === "desc") {
            result.sort((a, b) => b.candidateName.localeCompare(a.candidateName)); // Z to A
        }

        const totalInterviewSessions = await InterviewSession.countDocuments(); // Count only inactive interviews
        const totalActiveInterviewSessions = await InterviewSession.countDocuments({ isActive: true }); // Count only inactive interviews
        const totalProjects = await Project.countDocuments();
        const totalChallengeSessions = await ChallengeSession.countDocuments();

        res.status(200).json({ result, totalInterviewSessions, totalActiveInterviewSessions, totalProjects, totalChallengeSessions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

