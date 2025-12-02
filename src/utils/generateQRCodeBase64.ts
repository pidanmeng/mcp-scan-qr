import QRCode from 'qrcode';

async function generateQRCodeBase64(text: string): Promise<string> {
  try {
    // 生成二维码的base64数据URL
    const base64DataUrl = await QRCode.toDataURL(text, {
      margin: 0,
      color: {
        dark: '#000000',
        light: '#ffffff00', // 透明背景
      },
    });
    return base64DataUrl;
  } catch (err) {
    console.error('生成二维码失败:', err);
    throw err;
  }
}

export { generateQRCodeBase64 };
