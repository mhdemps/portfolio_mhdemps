import { Link, Navigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Lightbox from "../components/Lightbox";
import { getProjectBySlug } from "../data/portfolioProjects";
import { getFolderMedia } from "../lib/portfolioMedia";

export default function PortfolioDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  const { images, videos } = getFolderMedia(project.folder);
  const lightboxItems = useMemo(() => images.map((src) => ({ src })), [images]);

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

      {images.length > 0 ? (
        <div
          className={
            project.slug === "hot-sauce"
              ? "hot-sauce-gallery"
              : "photography-masonry portfolio-detail__masonry"
          }
        >
          {images.map((src, idx) => (
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

      {images.length === 0 && videos.length === 0 ? (
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
