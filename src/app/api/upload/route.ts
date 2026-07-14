import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/utils/s3';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') || 'upload.bin';

  try {
    if (!request.body) {
      return NextResponse.json({ error: 'Request body is empty.' }, { status: 400 });
    }

    // Convert request body stream to buffer
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: request.headers.get('content-type') || 'application/octet-stream',
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
