#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { scanQRCode } from './tools/scanQRCode';
import { scanQRCodeBatch } from './tools/scanQRCodeBatch';
import { generateQRCode } from './tools/generateQRCode';
import packageJson from '../package.json';

const server = new FastMCP({
  name: 'MCP Scan QR',
  version: packageJson.version as `${number}.${number}.${number}`,
});

server.addTool(scanQRCode);
server.addTool(scanQRCodeBatch);
server.addTool(generateQRCode);

server.start({
  transportType: 'stdio',
});
