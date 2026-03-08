import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import MeekoBubble from './MeekoBubble'
import CommitBanner from './CommitBanner'
import { useTheme } from '../hooks/useTheme'

const TOGGLE_KEY = 'drewbs-theme-toggled'

export default function Header() {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const isVault = location.pathname === '/vault'

  const [mounted, setMounted] = useState(false)
  const [hasPulsed, setHasPulsed] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem(TOGGLE_KEY)) setHasPulsed(true)
  }, [])

  function handleToggle() {
    if (!hasPulsed) {
      localStorage.setItem(TOGGLE_KEY, '1')
      setHasPulsed(true)
    }
    toggle()
  }

  return (
    <header className={`site-header${isVault ? ' site-header--vault' : ''}`}>
      <div className="header-inner">
        {/* Portrait + speech bubble -- hidden on vault, cats take over */}
        {!isVault && (
          <div className="header-portrait-group">
            <div className="header-portrait">
              <div className={`portrait-wrapper${hasPulsed ? '' : ' is-pulsing'}`}>
                <button
                  className="theme-toggle"
                  onClick={handleToggle}
                  aria-label="Toggle theme"
                >
                  <div className="portrait-crossfade">
                    <img
                      src="/images/meeks.jpg"
                      alt="Meeko"
                      className="portrait-img portrait-img--meeko"
                      style={{ opacity: !mounted ? 0 : theme === 'dark' ? 0 : 1 }}
                    />
                    <img
                      src="/images/mayu.jpg"
                      alt="Mayu"
                      className="portrait-img portrait-img--mayu"
                      style={{ opacity: !mounted ? 0 : theme === 'dark' ? 1 : 0 }}
                    />
                  </div>
                </button>
                <Link to="/">
                  <span className="portrait-label">drewbs.dev</span>
                </Link>
              </div>
            </div>
            <MeekoBubble />
          </div>
        )}

        <nav className={`site-nav${isVault ? ' site-nav--vault' : ''}`}>
          <CommitBanner />
          <span className="nav-divider">|</span>
          <NavLink to="/" end>home.</NavLink>
          <NavLink to="/blog">blog.</NavLink>
          <NavLink to="/about">about.</NavLink>
          <NavLink to="/drewbrew">drewbrew.</NavLink>
          <NavLink to="/vault">vault.</NavLink>
          <NavLink to="/contact">contact.</NavLink>
        </nav>
      </div>
    </header>
  )
}
