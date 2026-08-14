
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/auth");
const authenticateToken = require("./middleware/auth");
const eventRoutes = require("./routes/events");
const rsvpRoutes = require("./routes/rsvps");
const app = express();

const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "You have access to the protected route",
    user: req.user,
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Local Meetup RSVP Tracker API is running",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    res.json({
      message: "Database connection successful",
      result: rows[0].result,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})