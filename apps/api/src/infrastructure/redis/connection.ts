import Redis from "ioredis";
import config from "../../utils/config.js";
import logger from "../../utils/logger.js";

// We set maxRetriesPerRequest to null as required by BullMQ
const redisOptions = process.env.REDIS_URL
  ? { maxRetriesPerRequest: null }
  : {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password || undefined,
      maxRetriesPerRequest: null,
    };

export const redisConnection = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, redisOptions)
  : new Redis(redisOptions);

redisConnection.on("connect", () => {
  logger.info("🔌 Redis connection initiated...");
});

redisConnection.on("ready", () => {
  logger.info("✅ Redis connected successfully and ready!");
});

redisConnection.on("error", (err: any) => {
  logger.error("❌ Redis connection error:", err);
});

redisConnection.on("close", () => {
  logger.warn("🔌 Redis connection closed");
});
