import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Lightbox from "../components/Lightbox";
import { getProjectBySlug } from "../data/portfolioProjects";
import { getFolderMedia } from "../lib/portfolioMedia";

type Mod = { default: string };

const zineCustomMods = import.meta.glob<Mod>("../../assets/portfolio slide/Custom.jpg", {
  eager: true,
});
const zineCustomUrl = Object.values(zineCustomMods)[0]?.default;

function tastebuddyHeroAsset(src: string): boolean {
  const u = decodeURIComponent(src).toLowerCase();
  const file = u.split("/").pop() ?? "";
  if (file === "cover.svg") return false;
  if (u.includes("apple-touch-icon")) return true;
  if (u.includes("cover icon")) return true;
  if (u.includes("tasty-yum")) return true;
  if (file.endsWith(".gif")) return true;
  if (file.startsWith("open")) return true;
  return false;
}

function isOpenAsset(src: string): boolean {
  const f = decodeURIComponent(src).split("/").pop()?.toLowerCase() ?? "";
  return f.startsWith("open");
}

function isGifOrTastyYum(src: string): boolean {
  const u = decodeURIComponent(src).toLowerCase();
  const f = u.split("/").pop() ?? "";
  return u.includes("tasty-yum") || f.endsWith(".gif");
}

function isAppleTouch(src: string): boolean {
  const u = decodeURIComponent(src).toLowerCase();
  return u.includes("apple-touch-icon") || u.includes("cover icon");
}

