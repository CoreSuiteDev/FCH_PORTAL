import type { NextFunction, Request, Response } from "express"
import { AppError } from "../../utils/AppError.js"
import config from "../../utils/config.js"
import logger from "../../utils/logger.js"

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500
  const status = err.status || "error"

  // ALWAYS log the error to console in development to see what's failing
  if (config.nodeEnv === "development") {
    console.error("DEBUG ERROR 💥:", err)
  }

  if (config.nodeEnv === "development") {
    res.status(statusCode).json({
      status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  } else {
    // Production: Don't leak error details
    if (err instanceof AppError) {
      res.status(statusCode).json({
        status,
        message: err.message,
        errors: err.errors,
      })
    } else {
      // Programming or other unknown error: don't leak details
      logger.error("ERROR 💥", err)
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      })
    }
  }
}
