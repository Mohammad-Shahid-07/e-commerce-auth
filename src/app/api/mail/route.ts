import { NextResponse } from "next/server";
import { Recipient, EmailParams, MailerSend, Sender } from "mailersend";

interface RequestBody {
  email: string;
  code: string;
  name: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { email, code, name } = (await request.json()) as RequestBody;

    if (!email || !code || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const mailersend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY!,
    });

    const sentFrom = new Sender(
      "contact@trial-zr6ke4nqmje4on12.mlsender.net",
      "Mohammad Shaid",
    );

    const recipients = [new Recipient(email, name)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Your Verification Code")
      .setHtml(`<strong>Your verification code is: ${code}</strong>`)
      .setText(`Your verification code is: ${code}`);

    await mailersend.email.send(emailParams);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Failed to send email");
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
