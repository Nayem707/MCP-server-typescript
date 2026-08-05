# MCP Architecture & Design

This document explains the architecture and design decisions behind the MCP server.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  (AI Assistant, Frontend App, Mobile App, etc.)             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP POST /mcp
                  │ { "tool": "sum", "input": {...} }
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                     │  │
│  │  - CORS, Helmet (Security)                            │  │
│  │  - Body Parser (JSON)                                 │  │
│  │  - Logger (Winston)                                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  /mcp Endpoint Handler                                │  │
│  │  1. Parse request (tool + input)                      │  │
│  │  2. Validate request format                           │  │
│  │  3. Lookup tool in registry                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Tool Registry                                        │  │
│  │  - getTool(name)                                      │  │
│  │  - Centralized tool management                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Input Validator (Zod)                                │  │
│  │  - Validate against tool schema                       │  │
│  │  - Type-safe input                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Tool Execution                                       │  │
│  │  - Execute tool.execute(validatedInput)               │  │
│  │  - Business logic runs here                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Response Formatter                                   │  │
│  │  - Wrap in MCPResponse                                │  │
│  │  - Add timestamp                                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Error Handler (if errors occur)                      │  │
│  │  - Catch and format errors                            │  │
│  │  - Map to HTTP status codes                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP Response
                  │ { "success": true, "data": {...} }
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│                   (Receives response)                        │
└─────────────────────────────────────────────────────────────┘
```

## Design Principles

### 1. **Separation of Concerns**

Each component has a single responsibility:

- **Server** (`server.ts`) - HTTP routing and Express configuration
- **Tools** (`tools/`) - Business logic implementation
- **Middleware** (`middleware/`) - Cross-cutting concerns (logging, errors)
- **Types** (`types/`) - Type definitions
- **Utils** (`utils/`) - Shared utilities

### 2. **Type Safety**

TypeScript is used throughout to ensure:

- Compile-time error checking
- IntelliSense support
- Self-documenting code
- Refactoring safety

### 3. **Input Validation**

Zod provides runtime validation:

- Schema-based validation
- Type inference
- Detailed error messages
- Prevents invalid data from reaching business logic

### 4. **Standardized Responses**

All responses follow the `MCPResponse` format:

```typescript
{
  success: boolean,
  data?: any,
  error?: { code, message, details },
  timestamp: string
}
```

This ensures:

- Consistent client-side handling
- Predictable error formats
- Easy debugging

### 5. **Extensibility**

Adding new tools requires minimal changes:

1. Create tool file
2. Register in `tools/index.ts`
3. No changes to core server logic

## Tool Lifecycle

### 1. Tool Definition

```typescript
export const myTool: MCPTool = {
  name: "myTool",
  description: "What the tool does",
  inputSchema: zodSchema,
  execute: async (input) => {
    /* logic */
  },
};
```

### 2. Tool Registration

```typescript
class ToolRegistry {
  constructor() {
    this.registerTool(myTool);
  }
}
```

### 3. Tool Discovery

```typescript
GET / tools;
// Returns list of all available tools
```

### 4. Tool Execution

```typescript
POST /mcp
{
  "tool": "myTool",
  "input": { ... }
}
```

### 5. Response

```typescript
{
  "success": true,
  "data": { /* tool output */ }
}
```

## Error Handling Flow

```
Request → Validation → Error?
                         │
                         ├─ MCPError → Error Handler → Formatted Response
                         │
                         └─ Other Error → Error Handler → Generic Error
```

### Error Types

1. **TOOL_NOT_FOUND** - Tool doesn't exist
2. **VALIDATION_ERROR** - Input schema validation failed
3. **EXECUTION_ERROR** - Tool execution threw an error
4. **INTERNAL_ERROR** - Unexpected server error

## Scalability Considerations

### Current Architecture

- **Single Process** - Node.js single-threaded
- **In-Memory Registry** - Tools stored in memory
- **Synchronous Tool Execution** - Awaits each tool

### Scaling Options

#### Horizontal Scaling

```
Load Balancer
    │
    ├─ MCP Server Instance 1
    ├─ MCP Server Instance 2
    └─ MCP Server Instance 3
```

#### Async Tool Execution

```typescript
execute: async (input) => {
  // Queue job
  await jobQueue.add("processTask", input);
  return { jobId: "uuid" };
};
```

#### Caching

```typescript
execute: async (input) => {
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const result = await computeExpensiveOperation();
  await redis.set(cacheKey, result);
  return result;
};
```

## Security Considerations

### Current Protections

1. **Helmet** - Secures HTTP headers
2. **Input Validation** - Zod schema validation
3. **Error Sanitization** - No stack traces in production
4. **CORS** - Configurable origin restrictions

### Additional Recommendations

1. **Rate Limiting**

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/mcp", limiter);
```

2. **Authentication**

```typescript
import { verifyToken } from "./auth";

app.use("/mcp", verifyToken);
```

3. **Input Sanitization**

```typescript
import { sanitize } from "express-mongo-sanitize";

app.use(sanitize());
```

## Logging Strategy

### Log Levels

- **error** - Errors that require attention
- **warn** - Potential issues
- **info** - General information (requests, responses)
- **debug** - Detailed debugging information

### Log Outputs

1. **Console** - Colorized, human-readable
2. **File** - JSON format for parsing
3. **External Service** - (Optional) Send to monitoring service

### Example Log

```json
{
  "timestamp": "2026-04-24 10:30:00",
  "level": "info",
  "message": "Executing tool: sum",
  "input": { "a": 10, "b": 25 }
}
```

## Testing Strategy

### Unit Tests (Recommended)

```typescript
describe("Sum Tool", () => {
  it("should add two numbers", async () => {
    const result = await sumTool.execute({ a: 10, b: 25 });
    expect(result.result).toBe(35);
  });
});
```

### Integration Tests

```typescript
describe("MCP Endpoint", () => {
  it("should execute sum tool", async () => {
    const response = await request(app)
      .post("/mcp")
      .send({ tool: "sum", input: { a: 10, b: 25 } });

    expect(response.body.success).toBe(true);
    expect(response.body.data.result).toBe(35);
  });
});
```

## Performance Optimization

### Current Performance

- **Validation**: ~1ms (Zod)
- **Tool Lookup**: O(1) (Map)
- **Logging**: Async (non-blocking)

### Optimization Tips

1. **Cache Tool Registry** - Already implemented (singleton)
2. **Async Logging** - Already implemented (Winston)
3. **Connection Pooling** - For database tools
4. **Response Compression** - Gzip responses

## Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/index.js"]
```

### Environment Variables

```env
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
```

## Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

### Metrics to Monitor

1. **Request Rate** - Requests per second
2. **Error Rate** - Failed requests / total requests
3. **Response Time** - P50, P95, P99
4. **Tool Execution Time** - Per tool
5. **Memory Usage** - Node.js heap

### Recommended Tools

- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **Winston** - Logging
- **PM2** - Process management

## Future Enhancements

1. **Tool Versioning** - Support multiple tool versions
2. **Async Tool Execution** - Background job processing
3. **Tool Composition** - Chain multiple tools
4. **GraphQL Support** - Alternative API format
5. **WebSocket Support** - Real-time tool execution
6. **Tool Marketplace** - Share and discover tools

---

**Questions?** Check the [README](README.md) or open an issue!
