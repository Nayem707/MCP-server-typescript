import { z } from "zod";
import { MCPTool } from "../types/tool.types";

/**
 * Input schema for the sum tool
 */
const sumInputSchema = z.object({
  a: z.number().describe("First number to add"),
  b: z.number().describe("Second number to add"),
});

type SumInput = z.infer<typeof sumInputSchema>;

interface SumOutput {
  result: number;
  operation: string;
}

/**
 * Sum Tool - Adds two numbers together
 *
 * Example use case:
 * - AI assistant needs to perform calculations
 * - Backend calculation service
 * - Mathematical operations in workflows
 */
export const sumTool: MCPTool<SumInput, SumOutput> = {
  name: "sum",
  description: "Adds two numbers together and returns the result",
  inputSchema: sumInputSchema,

  execute: async (input: SumInput): Promise<SumOutput> => {
    const result = input.a + input.b;

    return {
      result,
      operation: `${input.a} + ${input.b} = ${result}`,
    };
  },
};
