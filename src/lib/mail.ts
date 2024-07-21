import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
const senderMail = process.env.NODEMAILER_EMAIL;

const transporter = nodemailer.createTransport({
  pool: true,
  service: "hotmail",
  port: 2525,
  auth: {
    user: senderMail,
    pass: "xbZOUsUWMmLF8kiufHypv+GfkphQmenkCG3HaPmkUw8=",
  },
  maxConnections: 1,
});
export async function sendVerificationEmail(email: string, code: string) {
  await transporter.sendMail({
    from: senderMail,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  });
}
