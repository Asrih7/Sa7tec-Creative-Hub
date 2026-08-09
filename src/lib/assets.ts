const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

export function assetSrc(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("data:") || /^https?:/i.test(url) || url.startsWith("blob:")) {
    return url;
  }
  if (url.startsWith("/")) return `${BASE}${url}`;
  return `${BASE}/${url}`;
}
