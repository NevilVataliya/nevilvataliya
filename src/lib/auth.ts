import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}
const secret = new TextEncoder().encode(jwtSecret);

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

    if (!token) {
      return false;
    }

    const payload = await verifyAuth(token);
    return payload !== null;
  } catch (error) {
    return false;
  }
}
