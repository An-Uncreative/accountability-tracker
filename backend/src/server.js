import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallets.js";
import monitorRoutes from "./routes/monitor.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["AUTH_SECRET_KEY", "MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingEnvVars.join(", "),
  );
  console.error(
    "Please check your .env file or deployment environment variables.",
  );
  process.exit(1);
}

// Warn if using default/weak secret
if (
  process.env.AUTH_SECRET_KEY.includes("change_this") ||
  process.env.AUTH_SECRET_KEY.includes("your_super_secret") ||
  process.env.AUTH_SECRET_KEY.length < 32
) {
  console.warn(
    "⚠️  WARNING: Using weak AUTH_SECRET_KEY. Generate a strong random secret!",
  );
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Cannot start in production with weak secret key.");
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions =
  isProduction && process.env.FRONTEND_URL
    ? {
        origin: process.env.FRONTEND_URL.split(","),
        credentials: true,
      }
    : {}; // Allow all origins in development

app.use(cors(corsOptions));
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

app.listen(PORT, "0.0.0.0", () => {
  const mode = isProduction ? "production" : "development";
  console.log(` Server running on port ${PORT} (${mode} mode)`);
  console.log(` Health check: http://localhost:${PORT}/api/v2/health`);
});

export default app;
