export type PortfolioProject = {
  slug: string;
  title: string;
  folder: string;
  description: string;
  externalUrl?: string;
  externalLabel?: string;
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: "book-redesign",
    title: "Book Redesign",
    folder: "BookRedesign",
    description:
      "For this project, I reimagined A Series of Unfortunate Events as a refined collector's edition. I elevated the design through a velvet cover, gold leaf detailing both inside and out, and custom patterned endpapers to create a more elegant, tactile reading experience.",
  },
  {
    slug: "hot-sauce",
    title: "Hot Sauce",
    folder: "HotSauce",
    description:
      "I developed two contrasting hot sauce brands to explore tone and visual identity. Mr. Ouch is inspired by electrical hazard signage, using bold, cautionary visuals to communicate heat. In contrast, Cry Baby leans into humor with a softer, playful identity that still hints at the sauce's kick.",
  },
  {
    slug: "museum-brochure",
    title: "Museum Brochure",
    folder: "Brochure",
    description:
      "In this project, I designed a series of museum brochures for artists I was randomly assigned, creating layouts that felt cohesive as a set while remaining unique to each artist. I researched and designed for Kara Walker, Ho Tzu Nyen, and Ruth Asawa, expanding my understanding of contemporary art through the process.",
  },
  {
    slug: "tastebuddy",
    title: "Tastebuddy",
    folder: "Tastebuddy",
    description:
      "TasteBuddy is your go-to companion for exploring and sharing recipes. Save your favorites, try dishes from friends, and document your cooking journey—all alongside a customizable buddy that makes the experience more fun and personal.",
    externalUrl: "https://public-taste-buddy.vercel.app/sign-in",
    externalLabel: "Open TasteBuddy",
  },
  {
    slug: "zine",
    title: "Zine",
    folder: "Zine",
    description:
      "In this project, I recreated and reimagined Cynthia and Jerome Rubin's Blueberry Cookbook through a mixed-media approach. Using physical paper techniques, AI-generated elements, and texture overlays, I transformed the original into a playful, contemporary zine.",
  },
];

export function getProjectBySlug(
  slug: string | undefined
): PortfolioProject | undefined {
  if (!slug) return undefined;
  return PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
}
