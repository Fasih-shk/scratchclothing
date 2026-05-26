import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { file } = await params;
    const filePathSegment = Array.isArray(file) ? file.join('/') : file;
    
    // Prevent directory traversal attacks
    const safeSuffix = path.normalize(filePathSegment).replace(/^(\.\.(\/|\\|$))+/, '');
    
    const uploadDir = process.env.UPLOAD_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads');
    const absolutePath = path.join(uploadDir, safeSuffix);

    // Read the file from filesystem
    const fileBuffer = await readFile(absolutePath);

    // Get Content-Type based on extension
    const ext = path.extname(absolutePath).toLowerCase();
    const contentTypeMap = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
