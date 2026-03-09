import { useState, useEffect } from 'react'
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
    hotspot: { points: [[23.25, 36.04], [28.55, 37.88], [28.82, 43.14], [23.39, 42.28]] },
    cardAnchor: { left: '26%', top: '39.84%' },
  },
  {
    slug: 'engineering-gym',
    title: 'Engineering Gym',
    subtitle: 'Quiz-based learning system. Doubles as a teaching tool for A-Level CS.',
    shelf: 'Architecture vault',
    hotspot: { points: [[85.58, 42.77], [93.29, 39.1], [93.15, 47.66], [85.24, 49.38]] },
    cardAnchor: { left: '89.31%', top: '44.73%' },
  },
  {
    slug: 'homeserver',
    title: 'HomeServer',
    subtitle: 'Self-hosted VPS infrastructure. The backbone that unblocks everything else.',
    shelf: 'Architecture vault',
    hotspot: { points: [[63.57, 23.57], [71.89, 19.29], [71.55, 22.96], [63.57, 27.48]] },
    cardAnchor: { left: '67.64%', top: '23.32%' },
  },
  {
    slug: 'drewbrew',
    title: 'drewBrew',
    subtitle: 'Coffee tracking app. An architecture case study in earning complexity.',
    shelf: 'Architecture vault',
    hotspot: { points: [[70.38, 55.49], [79.74, 54.51], [79.74, 59.04], [70.45, 60.26]] },
    cardAnchor: { left: '75.08%', top: '57.32%' },
  },
  {
    slug: 'drew-portfolio',
    title: 'drew-portfolio',
    subtitle: 'This site. The meta-narrative: building a portfolio that documents itself being built.',
    shelf: 'Architecture vault',
    hotspot: { points: [[15.2, 50.84], [17.74, 50.84], [18.23, 56.1], [14.44, 56.35]] },
    cardAnchor: { left: '16.4%', top: '53.53%' },
  },
]

const CATS = [
  {
    id: 'meeko',
    label: 'Meeko',
    affirmationTheme: 'light',
    points: [[30.2, 53.17], [39.97, 53.54], [39.97, 61.36], [30.27, 59.77]],
    bubbleAnchor: { left: '24.1%', top: '44.96%' },
  },
  {
    id: 'mayu',
    label: 'Mayu',
    affirmationTheme: 'dark',
    points: [[69.21, 89.74], [85.1, 87.78], [93.08, 99.53], [64.8, 99.53]],
    bubbleAnchor: { left: '67.05%', top: '82.14%' },
  },
]

function toSVGPoints(points) {
  return points.map(([x, y]) => `${x},${y}`).join(' ')
}

// ---------------------------------------------------------------------------
// Shared filter defs
//
// Key insight: fill="none", stroke is the glow source.
// A hairline stroke is invisible on its own, but feGaussianBlur spreads its
// colour outward into a soft halo. No filled rectangle, pure glow.
// Multiple blur passes with feMerge layer tight + wide spread.
// ---------------------------------------------------------------------------

function VaultFilterDefs() {
  return (
    <defs>
      {/* Shelf idle -- amber, gentle spread */}
      <filter id="shelf-idle" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b2" />
        <feMerge>
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>

      {/* Shelf hover -- brighter, wider */}
      <filter id="shelf-hover" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="4"   result="b2" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="9"   result="b3" />
        <feMerge>
          <feMergeNode in="b3" />
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>

      {/* Cat idle -- violet, gentle */}
      <filter id="cat-idle" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b2" />
        <feMerge>
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>

      {/* Cat hover -- brighter violet */}
      <filter id="cat-hover" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="4"   result="b2" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="8"   result="b3" />
        <feMerge>
          <feMergeNode in="b3" />
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>
    </defs>
  )
}

// ---------------------------------------------------------------------------
// CatHotspot
// ---------------------------------------------------------------------------

function CatHotspot({ cat, onAffirmation, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <g
      className={`vault-cat-hotspot${hovered ? ' is-hovered' : ''}`}
      onClick={() => { if (!disabled) onAffirmation(cat) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: disabled ? 'default' : 'pointer' }}
      aria-label={`Wake ${cat.label} for an affirmation`}
      role="button"
    >
      <polygon
        className={`vault-hotspot-poly vault-hotspot-poly--cat${hovered ? ' is-hovered' : ''}`}
        points={toSVGPoints(cat.points)}
        fill="transparent"
        stroke="hsl(270 65% 72%)"
        strokeWidth="1.5"
        filter={hovered ? 'url(#cat-hover)' : 'url(#cat-idle)'}
      />
    </g>
  )
}

// ---------------------------------------------------------------------------
// ProjectHotspot
// ---------------------------------------------------------------------------

function ProjectHotspot({ project, isActive, onClick }) {
  const [hovered, setHovered] = useState(false)
  const lit = hovered || isActive

  return (
    <g
      className={`vault-project-hotspot${lit ? ' is-hovered' : ''}`}
      onClick={() => onClick(project.slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
  const [catAffirmation, setCatAffirmation] = useState(null)

  const activeProject = PROJECTS.find(p => p.slug === activeSlug) ?? null

  const meeko = useAffirmation('light')
  const mayu  = useAffirmation('dark')

  // True while either cat hook is fetching -- blocks overlapping clicks
  const catLoading = meeko.loading || mayu.loading

  useEffect(() => {
    // If we arrived via direct URL (no transition), data-page won't be set yet.
    // completeEnter sets it early when arriving via the cinematic transition,
    // so this is a no-op in that case but essential for direct/back navigation.
    document.body.setAttribute('data-page', 'vault')
    // Reset any stale transition phase (e.g. browser back mid-transition)
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
    if (!catAffirmation) return
    const t = setTimeout(() => setCatAffirmation(null), 5000)
    return () => clearTimeout(t)
  }, [catAffirmation])

  async function handleCatClick(cat) {
    // Drop clicks while a fetch is in-flight -- the hook's cancellation handles
    // rapid clicks from MeekoBubble, but in the vault we want a cleaner UX
    // where the hotspot simply doesn't respond until the quote is ready.
    if (catLoading) return
    const hook = cat.affirmationTheme === 'dark' ? mayu : meeko
    setCatAffirmation(null)
    await hook.fetchAffirmation()
    setCatAffirmation({ cat, hook })
  }

  function handleHotspotClick(slug) { setActiveSlug(slug); setExpanded(false) }
  function handleDismiss() { setActiveSlug(null); setExpanded(false) }
  function handleExpand() { setExpanded(true) }

  const affirmationText = catAffirmation ? catAffirmation.hook.displayed : null

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
          />
        ))}

        {CATS.map(cat => (
          <CatHotspot
            key={cat.id}
            cat={cat}
            onAffirmation={handleCatClick}
            disabled={catLoading}
          />
        ))}
      </svg>

      <div
        className={`vault-dim${activeSlug ? ' vault-dim--active' : ''}`}
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {catAffirmation && affirmationText && (
        <div className="vault-cat-bubble" style={catAffirmation.cat.bubbleAnchor} aria-live="polite">
          <p>"{affirmationText}"</p>
          <span className="vault-cat-bubble__name">
            {catAffirmation.cat.label === 'Meeko' ? '— Meeko' : '— Mayu'}
          </span>
        </div>
      )}

      {activeProject && !expanded && (
        <div className="vault-card" style={activeProject.cardAnchor} onClick={e => e.stopPropagation()}>
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
