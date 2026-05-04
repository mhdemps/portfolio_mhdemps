export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="placeholder-page">
      <h1 className="visually-hidden">{title}</h1>
      <p className="placeholder-page__text">{title} — coming soon.</p>
    </div>
  );
}
