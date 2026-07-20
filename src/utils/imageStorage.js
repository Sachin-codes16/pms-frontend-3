import { API_BASE_URL, AUTH_TOKEN } from "@/constants/api";

function appendTokenIfNeeded(url) {
  try {
    if (!AUTH_TOKEN) return url;
    const hasQuery = url.includes("?");
    return `${url}${hasQuery ? "&" : "?"}token=${encodeURIComponent(AUTH_TOKEN)}`;
  } catch (e) {
    return url;
  }
}

export function resolvePhotoSrc(photo) {
  if (!photo) return "";

  const pick = (val) => {
    if (!val) return "";
    if (typeof val !== "string") return "";
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    if (val.startsWith("/"))
      return appendTokenIfNeeded(`${API_BASE_URL}${val}`);
    return appendTokenIfNeeded(`${API_BASE_URL}/${val}`);
  };

  if (typeof photo === "string") return pick(photo);

  if (photo.url) return pick(photo.url);
  if (photo.path) return pick(photo.path);
  if (photo.fileUrl) return pick(photo.fileUrl);
  if (photo.file) return pick(photo.file);
  if (photo.image) return pick(photo.image);

  if (photo.storageKey)
    return appendTokenIfNeeded(`${API_BASE_URL}/${photo.storageKey}`);
  if (photo.id) return appendTokenIfNeeded(`${API_BASE_URL}/media/${photo.id}`);

  return "";
}

export function normalizePhotosForApi(newBase64Array = []) {
  // API expects an array of objects: { data: '<base64 string without prefix>', name: 'img_123.png' }
  if (!Array.isArray(newBase64Array)) return [];
  return newBase64Array.map((b64, idx) => {
    if (!b64) return null;
    // strip data:*/*;base64, prefix if present
    const parts = String(b64).split(',');
    const raw = parts.length>1 ? parts[1] : parts[0];
    return { data: raw, name: `photo_${Date.now()}_${idx}.png` };
  }).filter(Boolean);
}
