// Type definitions for the logger
export type LogLevel = "error" | "warn" | "critical" | "info" | "http" | "debug"

export interface LogMetadata {
  [key: string]: any
  stack?: string
  service?: string
}

export interface Logger {
  error(message: string, meta?: LogMetadata): void
  warn(message: string, meta?: LogMetadata): void
  critical(message: string, meta?: LogMetadata): void
  info(message: string, meta?: LogMetadata): void
  http(message: string, meta?: LogMetadata): void
  debug(message: string, meta?: LogMetadata): void
  log(level: LogLevel, message: string, meta?: LogMetadata): void
}

