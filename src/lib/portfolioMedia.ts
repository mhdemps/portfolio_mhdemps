type Mod = { default: string };

function sortedUrls(
  mods: Record<string, Mod>,
  rank?: (filename: string) => number
): string[] {
  const seen = new Set<string>();
  return Object.entries(mods)
    .map(([path, mod]) => ({
      url: mod.default,
      name: path.split("/").pop() ?? mod.default,
    }))
    .filter((x) => {
      if (seen.has(x.url)) return false;
      seen.add(x.url);
      return true;
    })
    .sort((a, b) => {
      const ra = rank ? rank(a.name) : 0;
      const rb = rank ? rank(b.name) : 0;
      if (ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    })
    .map((x) => x.url);
}

function zineRank(filename: string): number {
  const n = filename.toLowerCase();
  if (n === "custom.jpg") return 0;

  const pageMatch = n.match(/^page\s+(\d+)\./);
  if (pageMatch) return 10 + Number(pageMatch[1]);

  // Back cover last
  if (n.startsWith("back.")) return 1000;

  // Everything else after main pages but before back
  return 500;
}

const bookRedesign = import.meta.glob("../../assets/BookRedesign/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WEBP}", {
  eager: true,
}) as Record<string, Mod>;

const brochure = import.meta.glob("../../assets/Brochure/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WEBP}", {
  eager: true,
}) as Record<string, Mod>;

const hotSauce = import.meta.glob("../../assets/HotSauce/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WEBP}", {
  eager: true,
}) as Record<string, Mod>;

const tastebuddyImages = import.meta.glob(
  "../../assets/Tastebuddy/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WEBP}",
  { eager: true }
) as Record<string, Mod>;

const tastebuddyVideos = import.meta.glob("../../assets/Tastebuddy/**/*.{mp4,MP4,webm,WEBM,mov,MOV}", {
  eager: true,
}) as Record<string, Mod>;

const zine = import.meta.glob("../../assets/Zine/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WEBP}", {
  eager: true,
}) as Record<string, Mod>;

const BY_FOLDER: Record<string, { images: string[]; videos: string[] }> = {
  BookRedesign: { images: sortedUrls(bookRedesign), videos: [] },
  Brochure: { images: sortedUrls(brochure), videos: [] },
  HotSauce: { images: sortedUrls(hotSauce), videos: [] },
  Tastebuddy: {
    images: sortedUrls(tastebuddyImages),
    videos: sortedUrls(tastebuddyVideos),
  },
  Zine: { images: sortedUrls(zine, zineRank), videos: [] },
};

export function getFolderMedia(folder: string): {
  images: string[];
  videos: string[];
} {
  return BY_FOLDER[folder] ?? { images: [], videos: [] };
}
