const Project = require("../models/project");

// Endpoint to create a newproject
exports.createProject = async (req, res) => {
  try {
    const { title, skills, projectUrl } = req.body;
    if (!title || !skills || !projectUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json({ newProject });
  } catch (error) {
    res.status(500).json({ message: "Error saving project" });
  }
};

// Endpoint to get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (!projects) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.status(200).json( projects);
  } catch (error) {
    res.status(404).json({ message: "No projects found" });
  }
};

// Endpoint to get a specific project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    res.status(404).json({ message: "No projects found" });
  }
};

// Endpoint to update a specific project by ID
exports.updateProjectById = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Endpoint to delete a specific project by ID
exports.deleteProjectById = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
