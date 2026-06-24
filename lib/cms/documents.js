/** Max PDF upload size enforced in Storage rules and client-side (15 MB). */
export const MAX_PDF_BYTES = 15 * 1024 * 1024;

export function pdfStoragePath(docId) {
  return `uploads/documente/${docId}/document.pdf`;
}

export function formatPdfUploadError(err) {
  const code = err?.code || "";
  if (code === "storage/unauthorized" || code === "storage/permission-denied") {
    return "Nu ai permisiunea să încarci documente. Te rog reconectează-te.";
  }
  if (code === "storage/canceled") {
    return "Încărcarea a fost anulată.";
  }
  if (code === "storage/quota-exceeded") {
    return "Spatiul de stocare este plin. Contactează administratorul site-ului.";
  }
  if (err?.message?.includes("15 MB") || err?.message?.includes("prea mare")) {
    return err.message;
  }
  return "Nu am putut încărca PDF-ul. Te rog încearcă din nou cu un alt fișier.";
}
