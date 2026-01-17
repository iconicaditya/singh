import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'auto', 
          folder: 'research',
          access_mode: 'public',
          // Explicitly set flags to ensure public access and browser viewing
          flags: 'attachment:false'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Stream Error:', error);
            reject(error);
          }
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
