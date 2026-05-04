import { Link } from "react-router-dom";
import { PORTFOLIO_PROJECTS } from "../data/portfolioProjects";
import { getFolderMedia } from "../lib/portfolioMedia";

export default function Portfolio() {
  return (
    <div className="portfolio-page">
      <h1 className="visually-hidden">Portfolio</h1>

      <ul className="portfolio-grid">
        {PORTFOLIO_PROJECTS.map((project) => {
          const { images } = getFolderMedia(project.folder);
          const cover =
            project.slug === "zine"
              ? images.find((u) => u.toLowerCase().includes("cover%20blue")) ??
                images.find((u) => u.toLowerCase().includes("cover blue")) ??
                images.find((u) => u.toLowerCase().includes("blueberry-design")) ??
                images[0]
              : images[0];

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
                </div>
                <h2 className="portfolio-card__title">{project.title}</h2>
              </Link>
            </li>
          );
        })}

        <li className="portfolio-grid__cell">
          <div className="portfolio-card portfolio-card--soon" aria-label="More projects soon">
            <div className="portfolio-card__thumb">
              <span className="portfolio-card__empty">to be added soon</span>
            </div>
            <h2 className="portfolio-card__title">more work</h2>
          </div>
        </li>
      </ul>
    </div>
  );
}
