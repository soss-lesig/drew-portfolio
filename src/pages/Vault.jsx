import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from '../hooks/useTheme'
import { useAffirmation } from '../hooks/useAffirmation'
import { useVaultTransition } from '../hooks/useVaultTransition.jsx'

const PROJECTS = [
  {
    slug: 'ironiq',
    title: 'IronIQ',
    subtitle: 'Offline-first workout tracking. The most technically ambitious project in the vault.',
    shelf: 'Architecture vault',
    hotspot: { points: [[28.38, 32.74], [38.44, 37.54], [39.19, 49.27], [29.13, 46.7], [28.25, 40]] },
    cardAnchor: { left: '32.68%', top: '41.25%' },
  },
  {
    slug: 'engineering-gym',
    title: 'Engineering Gym',
    subtitle: 'Quiz-based learning system. Doubles as a teaching tool for A-Level CS.',
    shelf: 'Architecture vault',
    hotspot: { points: [[99.65, 50.61], [86.52, 51.84], [86.01, 62.01], [99.78, 61.79]] },
    cardAnchor: { left: '92.99%', top: '56.56%' },
  },
  {
    slug: 'homeserver',
    title: 'HomeServer',
    subtitle: 'Self-hosted VPS infrastructure. The backbone that unblocks everything else.',
    shelf: 'Architecture vault',
    hotspot: { points: [[29.26, 15.64], [37.49, 22.91], [37.81, 33.07], [28.57, 27.6], [28.44, 21.56]] },
    cardAnchor: { left: '32.31%', top: '24.16%' },
  },
  {
    slug: 'drewbrew',
    title: 'drewBrew',
    subtitle: 'Coffee tracking app. An architecture case study in earning complexity.',
    shelf: 'Architecture vault',
    hotspot: { points: [[27.94, 68.72], [0.66, 68.6], [1.92, 75.87], [18.95, 77.43], [28.13, 75.42], [27.56, 72.4]] },
    cardAnchor: { left: '17.53%', top: '73.07%' },
  },
  {
    slug: 'drew-portfolio',
    title: 'drew-portfolio',
    subtitle: 'This site. The meta-narrative: building a portfolio that documents itself being built.',
    shelf: 'Architecture vault',
    hotspot: { points: [[99.59, 36.09], [86.26, 39.89], [86.33, 48.94], [99.59, 46.93]] },
    cardAnchor: { left: '92.94%', top: '42.96%' },
  },
  {
    slug: 'quitrx',
    title: 'QuitRx',
    subtitle: 'Cross-platform stop-smoking tracker. Local-first health data, honest stats, and a one-time Pro unlock -- no subscriptions, no data leaving your device.',
    shelf: 'Architecture vault',
    hotspot: { points: [[98.9, 17.32], [87.27, 21.9], [79.54, 28.04], [79.41, 34.3], [89.22, 29.61], [99.27, 26.15]] },
    cardAnchor: { left: '88.94%', top: '26.22%' },
  },
]

const CATS = [
  {
    id: 'meeko',
    label: 'Meeko',
    affirmationTheme: 'light',
    points: [[78.28, 49.27], [74.01, 54.64], [72.81, 67.04], [76.46, 90.28], [85.7, 91.62], [90.92, 88.27], [88.9, 72.18], [84, 64.69], [81.8, 52.18]],
    bubbleAnchor: { right: '30%', top: '52%' },
  },
  {
    id: 'mayu',
    label: 'Mayu',
    affirmationTheme: 'dark',
    points: [[14.43, 27.26], [9.21, 29.61], [7.14, 51.28], [14.24, 57.32], [19.64, 53.18], [25.61, 53.97], [27.81, 60.56], [31.71, 75.87], [34.29, 60.89], [29.64, 51.17], [26.18, 42.91], [19.77, 41.01], [18.32, 30.06]],
    bubbleAnchor: { left: '2%', top: '10%' },
  },
]

