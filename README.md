# MCP Server - Model Context Protocol Tool Server

A production-ready **Model Context Protocol (MCP)** server built with **Node.js**, **TypeScript**, and **Express**. This server provides a tool-based execution system with input validation, error handling, and a scalable architecture.

## 📋 Table of Contents

- [What is MCP?](#what-is-mcp)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Example Tools](#example-tools)
- [Adding New Tools](#adding-new-tools)
- [Real-World Use Case](#real-world-use-case)
- [Error Handling](#error-handling)

---

## 🤔 What is MCP?

**Model Context Protocol (MCP)** is a pattern for enabling AI assistants and other clients to execute backend tools/functions through a standardized API. Think of it as a bridge between AI models and your backend services.

### How It Works:

1. **Client** (AI assistant, frontend app) sends a request to the MCP server
2. **MCP Server** validates the input using schemas
3. **Tool** executes the requested function
4. **Response** is returned in a standardized format

```
[AI Assistant] → POST /mcp → [MCP Server] → [Tool Execution] → [Response]
```

---

## ✨ Features

- ✅ **TypeScript** - Full type safety
- ✅ **Express** - Fast and minimal web framework
- ✅ **Zod Validation** - Runtime input validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Logging** - Winston logger with file and console output
- ✅ **Security** - Helmet for HTTP headers, CORS support
- ✅ **Scalable Architecture** - Easy to add new tools
- ✅ **Production Ready** - Proper error codes, health checks

---

## 📁 Folder Structure

```
mcp-server/
├── src/
│   ├── tools/                  # Tool definitions
│   │   ├── sum.tool.ts         # Sum tool implementation
│   │   ├── getUser.tool.ts     # GetUser tool implementation
│   │   └── index.ts            # Tool registry
│   ├── types/                  # TypeScript type definitions
│   │   └── tool.types.ts       # Core MCP types
│   ├── middleware/             # Express middleware
│   │   ├── errorHandler.ts    # Global error handler
│   │   └── logger.ts           # Winston logger configuration
│   ├── utils/                  # Utility functions
│   │   └── validator.ts        # Input validation helper
│   ├── server.ts               # Express app configuration
│   └── index.ts                # Server entry point
├── logs/                       # Log files (auto-generated)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

### 3. Build the Project

```bash
npm run build
```

### 4. Start the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will start at `http://localhost:3000`

---

## 🎯 Usage

### Quick Start Example

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sum",
    "input": {
      "a": 10,
      "b": 25
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "result": 35,
    "operation": "10 + 25 = 35"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## 🔌 API Endpoints

### 1. **Health Check**

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-04-24T10:30:00.000Z",
  "uptime": 123.45
}
```

---

### 2. **List Available Tools**

```http
GET /tools
```

**Response:**

```json
{
  "success": true,
  "data": {
    "count": 2,
    "tools": [
      {
        "name": "sum",
        "description": "Adds two numbers together and returns the result"
      },
      {
        "name": "getUser",
        "description": "Retrieves a user by their ID from the database"
      }
    ]
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 3. **Execute Tool (Main MCP Endpoint)**

```http
POST /mcp
Content-Type: application/json
```

**Request Body:**

```json
{
  "tool": "toolName",
  "input": {
    // Tool-specific input
  }
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    // Tool-specific output
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": {
      "errors": [
        {
          "path": "a",
          "message": "Expected number, received string",
          "code": "invalid_type"
        }
      ]
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## 🛠️ Example Tools

### 1. **Sum Tool**

Adds two numbers together.

**Request:**

```json
{
  "tool": "sum",
  "input": {
    "a": 15,
    "b": 30
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "result": 45,
    "operation": "15 + 30 = 45"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

### 2. **GetUser Tool**

Retrieves user information by ID.

**Request:**

```json
{
  "tool": "getUser",
  "input": {
    "id": 1
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

**User Not Found:**

```json
{
  "success": true,
  "data": null,
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## ➕ Adding New Tools

Creating a new tool is simple! Follow these steps:

### Step 1: Create Tool File

Create `src/tools/myTool.tool.ts`:

```typescript
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
```

### Step 2: Register the Tool

Add to `src/tools/index.ts`:

```typescript
import { myTool } from './myTool.tool';

constructor() {
  this.registerTool(sumTool);
  this.registerTool(getUserTool);
  this.registerTool(myTool);  // ← Add your tool here
}
```

### Step 3: Test Your Tool

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "myTool",
    "input": {
      "name": "John",
      "age": 25
    }
  }'
```

That's it! Your tool is now available in the MCP server.

---

## 🌍 Real-World Use Case

### AI Assistant with Backend Integration

**Scenario:** You're building an AI customer support assistant that needs to access real backend systems.

```
User: "What's the status of order #12345?"
  ↓
AI Assistant: [Calls MCP server with "getOrderStatus" tool]
  ↓
MCP Server: [Validates input, queries database]
  ↓
AI Assistant: [Receives order data]
  ↓
Response: "Your order #12345 is currently being shipped and will arrive tomorrow."
```

### Benefits:

1. **Separation of Concerns** - AI logic separate from business logic
2. **Security** - Validate and sanitize all AI requests
3. **Consistency** - Standardized API for all AI interactions
4. **Auditability** - Log all AI actions and tool executions
5. **Flexibility** - Add new capabilities without modifying AI model

### Example Tools for Production:

- `getOrderStatus` - Check order information
- `searchProducts` - Find products in inventory
- `createTicket` - Create customer support tickets
- `sendEmail` - Send automated emails
- `checkAvailability` - Check resource availability
- `processRefund` - Handle refund requests

---

## ⚠️ Error Handling

The MCP server uses standardized error codes:

| Error Code         | HTTP Status | Description                  |
| ------------------ | ----------- | ---------------------------- |
| `TOOL_NOT_FOUND`   | 404         | Requested tool doesn't exist |
| `VALIDATION_ERROR` | 400         | Input validation failed      |
| `EXECUTION_ERROR`  | 500         | Tool execution failed        |
| `INTERNAL_ERROR`   | 500         | Unexpected server error      |

### Example Error Response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": {
      "errors": [
        {
          "path": "id",
          "message": "Number must be greater than 0",
          "code": "too_small"
        }
      ]
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## 📊 Logging

Logs are stored in the `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

Console output is colorized for better readability during development.

---

## 🔐 Security Features

- **Helmet** - Secures HTTP headers
- **CORS** - Configurable cross-origin requests
- **Input Validation** - Zod schema validation for all inputs
- **Error Sanitization** - Prevents sensitive data leakage

---

## 📝 License

MIT

---

## 🤝 Contributing

1. Create a new tool following the patterns in `src/tools/`
2. Add comprehensive input validation
3. Include tests for your tool
4. Update this README with examples

---

## 📞 Support

For issues or questions, please open an issue on the repository.

---

**Happy coding! 🚀**
