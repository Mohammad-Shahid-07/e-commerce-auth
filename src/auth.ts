"use server";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "./server/db";
import { checkEnvironment } from "./lib/utils";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET is not set in the environment variables");
}
const key = new TextEncoder().encode(secretKey);

interface Session {
  userId: string;
  email: string;
  name: string;
  exp: number;
}

const createVerificationCode = () =>
  Math.floor(10000000 + Math.random() * 90000000).toString();

async function encrypt(payload: Omit<Session, "exp">) {
  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 6;
  return new SignJWT({ ...payload, exp: expirationTime })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("6h")
    .sign(key);
}

async function decrypt(input: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
    const session = payload as unknown as Session;

    if (
      typeof session.userId === "string" &&
      typeof session.email === "string" &&
      typeof session.name === "string" &&
      typeof session.exp === "number"
    ) {
      return session;
    }
    return null;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export async function signup(input: z.infer<typeof signupSchema>) {
  try {
    const { email, name, password } = signupSchema.parse(input);

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      if (existingUser.verified) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      } else {
        const newVerificationCode = createVerificationCode();
        await db.user.update({
          where: { email },
          data: { verificationCode: newVerificationCode },
        });
        const res = await sendVerificationEmail(
          name,
          email,
          newVerificationCode,
        );
        return res;
      }
    }

    const verificationCode = createVerificationCode();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        verificationCode,
        verified: false,
      },
    });

    const res = await sendVerificationEmail(name, email, verificationCode);

    return res;
  } catch (error: unknown) {
    return handleError(error);
  }
}

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(8),
});

export async function verifyCode(input: z.infer<typeof verifyCodeSchema>) {
  try {
    const { email, code } = verifyCodeSchema.parse(input);
    const user = await db.user.findUnique({ where: { email } });

    if (!user || user.verificationCode !== code) {
      throw new Error("Invalid verification code");
    }

    await db.user.update({
      where: { email },
      data: { verificationCode: null, verified: true },
    });

    return { success: true, message: "Verification successful" };
  } catch (error) {
    return handleError(error);
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function login(input: z.infer<typeof loginSchema>) {
  try {
    const { email, password } = loginSchema.parse(input);
    const user = await db.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: "Invalid email or password" };
    }

    if (!user.verified) {
      return { success: false, message: "User not verified" };
    }

    const session = await encrypt({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    cookies().set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, message: "You are logged in now" };
  } catch (error) {
    return handleError(error);
  }
}

export async function logout() {
  cookies().set("session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  const decryptedSession = await decrypt(session);
  if (decryptedSession && decryptedSession.exp * 1000 > Date.now()) {
    return decryptedSession;
  }
  await logout(); // Expired session, log out the user
  return null;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  try {
    const parsed = await decrypt(session);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.exp * 1000 <= Date.now()
    ) {
      throw new Error("Invalid or expired session data");
    }

    const newSession = await encrypt({
      userId: parsed.userId,
      email: parsed.email,
      name: parsed.name,
    });

    const res = NextResponse.next();
    res.cookies.set("session", newSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return res;
  } catch (error) {
    console.error("Session update failed:", error);
    return NextResponse.next();
  }
}

async function sendVerificationEmail(
  name: string,
  email: string,
  code: string,
) {
  try {
    const res = await fetch(checkEnvironment().concat("/api/mail"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, code }),
    });
    if (!res.ok) {
      throw new Error("Failed to send email");
    }
    return {
      success: true,
      message: "Check your email for the verification code",
    };
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown) {
  console.error("Error:", error);
  return { success: false, message: (error as Error).message };
}
