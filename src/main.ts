#!/usr/bin/env node
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { INestApplicationContext } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// 전역 상태 (graceful shutdown용)
let app: INestApplicationContext | null = null;
let mcpServer: McpServer | null = null;
let transport: StdioServerTransport | null = null;

// MCP에서는 stdout은 프로토콜 용도라 로그는 stderr로만 출력하는 게 안전함
const log = (...args: unknown[]) => {
  console.error('[MCP Server]', ...args);
};

/**
 * MCP Server Bootstrap
 */
async function bootstrap() {
  try {
    // HTTP 서버 없이 Nest DI 컨텍스트만 생성
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // MCP 서버 인스턴스 생성
    mcpServer = new McpServer(
      {
        name: 'mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    // TODO: Register tools, resources, prompts from Registry
    // This will be implemented in MCPModule

    // Connect stdio transport
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);

    // Server startup log
    console.error('[MCP Server] Started successfully');
    console.error('[MCP Server] Listening on stdio');
  } catch (error) {
    log('Failed to start:', error);
    // 일부라도 올라간 게 있으면 정리 시도
    await gracefulShutdown('BOOTSTRAP_ERROR');
    process.exit(1);
  }
}

async function gracefulShutdown(reason: string): Promise<void> {
  log(`Received ${reason}, shutting down gracefully...`);

  try {
    if (mcpServer) {
      await mcpServer.close(); // MCP 서버 종료
      mcpServer = null;
    }

    if (transport) {
      // StdioServerTransport는 close()를 제공함
      await transport.close();
      transport = null;
    }

    if (app) {
      await app.close();
      app = null;
    }

    log('Shutdown complete');
  } catch (error) {
    log('Error during shutdown:', error);
  }
}

// OS 시그널 핸들링
process.once('SIGINT', () => {
  void gracefulShutdown('SIGINT').finally(() => process.exit(0));
});

process.once('SIGTERM', () => {
  void gracefulShutdown('SIGTERM').finally(() => process.exit(0));
});

// 프로세스 레벨 에러 핸들링
process.on('unhandledRejection', (reason, promise) => {
  log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  log('Uncaught Exception:', err);
  void gracefulShutdown('UNCAUGHT_EXCEPTION').finally(() => process.exit(1));
});

bootstrap();
