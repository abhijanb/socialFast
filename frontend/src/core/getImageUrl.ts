import { env } from "@/core/env";

export function getImageUrl(path: string): string {
  return `${env.IMG_URL}/${path}`;
}
