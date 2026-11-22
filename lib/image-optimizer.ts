import path from "path";

export interface OptimizedImageResult {
  buffer: Buffer;
  fileName: string;
  originalName: string;
  format: "webp" | "svg" | string;
  contentType: string;
  width?: number;
  height?: number;
  originalSize: number;
  optimizedSize: number;
}

export interface ConvertOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  effort?: number;
}

/**
 * Attempts to convert image to WebP if sharp is available, otherwise returns original buffer safely.
 */
export async function convertToWebP(
  inputBuffer: Buffer,
  originalFilename: string,
  options?: ConvertOptions
): Promise<OptimizedImageResult> {
  const originalSize = inputBuffer.length;
  const ext = path.extname(originalFilename).toLowerCase();
  const baseName =
    path
      .basename(originalFilename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/^_+|_+$/g, "") || "image";

  if (ext === ".svg") {
    return {
      buffer: inputBuffer,
      fileName: `${baseName}.svg`,
      originalName: originalFilename,
      format: "svg",
      contentType: "image/svg+xml",
      originalSize,
      optimizedSize: originalSize,
    };
  }

  try {
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;

    let pipeline = sharp(inputBuffer).rotate();

    const maxWidth = options?.maxWidth ?? 2560;
    const maxHeight = options?.maxHeight ?? 2560;

    pipeline = pipeline.resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });

    const quality = options?.quality ?? 85;
    const effort = options?.effort ?? 4;

    const webpBuffer = await pipeline
      .webp({
        quality,
        effort,
        smartSubsample: true,
      })
      .toBuffer();

    const metadata = await sharp(webpBuffer).metadata();

    return {
      buffer: webpBuffer,
      fileName: `${baseName}.webp`,
      originalName: originalFilename,
      format: "webp",
      contentType: "image/webp",
      width: metadata.width,
      height: metadata.height,
      originalSize,
      optimizedSize: webpBuffer.length,
    };
  } catch (err) {
    console.warn(`[image-optimizer] Sharp conversion skipped or unavailable for ${originalFilename}:`, err);
    return {
      buffer: inputBuffer,
      fileName: `${baseName}${ext || ".png"}`,
      originalName: originalFilename,
      format: ext ? ext.replace(".", "") : "png",
      contentType: "application/octet-stream",
      originalSize,
      optimizedSize: originalSize,
    };
  }
}
