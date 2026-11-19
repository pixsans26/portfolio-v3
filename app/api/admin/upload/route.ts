import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { convertToWebP } from "@/lib/image-optimizer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);

    // Automatically convert any raster image (PNG, JPG, TIFF, GIF, etc.) to optimized WebP
    const optimized = await convertToWebP(originalBuffer, file.name, {
      quality: 85,
      effort: 4,
    });

    // Generate unique timestamped filename with the optimized extension (.webp or .svg)
    const timestamp = Date.now();
    const fileName = `${timestamp}_${optimized.fileName}`;

    // Target dir: public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, optimized.buffer);

    const publicUrl = `/uploads/${fileName}`;

    const savingsPercent =
      optimized.originalSize > 0
        ? `${Math.max(0, ((optimized.originalSize - optimized.optimizedSize) / optimized.originalSize) * 100).toFixed(1)}%`
        : "0%";

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      format: optimized.format,
      width: optimized.width,
      height: optimized.height,
      originalSize: optimized.originalSize,
      optimizedSize: optimized.optimizedSize,
      savingsPercent,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
