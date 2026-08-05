import { z } from "zod";
import { MCPTool } from "../types/tool.types";

/**
 * Input schema for the getUser tool
 */
const getUserInputSchema = z.object({
  id: z.number().positive().describe("User ID to retrieve"),
});

type GetUserInput = z.infer<typeof getUserInputSchema>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

/**
 * Mock database of users
 */
const mockUsers: Record<number, User> = {
  1: {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    createdAt: "2024-01-15T10:30:00Z",
  },
  2: {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    createdAt: "2024-02-20T14:45:00Z",
  },
  3: {
    id: 3,
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "user",
    createdAt: "2024-03-10T09:15:00Z",
  },
};

/**
 * GetUser Tool - Retrieves a user by ID
 *
 * Example use case:
 * - AI assistant retrieving user information
 * - User lookup service
 * - Authentication and authorization workflows
 */
export const getUserTool: MCPTool<GetUserInput, User | null> = {
  name: "getUser",
  description: "Retrieves a user by their ID from the database",
  inputSchema: getUserInputSchema,

  execute: async (input: GetUserInput): Promise<User | null> => {
    // Simulate database lookup
    const user = mockUsers[input.id];

    if (!user) {
      return null;
    }

    return user;
  },
};
