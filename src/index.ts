#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { scanQRCode } from './tools/scanQRCode';
import { scanQRCodeBatch } from './tools/scanQRCodeBatch';

const server = new FastMCP({
  name: 'MCP Scan QR',
  version: '1.0.0',
});

server.addTool(scanQRCode);
server.addTool(scanQRCodeBatch);

server.start({
  transportType: 'stdio',
});