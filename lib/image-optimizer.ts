import sharp from "sharp";
import path from "path";

export interface OptimizedImageResult {
  buffer: Buffer;
  fileName: string;
  originalName: string;
  format: "webp" | "svg";
  contentType: string;
  width?: number;
  height?: number;
  originalSize: number;
  optimizedSize: number;
}

export interface ConvertOptions {
  /**
   * WebP compression quality from 1 to 100 (default: 85)
   */
  quality?: number;
  /**
   * Maximum allowed width in pixels. If larger, scales down while keeping aspect ratio.
   */
  maxWidth?: number;
  /**
   * Maximum allowed height in pixels.
   */
  maxHeight?: number;
  /**
   * Compression effort 0-6 (higher is slower but smaller file, default: 4)
   */
  effort?: number;
}

/**
 * Converts any uploaded image (PNG, JPEG, GIF, TIFF, BMP, AVIF, WebP) to an optimized WebP format.
 * Vector SVGs are preserved as SVG.
 */
export async function convertToWebP(
  inputBuffer: Buffer,
  originalFilename: string,
  options?: ConvertOptions
): Promise<OptimizedImageResult> {
  const originalSize = inputBuffer.length;
  const ext = path.extname(originalFilename).toLowerCase();
  const baseName = path.basename(originalFilename, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/^_+|_+$/g, "") || "image";

  // Vector SVGs should remain SVG
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
    let pipeline = sharp(inputBuffer);

    // Rotate automatically based on EXIF metadata if phone photo
    pipeline = pipeline.rotate();

    // Optional resize to prevent massive 50MB camera uploads from bogging down bandwidth
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
    console.warn(`[image-optimizer] Failed to convert ${originalFilename} to WebP:`, err);
    // Graceful fallback to original buffer if sharp fails on an unexpected format
    return {
      buffer: inputBuffer,
      fileName: `${baseName}${ext || ".png"}`,
      originalName: originalFilename,
      format: ext === ".svg" ? "svg" : "webp",
      contentType: "application/octet-stream",
      originalSize,
      optimizedSize: originalSize,
    };
  }
}
