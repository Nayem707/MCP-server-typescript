import { Request, Response, NextFunction } from "express";
import { MCPResponse, MCPErrorCode } from "../types/tool.types";
import { logger } from "./logger";

/**
 * Custom error class for MCP errors
 */
export class MCPError extends Error {
  constructor(
    public code: MCPErrorCode,
    message: string,
    public details?: any,
  ) {
    super(message);
    this.name = "MCPError";
  }
}

/**
 * Global error handler middleware
 * Catches all errors and returns standardized MCP response
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  let statusCode = 500;
  let errorCode = MCPErrorCode.INTERNAL_ERROR;
  let message = "An unexpected error occurred";
  let details = undefined;

  if (err instanceof MCPError) {
    errorCode = err.code;
    message = err.message;
    details = err.details;

    // Map error codes to HTTP status codes
    switch (errorCode) {
      case MCPErrorCode.TOOL_NOT_FOUND:
        statusCode = 404;
        break;
      case MCPErrorCode.VALIDATION_ERROR:
        statusCode = 400;
        break;
      case MCPErrorCode.EXECUTION_ERROR:
        statusCode = 500;
        break;
      default:
        statusCode = 500;
    }
  }

  const response: MCPResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};

/**
 * 404 handler for unknown routes
 */
export const notFoundHandler = (req: Request, res: Response) => {
  const response: MCPResponse = {
    success: false,
    error: {
      code: MCPErrorCode.TOOL_NOT_FOUND,
      message: `Route ${req.path} not found`,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(response);
};
