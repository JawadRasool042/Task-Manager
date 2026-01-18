const TaskModel = require("../models/taskmodel");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  const data = req.body;
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection not available",
        success: false,
        error: "Database is not connected. Please check DB_URL environment variable in Vercel settings.",
      });
    }
    const model = new TaskModel(data);
    await model.save();
    res
      .status(201)
      .json({ message: "Task created successfully", success: true });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create a task",
      success: false,
      error: err.message,
    });
  }
};

const fetchAllTasks = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection not available",
        success: false,
        error: "Database is not connected. Please check DB_URL environment variable in Vercel settings.",
      });
    }
    const data = await TaskModel.find({});
    res.status(200).json({ message: "All tasks", success: true, data });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get tasks",
      success: false,
      error: err.message,
    });
  }
};

const updateTaskByID = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection not available",
        success: false,
        error: "Database is not connected. Please check DB_URL environment variable in Vercel settings.",
      });
    }
    const id = req.params.id;
    const body = req.body;
    const obj = { $set: { ...body } };
    const updatedTask = await TaskModel.findByIdAndUpdate(id, obj, { new: true });
    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }
    res.status(200).json({ message: "Task Updated", success: true });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update a task",
      success: false,
      error: err.message,
    });
  }
};

const DeleteTaskByID = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection not available",
        success: false,
        error: "Database is not connected. Please check DB_URL environment variable in Vercel settings.",
      });
    }
    const id = req.params.id;
    const deletedTask = await TaskModel.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }
    res.status(200).json({ message: "Task Deleted", success: true });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete a task",
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  createTask,
  fetchAllTasks,
  updateTaskByID,
  DeleteTaskByID,
};
