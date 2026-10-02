import { env } from "@/core/env";

export function getImagePath(baseUri: string, path: string): string {
  const base = baseUri.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  return `${base}/${cleanPath}`;
}

export function getImageUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return getImagePath(env.IMG_URL, path);
}
