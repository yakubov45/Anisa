import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
});

export async function POST(req) {
    try {
        const { filename, contentType, folder = "products" } = await req.json();

        if (!filename) {
            return NextResponse.json({ error: "Filename is required" }, { status: 400 });
        }

        // Clean filename and add timestamp to prevent overwriting
        const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
        const key = `${folder}/${Date.now()}-${cleanName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType || "application/octet-stream",
            CacheControl: "public, max-age=31536000, immutable",
        });

        // Generate a pre-signed URL valid for 5 minutes
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

        return NextResponse.json({ signedUrl, publicUrl, key });
    } catch (error) {
        console.error("Presigned URL error:", error);
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }
}
