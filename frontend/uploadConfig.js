/* ---------------------------------------------------------------
   DOCUMENT UPLOAD CONFIG & HELPERS
----------------------------------------------------------------*/
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB per file
export const MAX_UPLOADS = 8;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
