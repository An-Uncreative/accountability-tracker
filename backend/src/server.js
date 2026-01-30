import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import walletRoutes from "./routes/wallets.js";
import monitorRoutes from "./routes/monitor.js";

dotenv.config();

// Validate required environment variables - API v3 uses new variable names
const requiredEnvVars = ["APP_TOKEN_SECRET", "MONGODB_URI", "API_ACCESS_KEY"];
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
  console.error("Required: APP_TOKEN_SECRET, MONGODB_URI, API_ACCESS_KEY");
  process.exit(1);
}

// Warn if using default/weak secret
if (
  process.env.APP_TOKEN_SECRET.includes("change_this") ||
  process.env.APP_TOKEN_SECRET.includes("your_super_secret") ||
  process.env.APP_TOKEN_SECRET.length < 32
) {
  console.warn(
    "⚠️  WARNING: Using weak APP_TOKEN_SECRET. Generate a strong random secret!",
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

// API Key validation middleware for v3
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: "API key required",
      message: "Include X-API-Key header with your request"
    });
  }
  
  if (apiKey !== process.env.API_ACCESS_KEY) {
    return res.status(403).json({ 
      error: "Invalid API key",
      message: "The provided API key is not valid"
    });
  }
  
  next();
};

// Routes - API v3 (requires API key)
app.use("/api/v3/auth", validateApiKey, authRoutes);
app.use("/api/v3/wallets", validateApiKey, walletRoutes);
app.use("/api/v3/monitor", validateApiKey, monitorRoutes);

// Health check route (requires API key)
app.get("/api/v3/health", validateApiKey, (req, res) => {
  res.json({
    status: "ok",
    database: "mongodb",
    version: "3.0",
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
  console.log(` Health check: http://localhost:${PORT}/api/v3/health`);
});

export default app;
