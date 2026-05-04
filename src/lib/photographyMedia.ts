type Mod = { default: string };

export type PhotographyItem = {
  id: string;
  src: string;
  alt: string;
};

function toId(filename: string): string {
  return filename
    .replace(/\.[^.]+$/i, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getPhotographyItems(): PhotographyItem[] {
  const modules = {
    ...import.meta.glob<Mod>("../../assets/Photography/**/*.{JPG,jpg,jpeg,png,webp}", {
      eager: true,
    }),
  };

  const seen = new Set<string>();

  return Object.entries(modules)
    .map(([path, mod]) => {
      const file = path.split("/").pop() ?? "photo";
      const alt = file.replace(/\.[^.]+$/i, "").replace(/_/g, " ");
      return { id: toId(file), src: mod.default, alt, sortKey: file };
    })
    .filter((p) => {
      if (seen.has(p.src)) return false;
      seen.add(p.src);
      return true;
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey, undefined, { numeric: true }))
    .map(({ id, src, alt }) => ({ id, src, alt }));
}