// ---------------------------------------------------------------------------
// Determine card anchor style + modifier class.
// ---------------------------------------------------------------------------
function resolveCardAnchor(anchor) {
  const leftVal = anchor.left ? parseFloat(anchor.left) : null
  if (leftVal !== null && leftVal > 65) {
    const rightPct = (100 - leftVal).toFixed(2)
    return {
      style: { right: `${rightPct}%`, top: anchor.top },
      className: 'vault-card vault-card--right-anchored',
    }
  }
  return {
    style: anchor,
    className: 'vault-card',
  }
}

function toSVGPoints(points) {
  return points.map(([x, y]) => `${x},${y}`).join(' ')
}

// ---------------------------------------------------------------------------
// Shared filter defs
// ---------------------------------------------------------------------------

function VaultFilterDefs() {
  return (
    <defs>
      {/* Shelf idle -- amber, tight two-layer spread */}
      <filter id="shelf-idle" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1"   result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b2" />
        <feMerge>
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>

      {/* Shelf hover -- brighter, three layers, still contained */}
      <filter id="shelf-hover" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b2" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="7"   result="b3" />
        <feMerge>
          <feMergeNode in="b3" />
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>

      {/* Cat -- single filter, always idle, no hover variant needed */}
      <filter id="cat-idle" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1"   result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b2" />
        <feMerge>
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>
    </defs>
  )
}

// ---------------------------------------------------------------------------
// CatHotspot -- no tooltip, no hover glow change; cats are easter eggs.
// Clicking is still fully functional -- only the visual feedback is removed.
// ---------------------------------------------------------------------------

function CatHotspot({ cat, onAffirmation, disabled }) {
  return (
    <g
      className="vault-cat-hotspot"
      onClick={() => { if (!disabled) onAffirmation(cat) }}
      style={{ cursor: disabled ? 'default' : 'pointer' }}
      aria-label={`Wake ${cat.label} for an affirmation`}
      role="button"
      aria-disabled={disabled}
    >
      <polygon
        className="vault-hotspot-poly vault-hotspot-poly--cat"
        points={toSVGPoints(cat.points)}
        fill="transparent"
        stroke="hsl(270 65% 72%)"
        strokeWidth="1.5"
        filter="url(#cat-idle)"
      />
    </g>
  )
}

// ---------------------------------------------------------------------------
// ProjectHotspot -- tooltip on hover, tracks mouse position
// ---------------------------------------------------------------------------

