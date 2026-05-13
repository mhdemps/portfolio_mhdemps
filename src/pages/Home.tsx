import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getPhotographyItems } from "../lib/photographyMedia";
import { getPortfolioSlides } from "../lib/portfolioSlides";

type Slide = {
  runKey: string;
  to: string;
  src: string;
  alt: string;
};

function interleavePortfolioAndPhotos(
  portfolio: { key: string; to: string; src: string; alt: string }[],
  photos: { id: string; to: string; src: string; alt: string }[]
): Slide[] {
  const out: Slide[] = [];
  const n = Math.max(portfolio.length, photos.length);
  for (let i = 0; i < n; i++) {
    if (i < portfolio.length) {
      const s = portfolio[i];
      out.push({
        runKey: `p:${s.key}`,
        to: s.to,
        src: s.src,
        alt: s.alt,
      });
    }
    if (i < photos.length) {
      const s = photos[i];
      out.push({
        runKey: `ph:${s.id}`,
        to: s.to,
        src: s.src,
        alt: s.alt,
      });
    }
  }
  return out;
}

function markMarqueeImgLoaded(el: HTMLImageElement) {
  el.classList.add("marquee__img--loaded");
}

function marqueeImgRef(el: HTMLImageElement | null) {
  if (el?.complete && el.naturalWidth > 0) markMarqueeImgLoaded(el);
}

export default function Home() {
  const { mixedSlides, speedS } = useMemo(() => {
    const portfolioSlides = getPortfolioSlides();
    const photoSlides = getPhotographyItems().map((p) => ({
      id: p.id,
      to: `/photography#${p.id}`,
      src: p.src,
      alt: p.alt,
    }));
    const mixed = interleavePortfolioAndPhotos(portfolioSlides, photoSlides);
    // Same pacing as the old two-row home: each row used max(120, count * 12); blend both.
    const portfolioSpeedS = Math.max(120, portfolioSlides.length * 12);
    const photoSpeedS = Math.max(120, photoSlides.length * 12);
    const speedS = ((portfolioSpeedS + photoSpeedS) / 2) * 2.45;
    return { mixedSlides: mixed, speedS };
  }, []);

  const loopSlides = useMemo(() => [...mixedSlides, ...mixedSlides], [mixedSlides]);

  return (
    <div className="home">
      <h1 className="visually-hidden">mhdesigns</h1>

      <div className="home-marquee home-marquee--combined" aria-label="Portfolio and photography preview">
        <div
          className="marquee marquee--left"
          style={{ ["--marquee-speed" as string]: `${speedS}s` }}
        >
          <div className="marquee__track">
            {loopSlides.map((s, idx) => {
              const eager = idx < 8;
              const zoom =
                s.src.toLowerCase().includes("blueberry-design") ? " marquee__img--zoom" : "";
              return (
                <Link
                  key={`${s.runKey}-${idx}`}
                  to={s.to}
                  className="marquee__tile"
                  aria-label={s.alt}
                >
                  <img
                    ref={marqueeImgRef}
                    className={`marquee__img${zoom}`}
                    src={s.src}
                    alt=""
                    loading={eager ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={eager ? "high" : "low"}
                    onLoad={(e) => markMarqueeImgLoaded(e.currentTarget)}
                    onError={(e) => markMarqueeImgLoaded(e.currentTarget)}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
