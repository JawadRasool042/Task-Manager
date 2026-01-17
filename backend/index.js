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

app.use("/tasks", TaskRouter);

//testing server
app.get("/", (req, res) => {
  res.send("Hello from server");
});

// Export the app for Vercel serverless functions
module.exports = app;

// Only listen on PORT if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
