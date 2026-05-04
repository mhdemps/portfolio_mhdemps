/** Public files copied from the project `assets` folder (see `publicDir` in vite.config). */
export function assetRootUrl(filename: string): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}${encodeURI(filename)}`;
}
