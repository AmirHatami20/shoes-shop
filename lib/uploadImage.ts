import { UploadClient } from "@uploadcare/upload-client";

const client = new UploadClient({
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY || process.env.UPLOADCARE_PUB_KEY || "",
});

export async function uploadImage(file: File): Promise<string> {
    if (!file) throw new Error("No file provided");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await client.uploadFile(buffer, {
        fileName: file.name,
        contentType: file.type,
    });

    return `https://ucarecdn.com/${result.uuid}/`;
}
