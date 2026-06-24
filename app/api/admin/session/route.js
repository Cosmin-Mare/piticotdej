import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import {
  createSessionCookie,
  sessionCookieOptions,
  clearSessionCookieOptions,
  verifySession,
} from "@/lib/auth";
import { hasEditorAccess } from "@/lib/cms/constants";
import { rateLimit } from "@/lib/rate-limit";

const loginLimiter = rateLimit({ intervalMs: 15 * 60 * 1000, maxRequests: 20 });
const sessionLimiter = rateLimit({ intervalMs: 60 * 1000, maxRequests: 60 });

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown"
  );
}

export async function GET(request) {
  const ip = clientIp(request);
  if (!sessionLimiter.check(ip)) {
    return NextResponse.json({ error: "Prea multe cereri." }, { status: 429 });
  }

  const decoded = await verifySession();
  if (!decoded) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }
  const customToken = await adminAuth.createCustomToken(decoded.uid);
  return NextResponse.json({
    customToken,
    email: decoded.email,
    role: decoded.role,
  });
}

export async function POST(request) {
  const ip = clientIp(request);
  if (!loginLimiter.check(ip)) {
    return NextResponse.json(
      { error: "Prea multe încercări de autentificare. Încearcă din nou peste câteva minute." },
      { status: 429 }
    );
  }

  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Token lipsă." }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!hasEditorAccess(decoded.role)) {
      return NextResponse.json(
        { error: "Contul tău nu are acces la panoul de administrare." },
        { status: 403 }
      );
    }

    const sessionCookie = await createSessionCookie(idToken);
    const response = NextResponse.json({
      ok: true,
      role: decoded.role,
      email: decoded.email,
    });
    response.cookies.set(sessionCookieOptions(sessionCookie));
    return response;
  } catch {
    return NextResponse.json({ error: "Autentificare eșuată." }, { status: 401 });
  }
}

export async function DELETE() {
  cookies().set(clearSessionCookieOptions());
  return NextResponse.json({ ok: true });
}