function ProjectHotspot({ project, isActive, onClick, onTooltip }) {
  const [hovered, setHovered] = useState(false)
  const lit = hovered || isActive

  function handleMouseEnter(e) {
    setHovered(true)
    onTooltip({ visible: true, label: project.title, x: e.clientX, y: e.clientY })
  }

  function handleMouseMove(e) {
    onTooltip({ visible: true, label: project.title, x: e.clientX, y: e.clientY })
  }

  function handleMouseLeave() {
    setHovered(false)
    onTooltip({ visible: false, label: '', x: 0, y: 0 })
  }

  return (
    <g
      className={`vault-project-hotspot${lit ? ' is-hovered' : ''}`}
      onClick={() => onClick(project.slug)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
      aria-label={`Open ${project.title} architecture vault`}
      role="button"
    >
      <polygon
        className={`vault-hotspot-poly vault-hotspot-poly--shelf${lit ? ' is-hovered' : ''}`}
        points={toSVGPoints(project.hotspot.points)}
        fill="transparent"
        stroke="hsl(35 90% 62%)"
        strokeWidth="1.5"
        filter={lit ? 'url(#shelf-hover)' : 'url(#shelf-idle)'}
      />
    </g>
  )
}

// ---------------------------------------------------------------------------
// Vault page
// ---------------------------------------------------------------------------

export default function Vault() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { phase, startExit, reset } = useVaultTransition()

  const [activeSlug, setActiveSlug] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [meekoBubbleActive, setMeekoBubbleActive] = useState(false)
  const [mayuBubbleActive, setMayuBubbleActive]   = useState(false)
  const [meekoDots, setMeekoDots] = useState('')
  const [mayuDots, setMayuDots]   = useState('')
  const meekoDotsRef = useRef(null)
  const mayuDotsRef  = useRef(null)

  // Tooltip state -- single object to avoid multiple re-renders
  const [tooltip, setTooltip] = useState({ visible: false, label: '', x: 0, y: 0 })
  const handleTooltip = useCallback((next) => setTooltip(next), [])

  const activeProject = PROJECTS.find(p => p.slug === activeSlug) ?? null

  const meeko = useAffirmation('light')
  const mayu  = useAffirmation('dark')

  useEffect(() => {
    document.body.setAttribute('data-page', 'vault')
    if (phase === 'entering' || phase === 'exiting') reset()
    return () => document.body.removeAttribute('data-page')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const url = new URL(window.location.href)
    if (activeSlug) { url.searchParams.set('project', activeSlug) }
    else { url.searchParams.delete('project') }
    window.history.replaceState({}, '', url.toString())
  }, [activeSlug])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slugFromUrl = params.get('project')
    if (slugFromUrl && PROJECTS.find(p => p.slug === slugFromUrl)) {
      setActiveSlug(slugFromUrl)
      setExpanded(true)
    }
  }, [])

  useEffect(() => {
    if (!meekoBubbleActive) return
    const t = setTimeout(() => setMeekoBubbleActive(false), 5000)
    return () => clearTimeout(t)
  }, [meekoBubbleActive])

  useEffect(() => {
    if (!mayuBubbleActive) return
    const t = setTimeout(() => setMayuBubbleActive(false), 5000)
    return () => clearTimeout(t)
  }, [mayuBubbleActive])

  useEffect(() => {
    if (meekoDotsRef.current) { clearInterval(meekoDotsRef.current); meekoDotsRef.current = null }
    if (!meekoBubbleActive || meeko.displayed) { setMeekoDots(''); return }
    let count = 1; setMeekoDots('.')
    meekoDotsRef.current = setInterval(() => {
      count = count >= 3 ? 1 : count + 1
      setMeekoDots('.'.repeat(count))
    }, 300)
    return () => { clearInterval(meekoDotsRef.current); meekoDotsRef.current = null }
  }, [meekoBubbleActive, meeko.displayed])

  useEffect(() => {
    if (mayuDotsRef.current) { clearInterval(mayuDotsRef.current); mayuDotsRef.current = null }
    if (!mayuBubbleActive || mayu.displayed) { setMayuDots(''); return }
    let count = 1; setMayuDots('.')
    mayuDotsRef.current = setInterval(() => {
      count = count >= 3 ? 1 : count + 1
      setMayuDots('.'.repeat(count))
    }, 300)
    return () => { clearInterval(mayuDotsRef.current); mayuDotsRef.current = null }
  }, [mayuBubbleActive, mayu.displayed])

  function handleCatClick(cat) {
    const ismayu = cat.affirmationTheme === 'dark'
    const hook   = ismayu ? mayu : meeko
    const busy   = ismayu ? (mayu.rendering || mayuBubbleActive) : (meeko.rendering || meekoBubbleActive)
    if (busy) return
    if (ismayu) setMayuBubbleActive(true)
    else setMeekoBubbleActive(true)
    hook.fetchAffirmation()
  }

  function handleHotspotClick(slug) {
    setTooltip({ visible: false, label: '', x: 0, y: 0 })
    setActiveSlug(slug)
    setExpanded(false)
  }
  function handleDismiss() { setActiveSlug(null); setExpanded(false) }
  function handleExpand() { setExpanded(true) }

  const cardAnchorResolved = activeProject ? resolveCardAnchor(activeProject.cardAnchor) : null

  return (
    <div className={`vault-scene${phase === 'exiting' ? ' vault-scene--exiting' : ''}`}>
      <img
        src="/images/vault-background.png"
        alt="Mayu's Architecture Vault - an ancient candlelit library"
        className="vault-bg"
        draggable={false}
      />

      <svg
        className="vault-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="false"
      >
        <VaultFilterDefs />

        {PROJECTS.map(project => (
          <ProjectHotspot
            key={project.slug}
            project={project}
            isActive={activeSlug === project.slug}
            onClick={handleHotspotClick}
            onTooltip={handleTooltip}
          />
        ))}

        {CATS.map(cat => {
          const ismayu = cat.affirmationTheme === 'dark'
          const busy   = ismayu ? (mayu.rendering || mayuBubbleActive) : (meeko.rendering || meekoBubbleActive)
          return (
            <CatHotspot
              key={cat.id}
              cat={cat}
              onAffirmation={handleCatClick}
              disabled={busy}
            />
          )
        })}
      </svg>

      {/* Hover tooltip -- follows cursor, projects only */}
      <div
        className={`vault-tooltip${tooltip.visible ? ' vault-tooltip--visible' : ''}`}
        style={{ left: tooltip.x, top: tooltip.y }}
        aria-hidden="true"
      >
        {tooltip.label}
      </div>

      <div
        className={`vault-dim${activeSlug ? ' vault-dim--active' : ''}`}
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {meekoBubbleActive && (
        <div className="vault-cat-bubble" style={CATS.find(c => c.id === 'meeko').bubbleAnchor} aria-live="polite">
          {meekoDots
            ? <p className="vault-cat-bubble__dots">{meekoDots}</p>
            : <p>"{meeko.displayed}"</p>
          }
          <span className="vault-cat-bubble__name">-- Meeko</span>
        </div>
      )}

      {mayuBubbleActive && (
        <div className="vault-cat-bubble" style={CATS.find(c => c.id === 'mayu').bubbleAnchor} aria-live="polite">
          {mayuDots
            ? <p className="vault-cat-bubble__dots">{mayuDots}</p>
            : <p>"{mayu.displayed}"</p>
          }
          <span className="vault-cat-bubble__name">-- Mayu</span>
        </div>
      )}

      {activeProject && !expanded && cardAnchorResolved && (
        <div
          className={cardAnchorResolved.className}
          style={cardAnchorResolved.style}
          onClick={e => e.stopPropagation()}
        >
          <button className="vault-card__dismiss" onClick={handleDismiss} aria-label="Close">✕</button>
          <p className="vault-card__eyebrow">{activeProject.shelf}</p>
          <h2 className="vault-card__title">{activeProject.title}</h2>
          <p className="vault-card__subtitle">{activeProject.subtitle}</p>
          <button className="vault-card__cta" onClick={handleExpand}>
            Explore this project
            <span className="vault-card__cta-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {activeProject && expanded && (
        <div className="vault-panel" onClick={e => e.stopPropagation()}>
          <div className="vault-panel__header">
            <div className="vault-panel__header-left">
              <p className="vault-panel__eyebrow">{activeProject.shelf}</p>
              <h2 className="vault-panel__title">{activeProject.title}</h2>
            </div>
            <button className="vault-panel__close" onClick={handleDismiss}>← Back to vault</button>
          </div>
          <div className="vault-panel__body">
            <div className="vault-panel__placeholder">
              <span className="vault-panel__placeholder-icon" aria-hidden="true">📚</span>
              <p className="vault-panel__placeholder-text">
                Architecture docs for {activeProject.title} are being catalogued.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`vault-intro${activeSlug ? ' vault-intro--hidden' : ''}`}>
        <h1 className="vault-intro__title">
          Mayu's Architecture Vault
          <span className="vault-alpha-badge">ALPHA</span>
        </h1>
        <p className="vault-intro__subtitle">
          Architectural decisions, system design, and honest post-mortems across every project.
        </p>
      </div>

      {!activeSlug && <p className="vault-hint" aria-hidden="true">select a bookshelf to begin</p>}
    </div>
  )
}
