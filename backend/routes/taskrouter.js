const {
  createTask,
  fetchAllTasks,
  updateTaskByID,
  DeleteTaskByID,
} = require("../controllers/taskcontroller");

const router = require("express").Router();

//to get all tasks
router.get("/", fetchAllTasks);

//to create a task
router.post("/", createTask);

//to update a task
router.put("/:id", updateTaskByID);

//to delete a task
router.delete("/:id", DeleteTaskByID);

module.exports = router;
