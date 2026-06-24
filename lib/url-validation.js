/** Returns true for empty values or valid https URLs (max 2048 chars). */
export function isSafeHttpsUrl(url) {
  if (!url || typeof url !== "string") return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.length > 2048) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Google Maps embed iframe src only. */
export function isSafeMapsEmbedUrl(url) {
  if (!url || typeof url !== "string") return true;
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.length > 2048) return false;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "https:") return false;
    const host = u.hostname.replace(/^www\./, "");
    return host === "google.com" && u.pathname.startsWith("/maps/embed");
  } catch {
    return false;
  }
}

export function sanitizeHttpsUrl(url) {
  if (!url) return "";
  const trimmed = String(url).trim();
  return isSafeHttpsUrl(trimmed) ? trimmed : "";
}

export function sanitizeMapsEmbedUrl(url) {
  if (!url) return "";
  const trimmed = String(url).trim();
  return isSafeMapsEmbedUrl(trimmed) ? trimmed : "";
}

/** TipTap / rich-text link href — http or https only. */
export function isSafeLinkHref(href) {
  if (!href || typeof href !== "string") return false;
  const trimmed = href.trim();
  if (!trimmed || trimmed.length > 2048) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
