# MCP Server Configuration

## Overview

This application connects to an MCP (Model Context Protocol) server to access external tools and resources.

## Environment Variables

Add the following variables to your `.env` file:

```bash
# MCP Server Configuration
MCP_SERVER_PATH=/home/elvis/plans-mcp-server/src/index.ts
MCP_SERVER_COMMAND=node
MCP_SERVER_ENV={"NODE_ENV":"development"}
```

## Docker Configuration

The application is configured to run with host networking to access the MCP server running on the host machine.

### Docker Compose Changes

The `docker-compose.dev.yml` has been modified to:

1. **Mount the host's home directory**: Allows access to the MCP server files
2. **Use host networking**: Enables communication with the MCP server
3. **Environment variables**: Configurable MCP server settings

### Running with Docker

```bash
# Rebuild and start the application
docker compose -f docker-compose.dev.yml up --build
```

## Alternative Solutions

### Option 1: Run MCP Server in Docker

If you prefer to run the MCP server in Docker as well, you can:

1. Create a separate service in docker-compose.dev.yml
2. Use internal Docker networking
3. Update the MCP_SERVER_PATH to point to the containerized server

### Option 2: Use HTTP/SSE Transport

Instead of stdio transport, you can configure the MCP server to use HTTP/SSE transport:

```typescript
// In mcp-client.service.ts
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const transport = new SSEClientTransport(
  new URL('http://localhost:3001/sse')
);
```

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure the MCP server path is correct and accessible
2. **Permission denied**: Check file permissions on the MCP server directory
3. **Network connectivity**: Verify host networking is properly configured

### Debug Commands

```bash
# Check if MCP server is accessible from container
docker exec -it barber_shop_manager_app_dev ls -la /home/elvis/plans-mcp-server/src/

# Test MCP server directly
node /home/elvis/plans-mcp-server/src/index.ts

# Check container networking
docker exec -it barber_shop_manager_app_dev netstat -tulpn
```

## API Endpoints

Once configured, the MCP client provides these endpoints:

- `GET /mcp/tools` - List all available MCP tools
- `GET /mcp/ping` - Test MCP server connectivity 