import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/utils/s3';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'upload.bin';

  try {
    if (!request.body) {
      return NextResponse.json({ error: 'Request body is empty.' }, { status: 400 });
    }

    // Convert request body stream to buffer
    const arrayBuffer = await request.arrayBuffer();
    let buffer: any = Buffer.from(arrayBuffer);
    let contentType = request.headers.get('content-type') || 'application/octet-stream';

    const ext = path.extname(filename).toLowerCase();
    
    // Automatically compress images (png, jpg, jpeg) on upload if they exceed 200 KB
    if (['.png', '.jpg', '.jpeg'].includes(ext) && buffer.length > 200 * 1024) {
      try {
        console.log(`Automatically compressing uploaded image: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
        let pipeline = sharp(buffer).resize({ width: 1920, withoutEnlargement: true });
        
        if (ext === '.png') {
          buffer = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
          contentType = 'image/png';
        } else {
          buffer = await pipeline.jpeg({ quality: 80, progressive: true }).toBuffer();
          contentType = 'image/jpeg';
        }
        console.log(`Compressed to: ${(buffer.length / 1024).toFixed(1)} KB`);
      } catch (sharpError) {
        console.warn('Image compression failed, uploading raw file instead:', sharpError);
      }
    }

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    });

    await s3.send(command);

    // Return the response matching @vercel/blob schema
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${filename}`;
    return NextResponse.json({ url: fileUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
