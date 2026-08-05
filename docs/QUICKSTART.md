# Quick Start Guide

Get your MCP server up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Express, TypeScript, Zod, and Winston.

### 2. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

The default configuration works out of the box:

```env
PORT=3000
NODE_ENV=development
```

### 3. Start the Server

**Option A: Development Mode (recommended for testing)**

```bash
npm run dev
```

This starts the server with auto-reload on file changes.

**Option B: Production Mode**

```bash
npm run build
npm start
```

### 4. Verify Server is Running

Open your browser or use curl:

```bash
curl http://localhost:3000/health
```

You should see:

```json
{
  "status": "healthy",
  "timestamp": "2026-04-24T10:30:00.000Z",
  "uptime": 5.23
}
```

## Test the Tools

### Test the Sum Tool

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"tool":"sum","input":{"a":10,"b":25}}'
```

Expected output:

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

### Test the GetUser Tool

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"tool":"getUser","input":{"id":1}}'
```

Expected output:

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

## What's Next?

1. **Add Your Own Tool** - See [README.md](README.md#adding-new-tools) for instructions
2. **Check Examples** - See [EXAMPLES.md](EXAMPLES.md) for more request/response examples
3. **Configure Logging** - Check the `logs/` directory for server logs
4. **Deploy to Production** - Use `npm run build` and deploy the `dist/` folder

## Common Issues

### Port Already in Use

If you see `Error: listen EADDRINUSE`, change the PORT in your `.env` file:

```env
PORT=3001
```

### TypeScript Errors

Make sure you have TypeScript installed:

```bash
npm install -D typescript
```

### Missing Logs Directory

The server automatically creates the `logs/` directory, but if you encounter issues:

```bash
mkdir logs
```

## Development Tips

- **Type Checking**: Run `npm run type-check` to check for TypeScript errors
- **Auto-Reload**: Use `npm run dev` for automatic restarts on code changes
- **View Logs**: Check `logs/combined.log` for all server activity

## Support

For more detailed information, see the main [README.md](README.md).

Happy coding! 🚀
