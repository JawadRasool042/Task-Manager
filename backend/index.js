const express = require("express");
const app = express();
require("dotenv").config();
require("./models/db");
const PORT = process.env.PORT || 8080;
const TaskRouter = require("./routes/taskrouter");
const bodyParser = require("body-parser");
const cors = require("cors");

//nodemon for auto restart server on changes edit package.json scripts

// Enable CORS for frontend
app.use(cors());

// Middleware must be applied before routes to parse JSON request bodies
app.use(bodyParser.json());

app.use("/api/tasks", TaskRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Task Manager API is running",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// Health check for /api route
app.get("/api", (req, res) => {
  res.json({ 
    message: "Task Manager API is running",
    status: "ok",
    timestamp: new Date().toISOString(),
    endpoints: {
      tasks: "/api/tasks"
    }
  });
});

// Export the app for Vercel serverless functions
module.exports = app;

// Only listen on PORT if running locally (not in Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
