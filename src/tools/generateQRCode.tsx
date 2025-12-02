import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { uploadFile } from '../utils/upload';
import { useLogger } from '../utils/logger';
import satori from 'satori';
import { StandardQRCode } from '../template/standardQRCode';
import sharp from 'sharp';

const _DIRNAME = __dirname ? __dirname : resolve();

const name = '生成二维码';
const description = '根据文本信息生成二维码图片';
const parameters = z.object({
  content: z
    .string()
    .min(1, { message: 'Content cannot be empty' })
    .describe('二维码内容'),
  title: z.string().optional().describe('二维码标题'),
  subtitle: z.string().optional().describe('二维码副标题'),
  logo: z.string().optional().describe('二维码logo 图片URL'),
  style: z
    .enum(['alipay', 'wechat', 'standard'])
    .optional()
    .describe('二维码样式(可选值: alipay, wechat, standard)'),
});

const STYLE_COLOR_MAP = Object.freeze({
  alipay: '#1677FF',
  wechat: '#07C160',
  standard: '#222',
});

const generateQRCode: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { log } = context;
    const logger = useLogger(log);
    try {
      const { style = 'alipay' } = args;
      const mainColor = STYLE_COLOR_MAP[style];

      const Element = (
        <StandardQRCode
          content={args.content}
          subtitle={args.subtitle}
          title={args.title}
          logoUrl={args.logo}
          mainColor={mainColor}
        />
      );

      const svg = await satori(Element, {
        width: 800,
        fonts: [
          {
            name: 'Inter',
            data: readFileSync(resolve(_DIRNAME, '../fonts/Inter-Medium.woff')),
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: readFileSync(resolve(_DIRNAME, '../fonts/Inter-Bold.woff')),
            weight: 700,
            style: 'normal',
          },
          {
            name: 'Wei-ruan-ya-hei',
            data: readFileSync(resolve(_DIRNAME, '../fonts/微软雅黑.ttf')),
            weight: 900,
            style: 'normal',
          },
        ],
      });
      logger.info('Generated SVG length: ' + svg.length);
      const sharpJPG = await sharp(Buffer.from(svg)).jpeg();
      const uuid = crypto.randomUUID();

      const file = new File([await sharpJPG.toBuffer()], `${uuid}.jpg`, {
        type: 'image/jpeg',
      });
      const result = await uploadFile(file);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return JSON.stringify(
        {
          success: false,
          message: (error as Error).message,
        },
        null,
        2
      );
    }
  },
};

export { generateQRCode };
