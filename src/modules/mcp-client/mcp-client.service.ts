import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class McpClientService implements OnModuleInit {
  private readonly logger = new Logger(McpClientService.name);
  private client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      name: 'BarberShopManager',
      version: '1.0.0',
    });
  }

  async onModuleInit() {
    await this.connectToMcpServer();
    await this.discoverAvailableTools();
  }

  private async connectToMcpServer(): Promise<void> {
    try {
      this.logger.log('Connecting to MCP server...');

      // Connect to the plans-mcp-server running in Docker
      const transport = new StdioClientTransport({
        command: 'docker',
        args: ['exec', 'plans-mcp-server', 'node', '/app/src/index.ts'],
        env: {
          NODE_ENV: 'development',
        },
      });

      await this.client.connect(transport);

      this.logger.log('Successfully connected to MCP server');

      // Test connection with ping
      await this.client.ping();
      this.logger.log('MCP server is responsive');
    } catch (error) {
      this.logger.error('Failed to connect to MCP server', error);
      throw error;
    }
  }

  private async discoverAvailableTools(): Promise<void> {
    try {
      this.logger.log('Discovering available MCP tools...');

      const tools = await this.client.listTools();

      this.logger.log(`Found ${tools.tools.length} available tools:`);

      tools.tools.forEach((tool, index) => {
        this.logger.log(`Tool ${index + 1}: ${tool.name}`);
        this.logger.log(`  Description: ${tool.description}`);
        this.logger.log(
          `  Input Schema: ${JSON.stringify(tool.inputSchema, null, 2)}`,
        );
        this.logger.log('---');
      });
    } catch (error) {
      this.logger.error('Failed to discover MCP tools', error);
      throw error;
    }
  }

  async callTool(
    toolName: string,
    arguments_: Record<string, any>,
  ): Promise<any> {
    try {
      this.logger.log(`Calling MCP tool: ${toolName}`);

      const result = await this.client.callTool({
        name: toolName,
        arguments: arguments_,
      });

      this.logger.log(`Tool ${toolName} executed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to call MCP tool: ${toolName}`, error);
      throw error;
    }
  }

  async getAllTools(): Promise<any[]> {
    try {
      const tools = await this.client.listTools();
      return tools.tools;
    } catch (error) {
      this.logger.error('Failed to get all tools', error);
      throw error;
    }
  }

  async ping(): Promise<void> {
    try {
      await this.client.ping();
      this.logger.log('MCP server ping successful');
    } catch (error) {
      this.logger.error('MCP server ping failed', error);
      throw error;
    }
  }
}
