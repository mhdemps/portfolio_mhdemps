import { useEffect, useMemo, useState } from "react";

export type LightboxItem = {
  src: string;
  alt?: string;
};

function IconClose() {
  return (
    <svg
      className="lightbox__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function IconChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      className="lightbox__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {dir === "left" ? (
        <path d="M14.5 5.5L8.5 12L14.5 18.5" />
      ) : (
        <path d="M9.5 5.5L15.5 12L9.5 18.5" />
      )}
    </svg>
  );
}

export default function Lightbox({
  items,
  openIndex,
  onClose,
}: {
  items: LightboxItem[];
  openIndex: number | null;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const isOpen = openIndex !== null && items.length > 0;

  const safeItems = useMemo(() => items.filter((i) => Boolean(i.src)), [items]);

  useEffect(() => {
    if (openIndex === null) return;
    const clamped = Math.max(0, Math.min(openIndex, safeItems.length - 1));
    setIdx(clamped);
  }, [openIndex, safeItems.length]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + safeItems.length) % safeItems.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % safeItems.length);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, safeItems.length]);

  if (!isOpen) return null;

  const item = safeItems[idx];

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <button className="lightbox__backdrop" onClick={onClose} aria-label="Close" />

      <div className="lightbox__ui">
        <button className="lightbox__close" onClick={onClose} aria-label="Close">
          <IconClose />
        </button>

        {safeItems.length > 1 ? (
          <>
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={() => setIdx((i) => (i - 1 + safeItems.length) % safeItems.length)}
              aria-label="Previous image"
            >
              <IconChevron dir="left" />
            </button>
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={() => setIdx((i) => (i + 1) % safeItems.length)}
              aria-label="Next image"
            >
              <IconChevron dir="right" />
            </button>
          </>
        ) : null}

        <figure className="lightbox__figure">
          <img className="lightbox__img" src={item.src} alt={item.alt ?? ""} />
        </figure>
      </div>
    </div>
  );
}

