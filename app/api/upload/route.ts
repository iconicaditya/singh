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
      // Determine resource type based on file extension
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      
      cloudinary.uploader.upload_stream(
        { 
          resource_type: isPdf ? 'raw' : 'auto', 
          folder: 'research',
          access_mode: 'public'
          // Removed attachment flag to allow browser-native viewing
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
