import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { rateLimit } from "@/lib/rate-limit";

const contactLimiter = rateLimit({ intervalMs: 60 * 60 * 1000, maxRequests: 10 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { nume: 120, email: 254, tel: 40, subiect: 120, mesaj: 5000 };

function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown"
  );
}

function trimField(value, max) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request) {
  const ip = clientIp(request);
  if (!contactLimiter.check(ip)) {
    return NextResponse.json(
      { error: "Ai trimis prea multe mesaje. Te rog încearcă mai târziu." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400 });
  }

  const nume = trimField(body.nume, MAX.nume);
  const email = trimField(body.email, MAX.email);
  const tel = trimField(body.tel, MAX.tel);
  const subiect = trimField(body.subiect, MAX.subiect);
  const mesaj = trimField(body.mesaj, MAX.mesaj);

  if (!nume) {
    return NextResponse.json({ error: "Te rog completează numele." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Te rog verifică adresa de e-mail." }, { status: 400 });
  }
  if (!mesaj) {
    return NextResponse.json({ error: "Te rog scrie un mesaj." }, { status: 400 });
  }

  try {
    await adminDb.collection("contact_messages").add({
      nume,
      email,
      tel: tel || null,
      subiect: subiect || "General",
      mesaj,
      createdAt: FieldValue.serverTimestamp(),
      sourceIp: ip,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact form:", err);
    return NextResponse.json(
      { error: "Nu am putut trimite mesajul. Te rog încearcă din nou sau sună-ne." },
      { status: 500 }
    );
  }
}
