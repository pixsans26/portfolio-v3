import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ success: false, error: "New password must be at least 4 characters long" }, { status: 400 });
    }

    // Get current stored password
    const passSetting = await prisma.settings.findUnique({ where: { key: "admin_password" } });
    const validPassword = passSetting ? JSON.parse(passSetting.value) : (process.env.ADMIN_PASSWORD || "admin123");

    if (String(currentPassword) !== String(validPassword)) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });
    }

    // Update password in SQLite Settings table
    await prisma.settings.upsert({
      where: { key: "admin_password" },
      update: { value: JSON.stringify(newPassword) },
      create: { key: "admin_password", value: JSON.stringify(newPassword) },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ success: false, error: "Failed to change password" }, { status: 500 });
  }
}
