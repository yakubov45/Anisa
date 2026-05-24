import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAdmin } from "@/lib/firebase/serverAuth";

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request) {
    const auth = await requireAdmin(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 1. File size validation
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
        }

        // 2. MIME type validation
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
        }

        // 3. Extension validation
        const ext = path.extname(file.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return NextResponse.json({ error: "File extension not allowed" }, { status: 415 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 4. Sanitize filename to prevent path traversal
        const safeName = file.name
            .replace(/[^a-zA-Z0-9.\-_]/g, '-')
            .replace(/\.{2,}/g, '.');
            
        const filename = `${crypto.randomUUID()}-${safeName}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory might already exist
        }

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        return NextResponse.json({ 
            success: true, 
            url: `/uploads/${filename}` 
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
