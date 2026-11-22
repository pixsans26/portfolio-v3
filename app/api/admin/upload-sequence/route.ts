import { NextResponse } from "next/server";
import { writeFile, mkdir, rm } from "fs/promises";
import path from "path";
import JSZip from "jszip";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No ZIP file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(bytes);

    // Target dir: public/sequence
    const sequenceDir = path.join(process.cwd(), "public", "sequence");

    // Clean existing sequence folder
    await rm(sequenceDir, { recursive: true, force: true });
    await mkdir(sequenceDir, { recursive: true });

    // Filter image entries and sort alphabetically
    const imageEntries = Object.keys(zip.files)
      .filter((filename) => {
        const ext = path.extname(filename).toLowerCase();
        return !zip.files[filename].dir && [".png", ".jpg", ".jpeg", ".webp"].includes(ext);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    if (imageEntries.length === 0) {
      return NextResponse.json({ success: false, error: "No image files (.png, .jpg, .webp) found inside ZIP" }, { status: 400 });
    }

    let savedCount = 0;
    for (let i = 0; i < imageEntries.length; i++) {
      const entryName = imageEntries[i];
      const zipFile = zip.files[entryName];
      const rawBuffer = await zipFile.async("nodebuffer");

      const ext = path.extname(entryName).toLowerCase() || ".webp";
      const padNum = String(i + 1).padStart(3, "0");
      const fileName = `frame_${padNum}${ext}`;
      const filePath = path.join(sequenceDir, fileName);

      await writeFile(filePath, rawBuffer);
      savedCount++;
    }

    // Save total frame count in SQLite Settings table
    await prisma.settings.upsert({
      where: { key: "sequence_total_frames" },
      update: { value: JSON.stringify(savedCount) },
      create: { key: "sequence_total_frames", value: JSON.stringify(savedCount) },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully extracted ${savedCount} frames into image sequence!`,
      totalFrames: savedCount,
    });
  } catch (error) {
    console.error("ZIP extraction error:", error);
    return NextResponse.json({ success: false, error: "Failed to extract ZIP sequence" }, { status: 500 });
  }
}
