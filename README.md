# mcp-scan-qr

这是一个基于 [FastMCP](https://github.com/fastmcp/fastmcp) 框架构建的 MCP (Model Context Protocol) 工具包，用于从图像中扫描二维码。

## 功能

当前实现了以下二维码扫描工具：
- `scanQRCode`: 从单个图片URL扫描二维码
- `scanQRCodeBatch`: 从多个图片URL批量扫描二维码

## 安装依赖

```bash
bun install
```

## 运行项目

```bash
bun run dev
```

## 调试项目

```bash
bun run inspect
```

## 构建项目

```bash
bun run build
```

## 部署 MCP

```JSON
{
  "mcpServers": {
    "mcp-scan-qr": {
      "args": ["-y","@pidanmoe/mcp-scan-qr"],
      "command": "npx",
      "env": {
        // 环境变量
      }
    }
  }
}
```

## 项目结构

- [src/index.ts](file:///Volumes/SSD/_work/mcp-template/mcp-scan-qr/src/index.ts): 主入口文件，初始化并启动 FastMCP 服务器
- [src/tools/scanQRCode.ts](file:///Volumes/SSD/_work/mcp-template/mcp-scan-qr/src/tools/scanQRCode.ts): 实现了 `scanQRCode` 工具，支持从单个图片URL扫描二维码
- [src/tools/scanQRCodeBatch.ts](file:///Volumes/SSD/_work/mcp-template/mcp-scan-qr/src/tools/scanQRCodeBatch.ts): 实现了 `scanQRCodeBatch` 工具，支持从多个图片URL批量扫描二维码
- [src/utils/logger.ts](file:///Volumes/SSD/_work/mcp-template/mcp-scan-qr/src/utils/logger.ts): 日志工具模块

## 使用说明

该工具包提供了两个MCP工具：

### scanQRCode
从单个HTTPS图片URL扫描二维码：
```json
{
  "name": "scanQRCode",
  "arguments": {
    "imageUrl": "https://example.com/qrcode.png"
  }
}
```

### scanQRCodeBatch
从多个HTTPS图片URL批量扫描二维码（最多10个）：
```json
{
  "name": "scanQRCodeBatch",
  "arguments": {
    "imageUrls": [
      "https://example.com/qrcode1.png",
      "https://example.com/qrcode2.png"
    ]
  }
}
```

两个工具都会返回包含扫描结果的JSON字符串。成功时返回二维码内容，失败时返回错误信息。

## 技术栈

- [Bun](https://bun.sh) - JavaScript/TypeScript 运行时
- [FastMCP](https://github.com/fastmcp/fastmcp) - MCP 框架
- [Zod](https://zod.dev) - TypeScript-first schema declaration and validation library
- [jsQR](https://github.com/cozmo/jsQR) - JavaScript QR code reader
- [Sharp](https://sharp.pixelplumbing.com) - High performance Node.js image processing
- [Axios](https://axios-http.com) - Promise based HTTP client

---

此项目使用 bun v1.2.19 创建。[Bun](https://bun.sh) 是一个快速的一体化 JavaScript 运行时。