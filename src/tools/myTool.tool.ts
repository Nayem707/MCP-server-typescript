import { z } from "zod";
import { MCPTool } from "../types/tool.types";

// Define input schema
const myToolInputSchema = z.object({
  name: z.string().min(1),
  age: z.number().positive(),
});

type MyToolInput = z.infer<typeof myToolInputSchema>;

interface MyToolOutput {
  message: string;
}

// Implement the tool
export const myTool: MCPTool<MyToolInput, MyToolOutput> = {
  name: "myTool",
  description: "Description of what my tool does",
  inputSchema: myToolInputSchema,

  execute: async (input: MyToolInput): Promise<MyToolOutput> => {
    // Your tool logic here
    return {
      message: `Hello ${input.name}, you are ${input.age} years old!`,
    };
  },
};
