import cors from "cors";
import type { NextFunction, Request, Response, Application } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { toNodeHandler } from "better-auth/node";
import { errorMiddleware } from "./apps/middleware/error.middleware.js";
import { auth } from "./lib/auth.js";

import routes from "./routes/index.js";
import { AppError } from "./utils/AppError.js";

const app:Application = express();

// 1. Security & Optimization Middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 3. Auth Routes - PRIORITY 1: Custom Handlers
app.all("/api/auth/*splat", toNodeHandler(auth));

// 5. Rate Limiting
const limiter = rateLimit({
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again later!",
});
app.use("/api", limiter);

// 6. API Routes
app.use("/api/v1", routes);

app.get("/health", (_: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// 7. Error Handling
app.all("/{*splat}", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `Cannot find ${req.method} ${req.originalUrl} on this server!`,
      404,
    ),
  );
});

app.use(errorMiddleware);

export default app;