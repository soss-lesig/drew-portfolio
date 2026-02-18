import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
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
        <nav className="site-nav">
          <Link to="/">Home.</Link>
          <Link to="/blog">Blog.</Link>
          <Link to="/about">About.</Link>
          <Link to="/drewbrew">drewBrew.</Link>
          <Link to="/contact">Contact.</Link>
        </nav>
      </div>
    </header>
  );
}
