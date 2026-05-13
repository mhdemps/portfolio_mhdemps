import { Link } from "react-router-dom";
import { PORTFOLIO_PROJECTS } from "../data/portfolioProjects";
import { getFolderMedia } from "../lib/portfolioMedia";
import bookRedesignCover from "../../assets/cover images/bookredesign cover.png";
import hotSauceCover from "../../assets/cover images/hotsauce cover.png";
import museumBrochureCover from "../../assets/cover images/museumbrochure cover.png";
import tastebuddyCover from "../../assets/cover images/tastebuddy cover.png";
import trailTypeCover from "../../assets/cover images/trailtype cover.png";
import zineCover from "../../assets/cover images/zine cover.png";

export default function Portfolio() {
  const coverBySlug: Record<string, string> = {
    "book-redesign": bookRedesignCover,
    "hot-sauce": hotSauceCover,
    "museum-brochure": museumBrochureCover,
    tastebuddy: tastebuddyCover,
    "trail-type": trailTypeCover,
    zine: zineCover,
  };

  return (
    <div className="portfolio-page">
      <h1 className="visually-hidden">Portfolio</h1>

      <ul className="portfolio-grid">
        {PORTFOLIO_PROJECTS.map((project) => {
          const slugCover = coverBySlug[project.slug];
          const { images } = getFolderMedia(project.folder);
          const fallbackCover = images[0];
          const cover = slugCover ?? fallbackCover;

          return (
            <li key={project.slug} className="portfolio-grid__cell">
              <Link
                to={`/portfolio/${project.slug}`}
                className="portfolio-card"
              >
                <div className="portfolio-card__thumb">
                  {cover ? (
                    <img src={cover} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="portfolio-card__empty">Add work to folder</span>
                  )}
                  <span className="portfolio-card__overlay" aria-hidden="true">
                    <span className="portfolio-card__overlay-title">{project.title}</span>
                  </span>
                </div>
                <h2 className="portfolio-card__title">{project.title}</h2>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
