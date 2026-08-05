import { z } from "zod";
import { MCPErrorCode } from "../types/tool.types";
import { MCPError } from "../middleware/errorHandler";

/**
 * Validates input against a Zod schema
 * Throws MCPError if validation fails
 */
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new MCPError(
        MCPErrorCode.VALIDATION_ERROR,
        "Input validation failed",
        {
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        },
      );
    }
    throw error;
  }
}
