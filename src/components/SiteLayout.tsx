import { Link, NavLink, Outlet } from "react-router-dom";
import wordmark from "../../assets/mhdesigns logo.svg";

function navLinkClass() {
  return ({ isActive }: { isActive: boolean }) =>
    ["site-nav__link", isActive ? "site-nav__link--active" : ""]
      .filter(Boolean)
      .join(" ");
}

export default function SiteLayout() {
  return (
    <div className="site">
      <header className="site__header">
        <div className="site-header-bar">
          <Link to="/" className="site-header-bar__logo" aria-label="mhdesigns home">
            <img
              src={wordmark}
              alt="mhdesigns"
              width={1082}
              height={288}
              decoding="async"
            />
          </Link>
          <nav className="site-nav site-nav--end" aria-label="Primary">
            <NavLink to="/about" className={navLinkClass()}>
              about
            </NavLink>
            <NavLink to="/portfolio" end className={navLinkClass()}>
              portfolio
            </NavLink>
            <NavLink to="/photography" className={navLinkClass()}>
              photography
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site__main">
        <Outlet />
      </main>
    </div>
  );
}
