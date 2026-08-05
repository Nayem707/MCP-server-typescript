import dotenv from "dotenv";
import { createApp } from "./server";
import { logger } from "./middleware/logger";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Start the MCP server
 */
async function startServer() {
  try {
    const app = createApp();

    app.listen(PORT, () => {
      logger.info("=================================");
      logger.info(`🚀 MCP Server Started`);
      logger.info(`Environment: ${NODE_ENV}`);
      logger.info(`Port: ${PORT}`);
      logger.info(`Health: http://localhost:${PORT}/health`);
      logger.info(`Tools: http://localhost:${PORT}/tools`);
      logger.info(`MCP Endpoint: http://localhost:${PORT}/mcp`);
      logger.info("=================================");
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server
startServer();
