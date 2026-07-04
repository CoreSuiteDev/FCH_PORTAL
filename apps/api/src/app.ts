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
import { prisma } from "./infrastructure/database/prisma.js";
import { writeFileSync } from "fs";
import { AppError } from "./utils/AppError.js";
import { appRouter } from "./server/index.js";
import { createContext } from "./server/context.js";
import sendMail from "./infrastructure/email/email.js";
import config from "./utils/config.js";
import { PaymentController } from "./apps/modules/payment/payment.controller.js";

const app:Application = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: config.cors.origin,
    methods: config.cors.methods as any,
    credentials: config.cors.credentials,
  }),
);

// Mount Better Auth handler BEFORE body-parser (express.json)
app.get("/api/auth/session-info", async (req, res): Promise<any> => {
  try {
    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v))
        } else {
          headers.set(key, value as string)
        }
      }
    }

    const session = await auth.api.getSession({ headers })
    if (!session) {
      console.log("[session-info] No session found in request headers")
      return res.status(200).json({ authenticated: false, roles: [] })
    }

    const userWithRoles = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    })

    const roles = userWithRoles?.userRoles.map((ur) => ur.role.name) || []
    console.log("[session-info] Found session for user:", session.user.email, "with roles:", roles)

    return res.status(200).json({
      authenticated: true,
      user: {
        ...session.user,
        roles,
      },
    })
  } catch (error: any) {
    console.error("[Session-Info Endpoint] Error:", error)
    return res.status(500).json({ error: error.message || "Failed to fetch session info" })
  }
})

app.all("/api/auth/*", toNodeHandler(auth));


app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  PaymentController.handleWebhook,
);

// Body parsing and security middleware (applied to subsequent routes)
app.use(express.json());
app.use(helmet());

const openapiDocument = generateOpenApiDocument(appRouter, {
  baseUrl: 'http://localhost:5000/api/v1',
  title: 'FCH API',
  version: '1.0.0'
})

writeFileSync("./openapi-fch.json", JSON.stringify(openapiDocument, null, 2))

// Logging
app.use(morgan(config.logFormat));

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

app.post("/test-email", async (req: Request, res: Response): Promise<void> => {
  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) {
      res.status(400).json({ error: "Missing to, subject, or text in request body" });
      return;
    }
    const result = await sendMail(to, subject, text);
    res.status(200).json({ success: true, message: "Email sent successfully", result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || error });
  }
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