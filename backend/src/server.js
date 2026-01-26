import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallets.js";
import monitorRoutes from "./routes/monitor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - API v2
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/wallets", walletRoutes);
app.use("/api/v2/monitor", monitorRoutes);

// Health check route
app.get("/api/v2/health", (req, res) => {
  res.json({
    status: "ok",
    database: "mongodb",
    version: "2.0",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("JSON Parse Error:", err.message);
    return res.status(400).json({
      error: "Invalid JSON format",
      details: err.message,
    });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

export default app;
