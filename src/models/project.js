const mongoose = require("mongoose");

const  projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    skills: {
      type: Array,
    },
    projectUrl: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Project = mongoose.model("Project",  projectSchema);

module.exports = Project;
