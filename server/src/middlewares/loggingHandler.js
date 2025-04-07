// Logger class
const LogLevel = {
  TRACE: "TRACE",
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  FATAL: "FATAL",
};

class Logger {
  formatLog(entry) {
    return `[${entry.timestamp}] [${entry.level}] ${entry.message} ${
      entry.metadata ? JSON.stringify(entry.metadata) : ""
    } ${entry.stack || ""}`;
  }

  log(level, message, metadata, stack) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
      stack,
    };

    // Log to the console
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      console.error(this.formatLog(entry));
    } else {
      console.log(this.formatLog(entry));
    }
  }

  trace(message, metadata) {
    this.log(LogLevel.TRACE, message, metadata);
  }

  debug(message, metadata) {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message, metadata) {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message, metadata) {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message, metadata, stack) {
    this.log(LogLevel.ERROR, message, metadata, stack);
  }

  fatal(message, metadata, stack) {
    this.log(LogLevel.FATAL, message, metadata, stack);
  }
}

// Middleware function
const loggingMiddleware = (logger) => {
  return (req, res, next) => {
    const start = Date.now();
    const logMetadata = {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };

    logger.info(`Request received`, logMetadata);

    res.on("finish", () => {
      const duration = Date.now() - start;
      const logLevel =
        res.statusCode >= 500
          ? LogLevel.ERROR
          : res.statusCode >= 400
          ? LogLevel.WARN
          : LogLevel.INFO;
      logger.log(logLevel, `Request processed`, {
        ...logMetadata,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      });
    });

    res.on("error", (err) => {
      logger.error("Error in request", { ...logMetadata, error: err.message });
    });

    next();
  };
};

// Create a logger instance
const logger = new Logger();

const loggingHandler = loggingMiddleware(logger);

module.exports = { Logger, loggingMiddleware, loggingHandler };
