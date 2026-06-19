import fs from "fs/promises";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const SECTIONS = {
  site: { label: "Informații generale", paths: ["/", "/contact"] },
  home: { label: "Pagina principală", paths: ["/"] },
  anunturi: { label: "Anunțuri", paths: ["/anunturi"] },
  echipa: { label: "Echipa", paths: ["/echipa"] },
  conducere: { label: "Conducere", paths: ["/conducere"] },
};

export async function getSiteConfig() {
  return getContent("site");
}

export async function getContent(section) {
  const filePath = path.join(CONTENT_DIR, `${section}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function saveContent(section, data) {
  if (!SECTIONS[section]) {
    throw new Error(`Unknown section: ${section}`);
  }
  const filePath = path.join(CONTENT_DIR, `${section}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}
