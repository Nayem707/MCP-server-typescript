# MCP Server - Request/Response Examples

This document provides detailed examples of API requests and responses for all endpoints.

---

## Table of Contents

- [Health Check](#health-check)
- [List Tools](#list-tools)
- [Sum Tool](#sum-tool)
- [GetUser Tool](#getuser-tool)
- [Error Examples](#error-examples)

---

## Health Check

Check if the server is running and healthy.

### Request

```bash
curl http://localhost:3000/health
```

### Response

```json
{
  "status": "healthy",
  "timestamp": "2026-04-24T10:30:00.000Z",
  "uptime": 123.45
}
```

---

## List Tools

Get a list of all available tools on the server.

### Request

```bash
curl http://localhost:3000/tools
```

### Response

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

## Sum Tool

### Example 1: Basic Addition

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

### Example 2: Negative Numbers

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sum",
    "input": {
      "a": -15,
      "b": 40
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "result": 25,
    "operation": "-15 + 40 = 25"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

### Example 3: Decimals

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sum",
    "input": {
      "a": 3.14,
      "b": 2.86
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "result": 6,
    "operation": "3.14 + 2.86 = 6"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## GetUser Tool

### Example 1: Get Existing User

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "getUser",
    "input": {
      "id": 1
    }
  }'
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

### Example 2: Get Another User

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "getUser",
    "input": {
      "id": 2
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "role": "user",
    "createdAt": "2024-02-20T14:45:00Z"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

### Example 3: User Not Found

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "getUser",
    "input": {
      "id": 999
    }
  }'
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

---

## Error Examples

### Example 1: Tool Not Found

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "nonExistentTool",
    "input": {}
  }'
```

**Response:**

```json
{
  "success": false,
  "error": {
    "code": "TOOL_NOT_FOUND",
    "message": "Tool 'nonExistentTool' not found",
    "details": {
      "availableTools": ["sum", "getUser"]
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

**HTTP Status:** `404 Not Found`

---

### Example 2: Validation Error - Missing Field

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sum",
    "input": {
      "a": 10
    }
  }'
```

**Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": {
      "errors": [
        {
          "path": "b",
          "message": "Required",
          "code": "invalid_type"
        }
      ]
    }
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

**HTTP Status:** `400 Bad Request`

---

### Example 3: Validation Error - Wrong Type

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sum",
    "input": {
      "a": "hello",
      "b": 25
    }
  }'
```

**Response:**

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

**HTTP Status:** `400 Bad Request`

---

### Example 4: Validation Error - Invalid ID

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "getUser",
    "input": {
      "id": -5
    }
  }'
```

**Response:**

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

**HTTP Status:** `400 Bad Request`

---

### Example 5: Missing Tool Field

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "a": 10,
      "b": 20
    }
  }'
```

**Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing or invalid \"tool\" field in request"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

**HTTP Status:** `400 Bad Request`

---

### Example 6: Missing Input Field

**Request:**

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "sum"
  }'
```

**Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing or invalid \"input\" field in request"
  },
  "timestamp": "2026-04-24T10:30:00.000Z"
}
```

**HTTP Status:** `400 Bad Request`

---

## Using with JavaScript/Node.js

```javascript
const axios = require("axios");

async function callMCPTool(toolName, input) {
  try {
    const response = await axios.post("http://localhost:3000/mcp", {
      tool: toolName,
      input: input,
    });

    console.log("Success:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Example usage
callMCPTool("sum", { a: 10, b: 25 });
callMCPTool("getUser", { id: 1 });
```

---

## Using with Python

```python
import requests

def call_mcp_tool(tool_name, input_data):
    url = 'http://localhost:3000/mcp'
    payload = {
        'tool': tool_name,
        'input': input_data
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print('Success:', response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print('Error:', e)
        if hasattr(e, 'response') and e.response is not None:
            print('Response:', e.response.json())

# Example usage
call_mcp_tool('sum', {'a': 10, 'b': 25})
call_mcp_tool('getUser', {'id': 1})
```

---

## Using with Fetch (Browser/Frontend)

```javascript
async function callMCPTool(toolName, input) {
  try {
    const response = await fetch("http://localhost:3000/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: toolName,
        input: input,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Success:", data.data);
    } else {
      console.error("Error:", data.error);
    }

    return data;
  } catch (error) {
    console.error("Network error:", error);
  }
}

// Example usage
callMCPTool("sum", { a: 10, b: 25 });
callMCPTool("getUser", { id: 1 });
```

---

**Note:** Make sure the MCP server is running on `http://localhost:3000` before making these requests.
