import fs from 'fs/promises';
import path from 'path';
export const uploadFile = async (file: File) => {
  if (process.env.DEBUG) {
    // 图片保存到本地
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadDir = path.resolve(__dirname, '../../uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.resolve(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);
    return {
      success: true,
      message: 'Image saved locally',
      url: `file://${filePath}`,
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('github_token', process.env.GITHUB_TOKEN || '');
  formData.append('github_owner', process.env.GITHUB_OWNER || '');
  formData.append('github_repo', process.env.GITHUB_REPO || '');
  formData.append('github_branch', process.env.GITHUB_BRANCH || 'main');
  formData.append('folder', process.env.FOLDER || 'uploads');

  const response = await fetch('https://picser.pages.dev/api/public-upload', {
    method: 'POST',
    body: formData,
  });

  const data = (await response.json()) as {
    success: boolean;
    message: string;
    data: {
      urls: {
        jsdelivr: string;
      };
    };
  };
  return {
    success: data.success,
    message: data.message,
    url: data.data.urls.jsdelivr,
  };
};
