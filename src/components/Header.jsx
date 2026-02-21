import { Link } from "react-router-dom";
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
        <div className="nav-group">
          <CommitBanner />
          <nav className="site-nav">
            <Link to="/">home.</Link>
            <Link to="/blog">blog.</Link>
            <Link to="/about">about.</Link>
            <Link to="/drewbrew">drewbrew.</Link>
            <Link to="/contact">contact.</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
