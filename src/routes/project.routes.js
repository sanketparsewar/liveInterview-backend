const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectById,
  deleteProjectById,
} = require("../controllers/project.controller");

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProjectById);
router.delete("/:id", deleteProjectById);

module.exports = router;
