#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { scanQRCode } from './tools/scanQRCode';
import { scanQRCodeBatch } from './tools/scanQRCodeBatch';
import { generateQRCode } from './tools/generateQRCode';

const server = new FastMCP({
  name: 'MCP Scan QR',
  version: '1.0.3',
});

server.addTool(scanQRCode);
server.addTool(scanQRCodeBatch);
server.addTool(generateQRCode);

server.start({
  transportType: 'stdio',
});
