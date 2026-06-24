import { decodeProtectedHeader, importX509, jwtVerify } from "jose";
import { hasEditorAccess } from "@/lib/cms/constants";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let cachedCerts = null;
let cachedAt = 0;
const CACHE_MS = 60 * 60 * 1000;

async function getSessionCookiePublicKeys() {
  const now = Date.now();
  if (cachedCerts && now - cachedAt < CACHE_MS) return cachedCerts;

  const res = await fetch(
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys"
  );
  if (!res.ok) throw new Error("Failed to fetch Firebase session cookie public keys");

  cachedCerts = await res.json();
  cachedAt = now;
  return cachedCerts;
}

/**
 * Verify Firebase session cookie JWT in Edge middleware.
 * Session cookies use identitytoolkit public keys (X.509), not the JWKS endpoint.
 */
export async function verifySessionEdge(token) {
  if (!token || !projectId) return null;

  try {
    const header = decodeProtectedHeader(token);
    if (header.alg !== "RS256" || !header.kid) return null;

    const publicKeys = await getSessionCookiePublicKeys();
    const x509 = publicKeys[header.kid];
    if (!x509) return null;

    const key = await importX509(x509, "RS256");
    const { payload } = await jwtVerify(token, key, {
      issuer: `https://session.firebase.google.com/${projectId}`,
      audience: projectId,
      algorithms: ["RS256"],
    });

    if (!hasEditorAccess(payload.role)) return null;
    return payload;
  } catch {
    return null;
  }
}
