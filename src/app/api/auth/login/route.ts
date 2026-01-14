import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}
const secret = new TextEncoder().encode(jwtSecret);

export async function POST(request: NextRequest) {
  try {
    const { id, password } = await request.json();

    // Validate credentials
    if (id !== process.env.ADMIN_ID || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const payload = {
      admin: true,
      sub: "admin",
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set("adminToken", token as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