/** Hero strip order: open → gif/yum → apple-touch (kept separate from rotating screenshots). */
function orderTastebuddyHeroForDisplay(hero: string[]): string[] {
  const opens = hero.filter(isOpenAsset);
  const sides = hero.filter((s) => !isOpenAsset(s));
  sides.sort((a, b) => {
    const ga = isGifOrTastyYum(a);
    const gb = isGifOrTastyYum(b);
    if (ga !== gb) return ga ? -1 : 1;
    const aa = isAppleTouch(a);
    const ab = isAppleTouch(b);
    if (aa !== ab) return aa ? 1 : -1;
    return a.localeCompare(b, undefined, { numeric: true });
  });
  const ordered = [...opens, ...sides];
  return ordered.length > 0
    ? ordered
    : [...hero].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function partitionTastebuddyMedia(images: string[]): {
  hero: string[];
  slides: string[];
} {
  const hero: string[] = [];
  const slides: string[] = [];
  for (const src of images) {
    if (decodeURIComponent(src).toLowerCase().endsWith("/cover.svg")) continue;
    if (tastebuddyHeroAsset(src)) hero.push(src);
    else slides.push(src);
  }
  return { hero, slides };
}

function isHotSauceCover(src: string): boolean {
  const u = decodeURIComponent(src).toLowerCase();
  return u.includes("horizontal");
}

function zineSlideUrls(allZineFolderImages: string[]): {
  heroTop: string | null;
  slides: string[];
} {
  const pages: Array<{ n: number; src: string }> = [];
  let back: string | null = null;
  let heroTop: string | null = null;

  for (const src of allZineFolderImages) {
    const file = decodeURIComponent(src).split("/").pop() ?? "";
    const lower = file.toLowerCase();

    // Exclude cover art from the page content
    if (lower.includes("cover")) continue;

    // Top hero: prefer Blueberry animation if present, otherwise fall back.
    if (lower.includes("blueberry") && !heroTop) heroTop = src;
    else if (lower.includes("handmade") && !heroTop) heroTop = src;

    if (lower === "back.jpg" || lower.startsWith("back.")) {
      back = src;
      continue;
    }

    const m = lower.match(/^page\s+(\d+)\./);
    if (m) {
      pages.push({ n: Number(m[1]), src });
    }
  }

  pages.sort((a, b) => a.n - b.n);

  // Requested order: Custom → Page 1..5 → back
  const slides: string[] = [];
  if (zineCustomUrl) slides.push(zineCustomUrl);
  for (const p of pages) {
    if (p.n >= 1 && p.n <= 5) slides.push(p.src);
  }
  if (back) slides.push(back);

  return { heroTop, slides };
}

function brochureFinalOrder(src: string): number | null {
  const file = decodeURIComponent(src).split("/").pop() ?? "";
  const lower = file.toLowerCase();
  const m = lower.match(/^final(\d+)?\./);
  if (!m) return null;
  const n = m[1] ? Number(m[1]) : 1;
  if (!Number.isFinite(n) || n < 1 || n > 6) return null;
  return n;
}

function brochureFinalSlides(allBrochureImages: string[]): string[] {
  return allBrochureImages
    .map((src) => ({ src, n: brochureFinalOrder(src) }))
    .filter((x) => x.n !== null)
    .sort((a, b) => (a.n as number) - (b.n as number))
    .map((x) => x.src);
}

export default function PortfolioDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [tastebuddySlide, setTastebuddySlide] = useState(0);
  const [brochureSlide, setBrochureSlide] = useState(0);
  const [zineSlide, setZineSlide] = useState(0);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  const { images, videos } = getFolderMedia(project.folder);
  const { hero: tastebuddyHero, slides: tastebuddySlides } = useMemo(
    () =>
      project.slug === "tastebuddy"
        ? partitionTastebuddyMedia(images)
        : { hero: [] as string[], slides: [] as string[] },
    [project.slug, images]
  );

  const hotSauceImages = useMemo(() => {
    if (project.slug !== "hot-sauce") return images;
    return images.filter((src) => !isHotSauceCover(src));
  }, [project.slug, images]);

  const zine = useMemo(() => {
    if (project.slug !== "zine") return { heroTop: null as string | null, slides: [] as string[] };
    return zineSlideUrls(images);
  }, [project.slug, images]);

  const brochureSlides = useMemo(() => {
    if (project.slug !== "museum-brochure") return [];
    return brochureFinalSlides(images);
  }, [project.slug, images]);

  const tastebuddyHeroOrdered = useMemo(
    () =>
      project.slug === "tastebuddy"
        ? orderTastebuddyHeroForDisplay(tastebuddyHero)
        : [],
    [project.slug, tastebuddyHero]
  );

  const lightboxItems = useMemo(() => {
    if (project.slug === "tastebuddy") {
      const ordered = [...tastebuddyHeroOrdered, ...tastebuddySlides];
      if (ordered.length > 0) return ordered.map((src) => ({ src }));
    }
    if (project.slug === "zine") {
      const ordered = [...(zine.heroTop ? [zine.heroTop] : []), ...zine.slides];
      if (ordered.length > 0) return ordered.map((src) => ({ src }));
    }
    if (project.slug === "hot-sauce") {
      return hotSauceImages.map((src) => ({ src }));
    }
    if (project.slug === "museum-brochure" && brochureSlides.length > 0) {
      return brochureSlides.map((src) => ({ src }));
    }
    return images.map((src) => ({ src }));
  }, [
    project.slug,
    tastebuddyHeroOrdered,
    tastebuddySlides,
    zine,
    hotSauceImages,
    brochureSlides,
    images,
  ]);

  useEffect(() => {
    if (project.slug !== "tastebuddy" || tastebuddySlides.length <= 1) return;
    if (openIndex !== null) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ms = 4800;
    const id = window.setInterval(() => {
      setTastebuddySlide((i) => (i + 1) % tastebuddySlides.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [project.slug, tastebuddySlides.length, openIndex]);

  useEffect(() => {
    setTastebuddySlide(0);
  }, [project.slug]);

  useEffect(() => {
    setZineSlide(0);
  }, [project.slug]);

  useEffect(() => {
    setBrochureSlide(0);
  }, [project.slug]);

  useEffect(() => {
    if (project.slug !== "zine" || zine.slides.length <= 1) return;
    if (openIndex !== null) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ms = 4200;
    const id = window.setInterval(() => {
      setZineSlide((i) => (i + 1) % zine.slides.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [project.slug, zine.slides.length, openIndex]);

  useEffect(() => {
    if (project.slug !== "museum-brochure" || brochureSlides.length <= 1) return;
    if (openIndex !== null) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ms = 4500;
    const id = window.setInterval(() => {
      setBrochureSlide((i) => (i + 1) % brochureSlides.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [project.slug, brochureSlides.length, openIndex]);

  return (
    <article className="portfolio-detail">
      <nav className="portfolio-detail__nav" aria-label="Portfolio">
        <Link to="/portfolio" className="portfolio-detail__back">
          ← portfolio
        </Link>
      </nav>

      <header className="portfolio-detail__header">
        <h1 className="portfolio-detail__title">{project.title}</h1>
        <p className="portfolio-detail__desc">{project.description}</p>
        {project.externalUrl ? (
          <a
            className="portfolio-detail__cta"
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.externalLabel ?? "View project"}
          </a>
        ) : null}
      </header>

      {videos.length > 0 ? (
        <div className="portfolio-detail__videos">
          {videos.map((src) => (
            <figure key={src} className="portfolio-detail__video-wrap">
              <video
                className="portfolio-detail__video"
                src={src}
                controls
                playsInline
                preload="metadata"
              />
            </figure>
          ))}
        </div>
      ) : null}

      {project.slug === "tastebuddy" &&
      (tastebuddyHero.length > 0 || tastebuddySlides.length > 0) ? (
        <div className="tastebuddy-media">
          {tastebuddyHeroOrdered.length > 0 ? (
            <div
              className={
                tastebuddyHeroOrdered.length === 3
                  ? "tastebuddy-hero tastebuddy-hero--triple"
                  : "tastebuddy-hero"
              }
            >
              {tastebuddyHeroOrdered.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  className="tastebuddy-hero__item"
                  onClick={() => setOpenIndex(idx)}
                  aria-label={`Open image ${idx + 1} of ${tastebuddyHeroOrdered.length} in viewer`}
                >
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          ) : null}

          {tastebuddySlides.length > 0 ? (
            <div className="tastebuddy-slideshow">
              <figure className="tastebuddy-slideshow__figure">
                <button
                  type="button"
                  className="tastebuddy-slideshow__stack"
                  onClick={() =>
                    setOpenIndex(
                      tastebuddyHeroOrdered.length + tastebuddySlide
                    )
                  }
                  aria-label={`Open screenshot ${tastebuddySlide + 1} of ${tastebuddySlides.length} in viewer`}
                >
                  {tastebuddySlides.map((src, idx) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className={
                        idx === tastebuddySlide
                          ? "tastebuddy-slideshow__img tastebuddy-slideshow__img--active"
                          : "tastebuddy-slideshow__img"
                      }
                    />
                  ))}
                </button>
                <figcaption className="tastebuddy-slideshow__caption visually-hidden">
                  App screens, slide {tastebuddySlide + 1} of{" "}
                  {tastebuddySlides.length}
                </figcaption>
              </figure>
              {tastebuddySlides.length > 1 ? (
                <div className="tastebuddy-slideshow__dots" aria-hidden="true">
                  {tastebuddySlides.map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx === tastebuddySlide
                          ? "tastebuddy-slideshow__dot tastebuddy-slideshow__dot--active"
                          : "tastebuddy-slideshow__dot"
                      }
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : project.slug === "zine" && zine.slides.length > 0 ? (
        <div className="tastebuddy-media">
          {zine.heroTop ? (
            <button
              type="button"
              className="tastebuddy-hero__item"
              onClick={() => setOpenIndex(0)}
              aria-label="Open zine hero image in viewer"
            >
              <img src={zine.heroTop} alt="" loading="lazy" decoding="async" />
            </button>
          ) : null}

          <div className="tastebuddy-slideshow">
            <figure className="tastebuddy-slideshow__figure">
              <button
                type="button"
                className="tastebuddy-slideshow__stack"
                onClick={() => setOpenIndex((zine.heroTop ? 1 : 0) + zineSlide)}
                aria-label={`Open zine page ${zineSlide + 1} of ${zine.slides.length} in viewer`}
              >
                {zine.slides.map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={
                      idx === zineSlide
                        ? "tastebuddy-slideshow__img tastebuddy-slideshow__img--active"
                        : "tastebuddy-slideshow__img"
                    }
                  />
                ))}
              </button>
              <figcaption className="tastebuddy-slideshow__caption visually-hidden">
                Zine pages, slide {zineSlide + 1} of {zine.slides.length}
              </figcaption>
            </figure>
            {zine.slides.length > 1 ? (
              <div className="tastebuddy-slideshow__dots" aria-hidden="true">
                {zine.slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={
                      idx === zineSlide
                        ? "tastebuddy-slideshow__dot tastebuddy-slideshow__dot--active"
                        : "tastebuddy-slideshow__dot"
                    }
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : project.slug === "museum-brochure" && brochureSlides.length > 0 ? (
        <div className="tastebuddy-media">
          <div className="tastebuddy-slideshow">
            <figure className="tastebuddy-slideshow__figure">
              <button
                type="button"
                className="tastebuddy-slideshow__stack"
                onClick={() => setOpenIndex(brochureSlide)}
                aria-label={`Open brochure spread ${brochureSlide + 1} of ${brochureSlides.length} in viewer`}
              >
                {brochureSlides.map((src, idx) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={
                      idx === brochureSlide
                        ? "tastebuddy-slideshow__img tastebuddy-slideshow__img--active"
                        : "tastebuddy-slideshow__img"
                    }
                  />
                ))}
              </button>
            </figure>
            {brochureSlides.length > 1 ? (
              <div className="tastebuddy-slideshow__dots" aria-hidden="true">
                {brochureSlides.map((_, idx) => (
                  <span
                    key={idx}
                    className={
                      idx === brochureSlide
                        ? "tastebuddy-slideshow__dot tastebuddy-slideshow__dot--active"
                        : "tastebuddy-slideshow__dot"
                    }
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : images.length > 0 ? (
        <div
          className={
            project.slug === "hot-sauce"
              ? "hot-sauce-gallery"
              : "photography-masonry portfolio-detail__masonry"
          }
        >
          {(project.slug === "hot-sauce" ? hotSauceImages : images).map((src, idx) => (
            <figure key={src} className="photography__item">
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                sizes="(max-width: 559px) 100vw, (max-width: 959px) 50vw, (max-width: 1279px) 33vw, 25vw"
                onClick={() => setOpenIndex(idx)}
                className="is-clickable"
              />
            </figure>
          ))}
        </div>
      ) : null}

      {images.length === 0 &&
      videos.length === 0 &&
      !(
        project.slug === "tastebuddy" &&
        (tastebuddyHero.length > 0 || tastebuddySlides.length > 0)
      ) ? (
        <p className="portfolio-detail__empty">
          Add images or video to{" "}
          <code className="photography-page__path">
            assets/{project.folder}
          </code>{" "}
          to show work here.
        </p>
      ) : null}

      <Lightbox
        items={lightboxItems}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </article>
  );
}
