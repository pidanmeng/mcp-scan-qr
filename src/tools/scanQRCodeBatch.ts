import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import axios from 'axios';
import sharp from 'sharp';
import jsQR from 'jsqr';

const name = 'scanQRCodeBatch';
const description = 'Scan QR codes from a batch of image URLs (HTTPS only)';
const parameters = z.object({
  imageUrls: z
    .array(z.string().url())
    .min(1, { message: 'At least one image URL is required' })
    .max(10, { message: 'Maximum 10 image URLs allowed' }),
});

// 定义返回结果的类型
type BatchScanResult = Array<{
  url: string;
  status: 'success' | 'error';
  format?: string;
  content?: string;
  message?: string;
  error?: string;
  timestamp?: string;
}>;

const scanQRCodeBatch: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { imageUrls } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info(`Scanning QR codes from ${imageUrls.length} URLs`);

    const results: BatchScanResult = [];

    // 处理每个URL
    for (const imageUrl of imageUrls) {
      try {
        logger.info(`Scanning QR code from URL: ${imageUrl}`);

        // 下载图片数据
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });

        // 获取内容类型
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
          results.push({
            url: imageUrl,
            status: 'error',
            message: 'Failed to fetch or process image',
            error: 'URL does not point to an image',
          });
          continue;
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

          results.push({
            url: imageUrl,
            status: 'success',
            format: 'QR_CODE',
            content: code.data,
            timestamp: new Date().toISOString(),
          });
        } else {
          logger.error('Failed to decode QR code');
          results.push({
            url: imageUrl,
            status: 'error',
            message: 'Failed to decode QR code',
            error: 'No QR code found in image',
          });
        }
      } catch (error: any) {
        logger.error(`Failed to fetch or process image ${imageUrl}`, {
          error: error.message,
        });
        results.push({
          url: imageUrl,
          status: 'error',
          message: 'Failed to fetch or process image',
          error: error.message,
        });
      }
    }

    return JSON.stringify(results);
  },
};

export { scanQRCodeBatch };
