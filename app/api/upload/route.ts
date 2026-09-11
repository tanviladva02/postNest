import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';
import { isImageKitConfigured, uploadToImageKit } from '@/lib/imagekit';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB (supported by ImageKit)

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required to upload images.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, WebP, GIF, or SVG image.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds limit of 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30);
    const sanitizedName = `${cleanBase || 'post-image'}-${Date.now()}${ext}`;

    // 1. Primary: Upload to ImageKit if configured
    if (isImageKitConfigured()) {
      try {
        const imageKitResult = await uploadToImageKit(buffer, sanitizedName, '/postnest/blog');
        console.info(`[ImageKit] Successfully uploaded image to CDN: ${imageKitResult.url}`);

        return NextResponse.json({
          success: true,
          url: imageKitResult.url,
          fileName: imageKitResult.name,
          provider: 'imagekit',
        });
      } catch (ikError: any) {
        console.error('[ImageKit Upload Error]:', ikError);
        // If ImageKit fails with invalid keys, fall back to local disk or return error
      }
    }

    // 2. Fallback: Save to local public/uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const uniqueLocalName = `${cleanBase || 'image'}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, uniqueLocalName);
    await writeFile(filePath, buffer);

    const localUrl = `/uploads/${uniqueLocalName}`;
    console.info(`[LocalStorage] Saved image locally: ${localUrl}`);

    return NextResponse.json({
      success: true,
      url: localUrl,
      fileName: uniqueLocalName,
      provider: 'local',
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process image upload.' },
      { status: 500 }
    );
  }
}
