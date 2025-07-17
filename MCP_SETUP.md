# MCP Server Configuration

## Overview

This application connects to an MCP (Model Context Protocol) server running as a Docker service in the `barber_evolution_net` network.

## Architecture

The MCP client connects to the `plans-mcp-server` service running in Docker using stdio transport through `docker exec`.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   App Container │    │  plans-mcp-server│    │   Database      │
│                 │    │   Container      │    │   Container     │
│  MCP Client     │◄──►│  MCP Server      │    │   PostgreSQL    │
│                 │    │                  │    │                 │
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

The MCP client connects to the `plans-mcp-server` service using:

```typescript
const transport = new StdioClientTransport({
  command: 'docker',
  args: ['exec', 'plans-mcp-server', 'node', '/app/src/index.ts'],
});
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

1. **Container not found**: Ensure the `plans-mcp-server` container is running
2. **Network connectivity**: Verify both containers are in the same network
3. **Permission denied**: Check Docker exec permissions

### Debug Commands

```bash
# Check if MCP server container is running
docker ps | grep plans-mcp-server

# Check network connectivity
docker network inspect barber_evolution_net

# Test MCP server directly
docker exec plans-mcp-server node /app/src/index.ts

# Check container logs
docker logs plans-mcp-server
```

### Network Verification

```bash
# List containers in the network
docker network inspect barber_evolution_net --format='{{range .Containers}}{{.Name}} {{end}}'

# Test connectivity between containers
docker exec barber_shop_manager_app_dev ping plans-mcp-server
```

## Service Dependencies

The application depends on:
- `plans-mcp-server` - MCP server service
- `db` - PostgreSQL database

Make sure all services are running before testing the MCP client. 