import { useEffect, useMemo, useState } from "react";
import Lightbox from "../components/Lightbox";
import { getPhotographyItems } from "../lib/photographyMedia";

export default function Photography() {
  const photos = useMemo(getPhotographyItems, []);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="photography-page">
      <h1 className="visually-hidden">Photography</h1>

      {photos.length === 0 ? (
        <p className="photography-page__empty">
          Add images to{" "}
          <code className="photography-page__path">assets/Photography</code> — they
          will show up here automatically.
        </p>
      ) : (
        <div className="photography-masonry">
          {photos.map((photo, idx) => (
            <figure id={photo.id} key={photo.id} className="photography__item">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 559px) 100vw, (max-width: 959px) 50vw, (max-width: 1279px) 33vw, 25vw"
                onClick={() => setOpenIndex(idx)}
                className="is-clickable"
              />
            </figure>
          ))}
        </div>
      )}

      <Lightbox
        items={photos.map((p) => ({ src: p.src, alt: p.alt }))}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
      />
    </div>
  );
}
