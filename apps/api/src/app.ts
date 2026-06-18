import cors from "cors";
import type { NextFunction, Request, Response, Application } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import * as trpcExpress from '@trpc/server/adapters/express';
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from 'trpc-to-openapi';

import { toNodeHandler } from "better-auth/node";
import { errorMiddleware } from "./apps/middleware/error.middleware.js";
import { auth } from "./lib/auth.js";
import { writeFileSync } from "fs";
import { AppError } from "./utils/AppError.js";
import { appRouter } from "./server/index.js";
import { createContext } from "./server/context.js";
import config from "./utils/config.js";

const app:Application = express();


app.use(express.json());
app.use(helmet());

const openapiDocument = generateOpenApiDocument(appRouter, {
  baseUrl: 'http://localhost:5000/api/v1',
  title: 'FCH API',
  version: '1.0.0'
})

writeFileSync("./openapi-fch.json", JSON.stringify(openapiDocument, null, 2))


app.use(
  cors({
    origin: config.cors.origin,
    methods: config.cors.methods as any,
    credentials: config.cors.credentials,
  }),
);

// Logging
app.use(morgan(config.logFormat));

// 3. Auth Routes - PRIORITY 1: Custom Handlers
app.all("/api/auth/*splat", toNodeHandler(auth));

// 5. Rate Limiting
const limiter = rateLimit({
  max: config.rateLimit.maxRequests,
  windowMs: config.rateLimit.windowMs,
  message: "Too many requests from this IP, please try again later!",
});
app.use("/api", limiter);

// 6. API Routes
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(
  "/api/v1",
  createOpenApiExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

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