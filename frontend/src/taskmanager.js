import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  FaSun,
  FaMoon,
  FaSearch,
  FaPlus,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/tasks";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFinished, setShowFinished] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const saved = localStorage.getItem("darkMode");
      if (saved === null) {
        setIsDarkMode(e.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setTasks(result.data || []);
      } else {
        toast.error(result.message || "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(
        `Failed to fetch tasks: ${error.message}. Please check if the backend server is running at ${API_URL}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) {
      toast.warning("Please enter a task name");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: taskName.trim(),
          isDone: false,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Task created successfully!");
        setTaskName("");
        fetchTasks();
      } else {
        toast.error(result.message || "Failed to create task");
      }
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleToggleTask = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    if (newStatus && !showFinished) {
      setShowFinished(true);
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, isDone: newStatus } : task
      )
    );

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDone: newStatus,
        }),
      });

      const result = await response.json();
      if (result.success) {
      } else {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, isDone: currentStatus } : task
          )
        );
        toast.error(result.message || "Failed to update task");
      }
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, isDone: currentStatus } : task
        )
      );
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    const taskToDelete = tasks.find((task) => task._id === id);

    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Task deleted successfully!");
      } else {
        if (taskToDelete) {
          setTasks((prevTasks) => [...prevTasks, taskToDelete]);
        }
        toast.error(result.message || "Failed to delete task");
      }
    } catch (error) {
      if (taskToDelete) {
        setTasks((prevTasks) => [...prevTasks, taskToDelete]);
      }
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.taskName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = showFinished || !task.isDone;
    return matchesSearch && matchesFilter;
  });

  const pendingTasks = tasks.filter((task) => !task.isDone).length;
  const completedTasks = tasks.filter((task) => task.isDone).length;

  return (
    <div className="task-manager-container">
      <div className="task-manager-wrapper">
        <div className="header">
          <h1 className="app-title">
            <span className="title-icon">✓</span>
            Task Manager
          </h1>
          <button
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{pendingTasks}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <form onSubmit={handleCreateTask} className="add-task-form">
          <div className="input-group">
            <input
              type="text"
              className="task-input"
              placeholder="Add a new task..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <button type="submit" className="add-button">
              <FaPlus />
              Add Task
            </button>
          </div>
        </form>

        <div className="controls-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className={`filter-button ${showFinished ? "active" : ""}`}
            onClick={() => setShowFinished(!showFinished)}
          >
            {showFinished ? "Hide" : "Show"} Finished Tasks
          </button>
        </div>

        <div className="tasks-container">
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-text">
                {searchQuery
                  ? "No tasks match your search"
                  : showFinished
                  ? "No tasks yet. Add one above!"
                  : "No pending tasks"}
              </p>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-item ${task.isDone ? "completed" : ""}`}
                >
                  <div className="task-content">
                    <button
                      className={`task-checkbox ${
                        task.isDone ? "checked" : ""
                      }`}
                      onClick={() => handleToggleTask(task._id, task.isDone)}
                      aria-label={
                        task.isDone ? "Mark as pending" : "Mark as completed"
                      }
                    >
                      {task.isDone && <FaCheck />}
                    </button>
                    <span className="task-name">{task.taskName}</span>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTask(task._id)}
                    aria-label="Delete task"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default TaskManager;
