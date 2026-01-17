const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("DB_URL environment variable is not set!");
}

// For serverless functions (Vercel), reuse existing connection if available
if (mongoose.connection.readyState === 0 && DB_URL) {
  mongoose
    .connect(DB_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      // Don't throw - let the app continue, but operations will fail gracefully
    });
} else if (mongoose.connection.readyState !== 0) {
  console.log("MongoDB connection already established");
}
