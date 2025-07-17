# MCP Server Configuration

## Overview

This application connects to an MCP (Model Context Protocol) server running as a Docker service in the `barber_evolution_net` network using HTTP/SSE transport.

## Architecture

The MCP client connects to the `plans-mcp-server` service running in Docker using Server-Sent Events (SSE) transport over HTTP.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   App Container │    │  plans-mcp-server│    │   Database      │
│                 │    │   Container      │    │   Container     │
│  MCP Client     │◄──►│  MCP Server      │    │   PostgreSQL    │
│  (HTTP/SSE)     │    │  (HTTP/SSE)      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ barber_evolution_net |
                    │   Docker Network    │
                    └─────────────────┘
```

## Docker Configuration

The application runs in the `barber_evolution_net` Docker network alongside the MCP server.

### Network Setup

Both services are configured to use the same Docker network:

```yaml
networks:
  - barber_evolution_net
```

### MCP Server Connection

The MCP client connects to the `plans-mcp-server` service using HTTP/SSE transport:

```typescript
const transport = new SSEClientTransport(
  new URL('http://plans-mcp-server:3000')
);
```

## Environment Variables

Configure the MCP server connection via environment variables:

```bash
# MCP Server Configuration
MCP_SERVER_URL=http://plans-mcp-server:3000
```

## Running the Application

```bash
# Start all services including the MCP server
docker compose -f docker-compose.dev.yml up --build
```

## API Endpoints

Once configured, the MCP client provides these endpoints:

- `GET /mcp/tools` - List all available MCP tools
- `GET /mcp/ping` - Test MCP server connectivity

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure the MCP server is running and exposing HTTP port
2. **Network connectivity**: Verify both containers are in the same network
3. **SSE transport error**: Check if MCP server supports HTTP/SSE transport

### Debug Commands

```bash
# Check if MCP server container is running
docker ps | grep plans-mcp-server

# Check network connectivity
docker network inspect barber_evolution_net

# Test HTTP connectivity to MCP server
docker exec barber_shop_manager_app_dev curl -v http://plans-mcp-server:3000

# Check container logs
docker logs plans-mcp-server-plans-mcp-server-run-6f2dd3365366
```

### Network Verification

```bash
# List containers in the network
docker network inspect barber_evolution_net --format='{{range .Containers}}{{.Name}} {{end}}'

# Test connectivity between containers
docker exec barber_shop_manager_app_dev ping plans-mcp-server

# Check if MCP server is listening on HTTP port
docker exec barber_shop_manager_app_dev netstat -tulpn | grep 3000
```

## Service Dependencies

The application depends on:
- `plans-mcp-server` - MCP server service (must support HTTP/SSE transport)
- `db` - PostgreSQL database

Make sure all services are running before testing the MCP client.

## MCP Server Requirements

The MCP server must:
1. Support HTTP/SSE transport
2. Expose port 3000 (or configure via MCP_SERVER_URL)
3. Be accessible via the service name `plans-mcp-server`
4. Be running in the same Docker network 