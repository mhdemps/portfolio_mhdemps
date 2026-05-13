import { PORTFOLIO_PROJECTS } from "../data/portfolioProjects";

type Mod = { default: string };

export type PortfolioSlide = {
  key: string;
  src: string;
  alt: string;
  to: string;
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function guessProjectSlugFromFilename(filename: string): string | undefined {
  const n = normalize(filename);

  // First: try direct slug match or folder name match
  for (const p of PORTFOLIO_PROJECTS) {
    const slugWords = normalize(p.slug);
    const folderWords = normalize(p.folder);
    const titleWords = normalize(p.title);
    if (n.includes(slugWords) || n.includes(folderWords) || n.includes(titleWords)) {
      return p.slug;
    }
  }

  // Heuristics for your current slide filenames
  if (n.includes("blueberry") || n.includes("cover blue") || n.includes("custom"))
    return "zine";
  if (n.includes("final")) return "hot-sauce";
  if (n.includes("open book") || n.includes("bluer pages")) return "book-redesign";
  if (n.includes("backs") || n.includes("untitled")) return "museum-brochure";

  return undefined;
}

/** Prefer asset folder when filename heuristics would mis-assign (e.g. FINAL in TrailType). */
function guessProjectSlugFromPath(assetPath: string, filename: string): string | undefined {
  const pathNorm = assetPath.replace(/\\/g, "/").toLowerCase();
  if (pathNorm.includes("/trailtype/")) return "trail-type";

  return guessProjectSlugFromFilename(filename);
}

export function getPortfolioSlides(): PortfolioSlide[] {
  const slideMods = import.meta.glob<Mod>(
    "../../assets/portfolio slide/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WEBP}",
    { eager: true }
  );
  const trailMods = import.meta.glob<Mod>(
    "../../assets/TrailType/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,gif,GIF,webp,WEBP}",
    { eager: true }
  );
  const mods = { ...slideMods, ...trailMods };

  return Object.entries(mods)
    .map(([path, mod]) => {
      const file = path.split("/").pop() ?? "slide";
      const slug = guessProjectSlugFromPath(path, file);
      const to = slug ? `/portfolio/${slug}` : "/portfolio";
      const alt = slug
        ? PORTFOLIO_PROJECTS.find((p) => p.slug === slug)?.title ?? "Portfolio"
        : "Portfolio";
      const key = path.includes("TrailType") ? `trail:${file}` : file;
      return { key, src: mod.default, alt, to };
    })
    .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
}

