import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { McpClientService } from './mcp-client.service';

@ApiTags('MCP Client')
@Controller('mcp')
export class McpClientController {
  constructor(private readonly mcpClientService: McpClientService) {}

  @Get('tools')
  @ApiOperation({ summary: 'Get all available MCP tools' })
  @ApiResponse({
    status: 200,
    description: 'List of available MCP tools',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          inputSchema: { type: 'object' },
        },
      },
    },
  })
  async getAllTools() {
    return this.mcpClientService.getAllTools();
  }

  @Get('ping')
  @ApiOperation({ summary: 'Ping MCP server to check connectivity' })
  @ApiResponse({
    status: 200,
    description: 'MCP server is responsive',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'MCP server is responsive' },
      },
    },
  })
  async ping() {
    await this.mcpClientService.ping();
    return { message: 'MCP server is responsive' };
  }
}
