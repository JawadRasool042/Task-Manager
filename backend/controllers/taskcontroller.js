const TaskModel = require("../models/taskmodel");

const createTask = async (req, res) => {
  const data = req.body;
  try {
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
    const data = await TaskModel.find({});
    res.status(200).json({ message: "All tasks", success: true, data });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get a task",
      success: false,
      error: err.message,
    });
  }
};

const updateTaskByID = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const obj = { $set: { ...body } };
    await TaskModel.findByIdAndUpdate(id, obj);
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
    const id = req.params.id;
    await TaskModel.findByIdAndDelete(id);
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
