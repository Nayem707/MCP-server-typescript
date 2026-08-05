import { MCPTool } from "../types/tool.types";
import { sumTool } from "./sum.tool";
import { getUserTool } from "./getUser.tool";
import { myTool } from "./myTool.tool";

/**
 * Tool Registry - Central registry for all available MCP tools
 *
 * To add a new tool:
 * 1. Create a new tool file (e.g., myTool.tool.ts)
 * 2. Implement the MCPTool interface
 * 3. Import and register it here
 */
class ToolRegistry {
  private tools: Map<string, MCPTool> = new Map();

  constructor() {
    this.registerTool(sumTool);
    this.registerTool(getUserTool);
    this.registerTool(myTool);
    // Add new tools here
  }

  /**
   * Register a new tool in the registry
   */
  private registerTool(tool: MCPTool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool with name '${tool.name}' is already registered`);
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Get a tool by name
   */
  getTool(name: string): MCPTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Check if a tool exists
   */
  hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Get all registered tool names
   */
  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Get all tools with their metadata (for discovery)
   */
  getAllTools(): Array<{ name: string; description: string }> {
    return Array.from(this.tools.values()).map((tool) => ({
      name: tool.name,
      description: tool.description,
    }));
  }
}

// Export singleton instance
export const toolRegistry = new ToolRegistry();
