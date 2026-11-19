import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isAuth = await verifyAdminSession();
    if (isAuth) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.com";
      return NextResponse.json(
        {
          authenticated: true,
          user: { email: adminEmail, name: "Portfolio Admin" },
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }
    return NextResponse.json(
      { authenticated: false },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
