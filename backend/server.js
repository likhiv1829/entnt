const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes"); // Import authentication routes
const companyRoutes = require("./routes/companyRoutes"); // Import company routes

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable cross-origin requests

// Use authentication and company routes
authRoutes(app); // Authentication routes
app.use("/api", companyRoutes); // Company routes

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => console.log(err));

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
