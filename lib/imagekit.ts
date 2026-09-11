import ImageKit from 'imagekit';

// Check if ImageKit credentials are configured in environment
export const isImageKitConfigured = (): boolean => {
  return Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  );
};

let imageKitInstance: ImageKit | null = null;

export const getImageKit = (): ImageKit | null => {
  if (!isImageKitConfigured()) {
    return null;
  }

  if (!imageKitInstance) {
    imageKitInstance = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    });
  }

  return imageKitInstance;
};

export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl?: string;
}

/**
 * Uploads a file buffer directly to ImageKit CDN storage.
 */
export async function uploadToImageKit(
  buffer: Buffer,
  fileName: string,
  folder: string = '/postnest/blog'
): Promise<ImageKitUploadResult> {
  const imagekit = getImageKit();
  if (!imagekit) {
    throw new Error('ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env');
  }

  const response = await imagekit.upload({
    file: buffer.toString('base64'),
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: response.url,
    fileId: response.fileId,
    name: response.name,
    thumbnailUrl: response.thumbnailUrl,
  };
}
