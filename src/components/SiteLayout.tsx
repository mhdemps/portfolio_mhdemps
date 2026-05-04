import { Link, NavLink, Outlet } from "react-router-dom";
import footerMark from "../../assets/mhdemps footer.svg";

function navLinkClass(pos: "left" | "center" | "right") {
  return ({ isActive }: { isActive: boolean }) =>
    [
      "site-nav__link",
      `site-nav__link--${pos}`,
      isActive ? "site-nav__link--active" : "",
    ]
      .filter(Boolean)
      .join(" ");
}

export default function SiteLayout() {
  return (
    <div className="site">
      <header className="site__header">
        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/about" className={navLinkClass("left")}>
            about
          </NavLink>
          <NavLink to="/portfolio" className={navLinkClass("center")}>
            portfolio
          </NavLink>
          <NavLink to="/photography" className={navLinkClass("right")}>
            photography
          </NavLink>
        </nav>
      </header>

      <main className="site__main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <Link to="/" className="site-footer__link" aria-label="Home">
          <img
            className="site-footer__mark"
            src={footerMark}
            alt="mhdesigns"
            width={1029}
            height={239}
            decoding="async"
          />
        </Link>
      </footer>
    </div>
  );
}
