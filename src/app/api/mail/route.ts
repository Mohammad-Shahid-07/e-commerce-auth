import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const {name, email, code } = await request.json();
    if(!name || !email || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const senderMail = process.env.NODEMAILER_EMAIL;
    const senderPass = process.env.NODEMAILER_PASSWORD;

    const transporter = nodemailer.createTransport({
      pool: true,
      service: "hotmail",
      port: 2525,
      auth: {
        user: senderMail,
        pass: senderPass,
      },
      maxConnections: 1,
    });
    await transporter.sendMail({
      from: senderMail,
      to: email,
      subject: "Your Verification Code",
      text: `Hi there ${name}, Your verification code is: ${code}`,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Failed to send email", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
