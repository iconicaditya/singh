const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCVUploadAndDownload() {
  try {
    console.log('🧪 Testing CV Upload & Download Flow\n');
    
    // Create a simple PDF for testing
    const testPdfPath = path.join(process.cwd(), 'test-cv.pdf');
    
    // Create a minimal PDF if it doesn't exist
    if (!fs.existsSync(testPdfPath)) {
      console.log('📝 Creating test PDF...');
      const minimalPdf = Buffer.from([
        0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a,
        0x31, 0x20, 0x30, 0x20, 0x6f, 0x62, 0x6a, 0x0a, 0x3c, 0x3c, 0x20, 0x2f, 0x54, 0x79, 0x70,
        0x65, 0x20, 0x2f, 0x43, 0x61, 0x74, 0x61, 0x6c, 0x6f, 0x67, 0x20, 0x2f, 0x50, 0x61, 0x67,
        0x65, 0x73, 0x20, 0x32, 0x20, 0x30, 0x20, 0x52, 0x20, 0x3e, 0x3e, 0x0a, 0x65, 0x6e, 0x64,
        0x6f, 0x62, 0x6a, 0x0a, 0x32, 0x20, 0x30, 0x20, 0x6f, 0x62, 0x6a, 0x0a, 0x3c, 0x3c, 0x20,
        0x2f, 0x54, 0x79, 0x70, 0x65, 0x20, 0x2f, 0x50, 0x61, 0x67, 0x65, 0x73, 0x20, 0x2f, 0x4b,
        0x69, 0x64, 0x73, 0x20, 0x5b, 0x33, 0x20, 0x30, 0x20, 0x52, 0x5d, 0x20, 0x2f, 0x43, 0x6f,
        0x75, 0x6e, 0x74, 0x20, 0x31, 0x20, 0x3e, 0x3e, 0x0a, 0x65, 0x6e, 0x64, 0x6f, 0x62, 0x6a,
        0x0a, 0x78, 0x72, 0x65, 0x66, 0x0a, 0x30, 0x20, 0x33, 0x0a, 0x30, 0x30, 0x30, 0x30, 0x30,
        0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x36, 0x35, 0x35, 0x33, 0x35, 0x20, 0x66, 0x20, 0x0a,
        0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x39, 0x37, 0x35, 0x20, 0x30, 0x30, 0x30, 0x30,
        0x30, 0x20, 0x6e, 0x20, 0x0a, 0x30, 0x30, 0x30, 0x30, 0x30, 0x31, 0x30, 0x35, 0x32, 0x20,
        0x30, 0x30, 0x30, 0x30, 0x30, 0x20, 0x6e, 0x20, 0x0a, 0x74, 0x72, 0x61, 0x69, 0x6c, 0x65,
        0x72, 0x0a, 0x3c, 0x3c, 0x20, 0x2f, 0x53, 0x69, 0x7a, 0x65, 0x20, 0x33, 0x20, 0x2f, 0x52,
        0x6f, 0x6f, 0x74, 0x20, 0x31, 0x20, 0x30, 0x20, 0x52, 0x20, 0x3e, 0x3e, 0x0a, 0x73, 0x74,
        0x61, 0x72, 0x74, 0x78, 0x72, 0x65, 0x66, 0x0a, 0x31, 0x31, 0x37, 0x39, 0x0a, 0x25, 0x45,
        0x4f, 0x46, 0x0a
      ]);
      fs.writeFileSync(testPdfPath, minimalPdf);
      console.log('✅ Test PDF created:', testPdfPath, `(${minimalPdf.length} bytes)`);
    } else {
      console.log('📄 Using existing test PDF:', testPdfPath);
    }

    // Step 1: Upload CV
    console.log('\n--- Step 1: Upload CV ---');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testPdfPath));

    const uploadRes = await fetch('http://localhost:3000/api/upload?folder=people', {
      method: 'POST',
      body: formData,
    });

    console.log('📊 Upload Response Status:', uploadRes.status);
    const uploadData = await uploadRes.json();
    
    if (!uploadData.secure_url) {
      console.error('❌ Upload failed! Response:', uploadData);
      process.exit(1);
    }

    const cvUrl = uploadData.secure_url;
    console.log('✅ Upload successful!');
    console.log('📍 Cloudinary URL:', cvUrl);

    // Step 2: Download CV via our API
    console.log('\n--- Step 2: Download CV via /api/cv-download ---');
    const downloadRes = await fetch(`http://localhost:3000/api/cv-download?url=${encodeURIComponent(cvUrl)}`);
    
    console.log('📊 Download Response Status:', downloadRes.status);
    console.log('📋 Response Headers:', {
      contentType: downloadRes.headers.get('content-type'),
      contentLength: downloadRes.headers.get('content-length'),
      contentDisposition: downloadRes.headers.get('content-disposition'),
    });

    const buffer = await downloadRes.buffer();
    console.log('📦 Downloaded File Size:', buffer.length, 'bytes');

    if (buffer.length > 0) {
      console.log('✅ Download successful! File has content.');
      // Save to disk for inspection
      fs.writeFileSync('downloaded-cv.pdf', buffer);
      console.log('💾 Saved as downloaded-cv.pdf');
    } else {
      console.error('❌ Download returned empty file!');
    }

    // Step 3: Test direct Cloudinary URL
    console.log('\n--- Step 3: Direct Cloudinary URL Test ---');
    const directRes = await fetch(cvUrl);
    console.log('📊 Direct Response Status:', directRes.status);
    console.log('📋 Direct Response Headers:', {
      contentType: directRes.headers.get('content-type'),
      contentLength: directRes.headers.get('content-length'),
    });
    
    const directBuffer = await directRes.buffer();
    console.log('📦 Direct Download Size:', directBuffer.length, 'bytes');

    if (directBuffer.length > 0) {
      console.log('✅ Direct Cloudinary URL works!');
    } else {
      console.error('❌ Direct Cloudinary URL returns empty!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testCVUploadAndDownload();
