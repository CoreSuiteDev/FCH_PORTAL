import dotenv from "dotenv";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs";

// Load .env from current directory or project root
if (fs.existsSync(path.join(process.cwd(), ".env"))) {
  dotenv.config({ path: path.join(process.cwd(), ".env") });
} else if (fs.existsSync(path.join(process.cwd(), "../../.env"))) {
  dotenv.config({ path: path.join(process.cwd(), "../../.env") });
} else {
  dotenv.config();
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default(3000),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().transform(Number).default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // Scheduler
  SCHEDULER_ENABLED: z
    .string()
    .default("true")
    .transform((val) => val !== "false"),
  SCHEDULER_TIMEZONE: z.string().default("UTC"),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  // AWS S3
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Socket.IO
  SOCKET_CORS_ORIGIN: z.string().optional(),

  // Frontend & Portal URLs
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  PORTAL_URL: z.string().default("http://localhost:3001"),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  TRUSTED_ORIGINS: z.string().optional(),

  // OAuth Credentials
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  GITHUB_CLIENT_ID: z.string().optional().default(""),
  GITHUB_CLIENT_SECRET: z.string().optional().default(""),

  // Email
  EMAIL_HOST: z.string().default("smtp.gmail.com"),
  EMAIL_PORT: z.string().transform(Number).default(587),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_USE_SES: z
    .string()
    .transform((val) => val === "true")
    .default(false),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default(1000),

  // CORS
  CORS_ORIGIN: z.string().default("*"),

  // Logging
  LOG_FORMAT: z.string().default("dev"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
});

const env = envSchema.parse(process.env);

const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  logFormat: env.LOG_FORMAT,

  database: {
    url: env.DATABASE_URL,
  },

  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  },

  scheduler: {
    enabled: env.SCHEDULER_ENABLED,
    timezone: env.SCHEDULER_TIMEZONE,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  betterAuth: {
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL,
    trustedOrigins: env.TRUSTED_ORIGINS ? env.TRUSTED_ORIGINS.split(",") : [],
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  aws: {
    region: env.AWS_REGION,
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: env.AWS_S3_BUCKET,
  },

  frontendUrl: env.FRONTEND_URL,
  portalUrl: env.PORTAL_URL,

  email: {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
    from: env.EMAIL_FROM || env.EMAIL_USER || "noreply@example.com",
    useSes: env.EMAIL_USE_SES,
  },

  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },

  cors: {
    origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] as const,
  },

  socket: {
    corsOrigin: env.SOCKET_CORS_ORIGIN || env.CORS_ORIGIN,
  },

  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },
} as const;

export default config;