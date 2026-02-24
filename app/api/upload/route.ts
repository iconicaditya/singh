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
      const fileName = file.name.toLowerCase();
      const isPdf = fileName.endsWith('.pdf');
      const isWord = fileName.endsWith('.docx') || fileName.endsWith('.doc');
      
      const { searchParams } = new URL(req.url);
      const folder = searchParams.get('folder') || 'research';
      
      console.log('📤 Uploading to Cloudinary:', { folder, isPdf, isWord, fileName: file.name });

      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'auto',
          folder: folder,
          access_mode: 'public',
          content_type: isPdf 
            ? 'application/pdf' 
            : isWord 
              ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : undefined
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary Error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary Success. URL:', result?.secure_url);
            resolve(result);
          }
        }
      ).end(buffer);
    });

    if (!uploadResponse || !uploadResponse.secure_url) {
      console.error('❌ No secure_url in upload response:', uploadResponse);
      return NextResponse.json({ error: 'Upload succeeded but no URL returned' }, { status: 500 });
    }

    return NextResponse.json(uploadResponse);
  } catch (error) {
    console.error('❌ Upload Error:', error);
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
