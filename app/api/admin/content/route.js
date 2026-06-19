import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getContent, saveContent, SECTIONS } from "@/lib/content";
import { revalidatePath } from "next/cache";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (!section || !SECTIONS[section]) {
    return NextResponse.json({ error: "Secțiune invalidă" }, { status: 400 });
  }

  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const data = await getContent(section);
  return NextResponse.json(data);
}

export async function PUT(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }

  const { section, data } = await request.json();

  if (!section || !SECTIONS[section]) {
    return NextResponse.json({ error: "Secțiune invalidă" }, { status: 400 });
  }

  await saveContent(section, data);

  for (const p of SECTIONS[section].paths) {
    revalidatePath(p);
  }

  return NextResponse.json({ ok: true });
}
