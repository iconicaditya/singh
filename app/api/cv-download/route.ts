import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      console.error('❌ No URL');
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    const cvUrl = decodeURIComponent(url);
    console.log('📥 CV Download Start');
    console.log('URL:', cvUrl);

    // Ensure it's a valid Cloudinary URL
    if (!cvUrl.includes('cloudinary.com')) {
      console.error('❌ Invalid URL - not from Cloudinary');
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Fetch the file from Cloudinary
    console.log('🔗 Fetching from Cloudinary...');
    const response = await fetch(cvUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    });
    
    console.log('📊 Response Status:', response.status, response.statusText);
    console.log('📋 Headers:', {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      contentDisposition: response.headers.get('content-disposition'),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Non-200 Response:', text.substring(0, 200));
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('✅ Arraylength:', arrayBuffer.byteLength, 'bytes');

    if (arrayBuffer.byteLength === 0) {
      console.error('❌ File is empty!');
      return NextResponse.json({ error: 'File is empty' }, { status: 500 });
    }

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="CV.pdf"',
        'content-length': arrayBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
