import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Allowed upload extensions
const ALLOWED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".pdf",
]);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Determine extension
    let ext = path.extname(file.name).toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      // If MIME type indicates image/png, etc.
      if (file.type === "image/png") ext = ".png";
      else if (file.type === "image/jpeg") ext = ".jpg";
      else if (file.type === "image/webp") ext = ".webp";
      else if (file.type === "image/gif") ext = ".gif";
      else if (file.type === "image/svg+xml") ext = ".svg";
      else if (file.type === "image/avif") ext = ".avif";
      else ext = ".jpg"; // safe default
    }

    // Sanitize base filename
    const rawBase = path.basename(file.name, path.extname(file.name));
    const cleanBase =
      rawBase
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 60) || "photo";

    // Create unique timestamped filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${cleanBase}${ext}`;

    // Target upload directory: public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Read bytes from the uploaded file and write directly
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: buffer.length,
      format: ext.replace(".", ""),
    });
  } catch (error) {
    console.error("Direct upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}
