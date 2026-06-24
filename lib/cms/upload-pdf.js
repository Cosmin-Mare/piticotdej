import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getClientStorage } from "@/lib/firebase/client";
import { MAX_PDF_BYTES, pdfStoragePath, formatPdfUploadError } from "@/lib/cms/documents";

function validateFile(file) {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    throw new Error("Te rog alege un fișier PDF.");
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("Fișierul este prea mare. Te rog alege un PDF mai mic de 15 MB.");
  }
}

/**
 * Upload PDF to Storage and return its public download URL.
 */
export async function uploadDocumentPdf(docId, file) {
  validateFile(file);

  const storage = getClientStorage();
  if (!storage) throw new Error("Firebase nu este disponibil.");

  const path = pdfStoragePath(docId);
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, {
    contentType: "application/pdf",
    customMetadata: { docId },
  });

  return getDownloadURL(storageRef);
}

export { formatPdfUploadError };
