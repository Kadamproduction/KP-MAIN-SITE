import { NextResponse } from 'next/server';
import { vercelDb } from '@/utils/vercelDb';
import { del } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const { 
      token, 
      settings, 
      images, 
      videos, 
      serviceImages, 
      adminCredentials,
      deletedUrls 
    } = await request.json();

    // 1. Verify token session validity
    if (!token) {
      return NextResponse.json({ error: 'Token missing.' }, { status: 401 });
    }
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (Date.now() > payload.exp) {
        return NextResponse.json({ error: 'Admin session expired. Please log in again.' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token.' }, { status: 401 });
    }

    // 2. Perform updates to Vercel KV
    if (settings) {
      await vercelDb.setSettings(settings);
    }
    if (images) {
      await vercelDb.setImages(images);
    }
    if (videos) {
      await vercelDb.setVideos(videos);
    }
    if (serviceImages) {
      await vercelDb.setServices(serviceImages);
    }
    if (adminCredentials) {
      await vercelDb.setCredentials(adminCredentials);
    }

    // 3. Clean up deleted files from Vercel Blob if urls are provided
    if (deletedUrls && Array.isArray(deletedUrls) && deletedUrls.length > 0) {
      console.log('Cleaning up deleted files from Vercel Blob:', deletedUrls);
      for (const url of deletedUrls) {
        try {
          if (url.includes('public.blob.vercel-storage.com') || url.includes('vercel-storage.com')) {
            await del(url);
          }
        } catch (err) {
          console.warn('Vercel Blob delete warning for:', url, err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
