const PREFIX = "admin:list:";

export function readAdminListCache(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${PREFIX}${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeAdminListCache(key, items) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${PREFIX}${key}`, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — ignore.
  }
}
