import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import axios from 'axios';
import sharp from 'sharp';
import jsQR from 'jsqr';

const name = 'scanQRCode';
const description = 'Scan QR code from an image URL (HTTPS only)';
const parameters = z.object({
  imageUrl: z
    .string()
    .url()
    .startsWith('https://', { message: 'Only HTTPS URLs are allowed' }),
});

// 定义返回结果的类型
type ScanResult = {
  status: 'success' | 'error';
  format?: string;
  content?: string;
  message?: string;
  error?: string;
  timestamp?: string;
};

const scanQRCode: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { imageUrl } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info(`Scanning QR code from URL: ${imageUrl}`);

    try {
      // 验证是否为HTTPS URL
      if (!imageUrl.startsWith('https://')) {
        throw new Error('Only HTTPS URLs are allowed for security reasons');
      }

      // 下载图片数据
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });

      // 获取内容类型
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL does not point to an image');
      }

      // 将图片数据转换为Buffer
      const imageBuffer = Buffer.from(response.data);

      // 使用sharp处理图像
      const image = sharp(imageBuffer);
      const metadata = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      logger.info('metadata', JSON.stringify(metadata.info));

      // 将图像数据转换为Uint8ClampedArray格式供jsQR使用
      const imageData = new Uint8ClampedArray(metadata.data.buffer);

      // 使用jsQR解析二维码
      const code = jsQR(imageData, metadata.info.width, metadata.info.height);

      if (code) {
        logger.info(`Successfully decoded QR code: ${code.data}`);

        const successResult: ScanResult = {
          status: 'success',
          format: 'QR_CODE',
          content: code.data,
          timestamp: new Date().toISOString(),
        };

        return JSON.stringify(successResult);
      } else {
        logger.error('Failed to decode QR code');
        const errorResult: ScanResult = {
          status: 'error',
          message: 'Failed to decode QR code',
          error: 'No QR code found in image',
        };
        return JSON.stringify(errorResult);
      }
    } catch (error: any) {
      logger.error(`Failed to fetch or process image`, {
        error: error.message,
      });
      const result: ScanResult = {
        status: 'error',
        message: 'Failed to fetch or process image',
        error: error.message,
      };
      return JSON.stringify(result);
    }
  },
};

export { scanQRCode };
