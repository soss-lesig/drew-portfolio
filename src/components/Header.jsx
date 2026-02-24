import { Link, NavLink } from "react-router-dom";
import MeekoBubble from "./MeekoBubble";
import CommitBanner from "./CommitBanner";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-portrait-group">
          <div className="header-portrait">
            <Link to="/">
              <div className="portrait-wrapper">
                <img
                  src="/images/meeks.jpg"
                  alt="Meeko"
                  className="portrait-img"
                />
                <span className="portrait-label">drewbs.dev</span>
              </div>
            </Link>
          </div>
          <MeekoBubble />
        </div>
        <nav className="site-nav">
          <CommitBanner />
          <span className="nav-divider">|</span>
          <NavLink to="/" end>home.</NavLink>
          <NavLink to="/blog">blog.</NavLink>
          <NavLink to="/about">about.</NavLink>
          <NavLink to="/drewbrew">drewbrew.</NavLink>
          <NavLink to="/contact">contact.</NavLink>
        </nav>
      </div>
    </header>
  );
}
