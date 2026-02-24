import { NextResponse } from 'next/server';

/**
 * Proxy handler for PDF and document files to force inline display
 * instead of download. Wraps Cloudinary URLs and forces content-disposition inline.
 * Handles: PDFs, Word documents (.docx, .doc), and other file types
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Validate it's a cloudinary URL to prevent abuse
    if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
      return NextResponse.json({ error: 'Invalid URL source' }, { status: 403 });
    }

    console.log('Document Proxy - Original URL:', url);

    // Modify Cloudinary URL to prevent download behavior
    let modifiedUrl = url;
    
    // For /raw/upload/ URLs (old uploads), try replacing with /image/upload/
    if (modifiedUrl.includes('/raw/upload/')) {
      modifiedUrl = modifiedUrl.replace('/raw/upload/', '/image/upload/');
      console.log('Document Proxy - Replaced /raw/upload/ with /image/upload/');
    }
    
    // Always add dl=false to prevent Cloudinary download prompts
    if (!modifiedUrl.includes('dl=false') && modifiedUrl.includes('cloudinary.com')) {
      const separator = modifiedUrl.includes('?') ? '&' : '?';
      modifiedUrl = modifiedUrl + separator + 'dl=false';
    }
    
    console.log('Document Proxy - Modified URL:', modifiedUrl);

    // Fetch the file from cloudinary with modified URL
    let response = await fetch(modifiedUrl);

    // If modified URL failed, try original URL
    if (!response.ok && modifiedUrl !== url) {
      console.log('Modified URL failed, fallback to original URL');
      response = await fetch(url);
    }

    if (!response.ok) {
      console.error('Failed to fetch document:', { status: response.status, url, modifiedUrl });
      return NextResponse.json({ error: 'Failed to fetch document' }, { status: response.status });
    }

    // Detect content type from URL or response
    const contentType = detectContentType(url, response.headers.get('content-type'));

    // Get the file buffer
    const buffer = await response.arrayBuffer();

    // Return with inline disposition for all file types
    const headers = new Headers();
    headers.set('content-type', contentType);
    
    // CRITICAL: Force inline display - do NOT set attachment disposition
    // Just 'inline' forces browser to display instead of download
    headers.set('content-disposition', 'inline');
    
    // Additional headers to ensure inline display
    headers.set('cache-control', 'public, max-age=31536000, immutable');
    headers.set('access-control-allow-origin', '*');
    headers.set('x-content-type-options', 'nosniff');
    headers.set('accept-ranges', 'bytes');
    
    // For Word documents, also set header to allow embedding
    if (contentType.includes('wordprocessingml.document') || contentType.includes('msword')) {
      headers.set('x-embed-document', 'true');
    }

    console.log('Document Proxy - Returning file:', { contentType, url });

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Document proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy document' }, { status: 500 });
  }
}

/**
 * Detect content type from URL or response headers
 */
function detectContentType(url: string, responseContentType: string | null): string {
  const lowerUrl = url.toLowerCase();

  // Detect from URL extension - prioritize this
  if (lowerUrl.includes('.pdf') || lowerUrl.includes('type=pdf')) {
    return 'application/pdf';
  }
  if (lowerUrl.includes('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (lowerUrl.includes('.doc')) {
    return 'application/msword';
  }
  if (lowerUrl.includes('.xlsx')) {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  if (lowerUrl.includes('.xls')) {
    return 'application/vnd.ms-excel';
  }
  if (lowerUrl.includes('.pptx')) {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }
  if (lowerUrl.includes('.ppt')) {
    return 'application/vnd.ms-powerpoint';
  }
  if (lowerUrl.includes('.txt')) {
    return 'text/plain';
  }

  // Use response content type if available and sensible
  if (responseContentType && !responseContentType.includes('octet-stream')) {
    return responseContentType;
  }

  // Default for unknown types
  return 'application/octet-stream';
}
