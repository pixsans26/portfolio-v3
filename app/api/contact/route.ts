import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, type, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Save message to SQLite database
    const savedMessage = await prisma.message.create({
      data: {
        name,
        email,
        company: company || null,
        type: type || "General Enquiry",
        message,
        read: false,
      },
    });

    console.log("[Contact Form Saved to DB]", savedMessage);

    // If RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
        const toEmail = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || "admin@portfolio.com";

        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `New ${type} enquiry from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || "Not provided"}</p>
            <p><strong>Type:</strong> ${type}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br />")}</p>
          `,
        });
      } catch (err) {
        console.error("Resend notification error:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Message sent successfully", id: savedMessage.id });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
