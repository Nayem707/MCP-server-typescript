import { z } from "zod";

/**
 * Base interface for all MCP tools
 */
export interface MCPTool<TInput = any, TOutput = any> {
  /** Unique identifier for the tool */
  name: string;

  /** Human-readable description of what the tool does */
  description: string;

  /** Zod schema for input validation */
  inputSchema: z.ZodSchema<TInput>;

  /** Function that executes the tool logic */
  execute: (input: TInput) => Promise<TOutput> | TOutput;
}

/**
 * Standard MCP request format
 */
export interface MCPRequest {
  tool: string;
  input: Record<string, any>;
}

/**
 * Standard MCP response format
 */
export interface MCPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * Error codes used in the MCP system
 */
export enum MCPErrorCode {
  TOOL_NOT_FOUND = "TOOL_NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  EXECUTION_ERROR = "EXECUTION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}
