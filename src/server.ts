import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { toolRegistry } from "./tools";
import { MCPRequest, MCPResponse, MCPErrorCode } from "./types/tool.types";
import {
  errorHandler,
  notFoundHandler,
  MCPError,
} from "./middleware/errorHandler";
import { logger } from "./middleware/logger";
import { validateInput } from "./utils/validator";

/**
 * Create and configure Express application
 */
export function createApp() {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(cors());

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      query: req.query,
      body: req.method !== "GET" ? req.body : undefined,
    });
    next();
  });

  /**
   * Health check endpoint
   */
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  /**
   * List all available tools
   */
  app.get("/tools", (_req: Request, res: Response) => {
    const tools = toolRegistry.getAllTools();

    const response: MCPResponse = {
      success: true,
      data: {
        count: tools.length,
        tools,
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  });

  /**
   * Main MCP endpoint - Execute tools
   *
   * POST /mcp
   * Body: {
   *   "tool": "toolName",
   *   "input": { ... }
   * }
   */
  app.post("/mcp", async (req: Request, res: Response, next) => {
    try {
      const { tool: toolName, input } = req.body as MCPRequest;

      // Validate request format
      if (!toolName || typeof toolName !== "string") {
        throw new MCPError(
          MCPErrorCode.VALIDATION_ERROR,
          'Missing or invalid "tool" field in request',
        );
      }

      if (!input || typeof input !== "object") {
        throw new MCPError(
          MCPErrorCode.VALIDATION_ERROR,
          'Missing or invalid "input" field in request',
        );
      }

      // Get tool from registry
      const tool = toolRegistry.getTool(toolName);

      if (!tool) {
        throw new MCPError(
          MCPErrorCode.TOOL_NOT_FOUND,
          `Tool '${toolName}' not found`,
          {
            availableTools: toolRegistry.getToolNames(),
          },
        );
      }

      logger.info(`Executing tool: ${toolName}`, { input });

      // Validate input against tool schema
      const validatedInput = validateInput(tool.inputSchema, input);

      // Execute tool
      const result = await tool.execute(validatedInput);

      logger.info(`Tool '${toolName}' executed successfully`);

      // Return success response
      const response: MCPResponse = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      // Handle tool execution errors
      if (error instanceof MCPError) {
        next(error);
      } else if (error instanceof Error) {
        next(
          new MCPError(
            MCPErrorCode.EXECUTION_ERROR,
            `Tool execution failed: ${error.message}`,
            { originalError: error.message },
          ),
        );
      } else {
        next(error);
      }
    }
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
