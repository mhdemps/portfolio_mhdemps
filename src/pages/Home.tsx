import { Link } from "react-router-dom";
import { getPhotographyItems } from "../lib/photographyMedia";
import { getPortfolioSlides } from "../lib/portfolioSlides";

type Slide = { key: string; to: string; src: string; alt: string };

export default function Home() {
  const portfolioSlides: Slide[] = getPortfolioSlides();

  const photoSlides: Slide[] = getPhotographyItems().map((p) => ({
    key: p.id,
    to: `/photography#${p.id}`,
    src: p.src,
    alt: p.alt,
  }));

  // Keep a similar visual pace regardless of how many tiles are in the loop.
  const portfolioSpeedS = Math.max(120, portfolioSlides.length * 12);
  const photoSpeedS = Math.max(120, photoSlides.length * 12);

  return (
    <div className="home">
      <h1 className="visually-hidden">mhdesigns</h1>

      <div className="home-marquee" aria-label="Portfolio preview">
        <div
          className="marquee marquee--right"
          style={{ ["--marquee-speed" as string]: `${portfolioSpeedS}s` }}
        >
          <div className="marquee__track">
            {[...portfolioSlides, ...portfolioSlides].map((s, idx) => (
              <Link
                key={`${s.key}-${idx}`}
                to={s.to}
                className="marquee__tile"
                aria-label={s.alt}
              >
                <img
                  className={
                    s.src.toLowerCase().includes("blueberry-design")
                      ? "marquee__img marquee__img--zoom"
                      : "marquee__img"
                  }
                  src={s.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="home-marquee" aria-label="Photography preview">
        <div
          className="marquee marquee--left"
          style={{ ["--marquee-speed" as string]: `${photoSpeedS}s` }}
        >
          <div className="marquee__track">
            {[...photoSlides, ...photoSlides].map((s, idx) => (
              <Link
                key={`${s.key}-${idx}`}
                to={s.to}
                className="marquee__tile"
                aria-label={s.alt}
              >
                <img
                  className="marquee__img"
                  src={s.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
