import "dotenv/config"
import app from "./app.js"
import config from "./utils/config.js"
import logger from "./utils/logger.js"

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...")
  logger.error(err)
  process.exit(1)
})

const PORT = config.port

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.nodeEnv} mode`)
})

// Handle unhandled rejections
process.on("unhandledRejection", (err: any) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...")
  logger.error(err)
  server.close(() => {
    process.exit(1)
  })
})

// Graceful shutdown for SIGTERM
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully")
  server.close(() => {
    logger.info("💥 Process terminated!")
  })
})
