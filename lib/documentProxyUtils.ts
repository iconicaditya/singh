/**
 * Converts a Cloudinary document URL to use the local proxy
 * This ensures PDFs and documents display inline instead of downloading
 */
export function getDocumentProxyUrl(cloudinaryUrl: string): string {
  if (!cloudinaryUrl) return '';

  // Normalize the URL to ensure it's a full URL
  let url = cloudinaryUrl.trim();
  
  // If it's a cloudinary URL (full or partial), use our proxy
  if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
    // Ensure it's a full URL
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    const encodedUrl = encodeURIComponent(url);
    const proxyUrl = `/api/document-proxy?url=${encodedUrl}`;
    console.log('Document Proxy - Transforming URL:', { original: cloudinaryUrl, proxy: proxyUrl });
    return proxyUrl;
  }

  // If it's already a proxy URL, return as-is
  if (url.includes('/api/document-proxy')) {
    return url;
  }

  // If it's an external URL (http/https), return as-is
  if (url.startsWith('http')) {
    return url;
  }

  // If it's a relative URL, return as-is
  return url;
}

/**
 * Checks if a URL is a PDF or document that should be displayed inline
 */
export function isDocumentUrl(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes('.pdf') ||
    lowerUrl.includes('.docx') ||
    lowerUrl.includes('.doc') ||
    lowerUrl.includes('type=pdf') ||
    lowerUrl.includes('type=document') ||
    lowerUrl.includes('/raw/upload/') ||
    lowerUrl.includes('/documents/') ||
    lowerUrl.includes('/uploads/') ||
    lowerUrl.includes('/cv') ||
    lowerUrl.includes('/research') ||
    lowerUrl.includes('/publication')
  );
}
