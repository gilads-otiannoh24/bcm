import type { Request, Response, NextFunction } from "express"
import { logHttp } from "../utils/logger"

/**
 * Middleware to log all incoming requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log the request
  logHttp(`${req.method} ${req.originalUrl} from ${req.ip}`)

  // Get the start time
  const start = Date.now()

  // Once the response is finished, log the response time
  res.on("finish", () => {
    const duration = Date.now() - start
    logHttp(`${req.method} ${req.originalUrl} completed with status ${res.statusCode} in ${duration}ms`)
  })

  next()
}

