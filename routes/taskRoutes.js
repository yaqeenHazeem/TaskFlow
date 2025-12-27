const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const router = express.Router();

// Create Task
router.post("/", auth, async (req, res) => {
  try {
    const { projectId, title } = req.body;
    
    const project = await Project.findOne({ _id: projectId, userId: req.user.id });
    if (!project) return res.status(400).json({ message: "Project not found" });

    const task = new Task({ title, projectId });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Tasks by Project
router.get("/:projectId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findOne({ _id: task.projectId, userId: req.user.id });
    if (!project) return res.status(401).json({ message: "Unauthorized" });

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findOne({ _id: task.projectId, userId: req.user.id });
    if (!project) return res.status(401).json({ message: "Unauthorized" });

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
