import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// MIME types lookup for image and media formats
const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const fileSegments = resolvedParams.file;

    if (!fileSegments || fileSegments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Sanitize path against directory traversal
    const relativePath = fileSegments.join("/");
    const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
    if (normalized.includes("..")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Path in public/uploads
    const filePath = path.join(process.cwd(), "public", "uploads", normalized);

    // Verify file existence
    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        return new NextResponse("Not Found", { status: 404 });
      }
    } catch {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Read and stream file buffer
    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
