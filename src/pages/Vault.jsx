import { useState, useEffect, useRef, useCallback } from 'react'
import { useAffirmation } from '../hooks/useAffirmation'
import { useVaultTransition } from '../hooks/useVaultTransition.jsx'
import { resolveCardAnchor } from '../utils/vaultHelpers.js'
import { PROJECTS, CATS } from '../data/vault.js'
import VaultAtmosphere, { VaultFilterDefs } from '../components/vault/VaultAtmosphere.jsx'
import CatHotspot from '../components/vault/CatHotspot.jsx'
import ProjectHotspot from '../components/vault/ProjectHotspot.jsx'
import VaultMobileCard from '../components/vault/VaultMobileCard.jsx'
import VaultMobileFooter from '../components/vault/VaultMobileFooter.jsx'

// ---------------------------------------------------------------------------
// Vault page
//
// Orchestrates all vault interaction state. Does not contain any rendering
// logic -- that lives in the vault component files.
//
// State owned here:
//   activeSlug    -- which project is selected (drives card + panel + dim)
//   expanded      -- whether the panel (state 2) is open vs the card (state 1)
//   tooltip       -- cursor-following label for project hotspots
//   meeko/mayu bubble + dots -- per-cat affirmation display state
// ---------------------------------------------------------------------------

export default function Vault() {
  const { phase, reset } = useVaultTransition()

  const [activeSlug, setActiveSlug]         = useState(null)
  const [expanded, setExpanded]             = useState(false)
  const [meekoBubbleActive, setMeekoBubbleActive] = useState(false)
  const [mayuBubbleActive,  setMayuBubbleActive]  = useState(false)
  const [meekoDots, setMeekoDots] = useState('')
  const [mayuDots,  setMayuDots]  = useState('')
  const meekoDotsRef = useRef(null)
  const mayuDotsRef  = useRef(null)

  const [tooltip, setTooltip] = useState({ visible: false, label: '', x: 0, y: 0 })
  const handleTooltip = useCallback((next) => setTooltip(next), [])

  const activeProject = PROJECTS.find(p => p.slug === activeSlug) ?? null

  const meeko = useAffirmation('light')
  const mayu  = useAffirmation('dark')

  // Set data-page on mount (FOUC prevention) and clean up transition if needed
  useEffect(() => {
    document.body.setAttribute('data-page', 'vault')
    if (phase === 'entering' || phase === 'exiting') reset()
    return () => document.body.removeAttribute('data-page')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync active project to URL search param
  useEffect(() => {
    const url = new URL(window.location.href)
    if (activeSlug) { url.searchParams.set('project', activeSlug) }
    else            { url.searchParams.delete('project') }
    window.history.replaceState({}, '', url.toString())
  }, [activeSlug])

  // Restore active project from URL on mount (direct link / browser back)
  useEffect(() => {
    const params     = new URLSearchParams(window.location.search)
    const slugFromUrl = params.get('project')
    if (slugFromUrl && PROJECTS.find(p => p.slug === slugFromUrl)) {
      setActiveSlug(slugFromUrl)
      setExpanded(true)
    }
  }, [])

  // Sync --header-h CSS custom property for mobile layout positioning
  useEffect(() => {
    function syncHeaderHeight() {
      const h = document.querySelector('header')?.offsetHeight ?? 0
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    }
    syncHeaderHeight()
    window.addEventListener('resize', syncHeaderHeight)
    return () => window.removeEventListener('resize', syncHeaderHeight)
  }, [])

  // Auto-dismiss cat bubbles after 5s
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

  // Dot animation for each cat's loading state
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

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleCatClick(cat) {
    const isMayu = cat.affirmationTheme === 'dark'
    const hook   = isMayu ? mayu  : meeko
    const busy   = isMayu
      ? (mayu.rendering  || mayuBubbleActive)
      : (meeko.rendering || meekoBubbleActive)
    if (busy) return
    if (isMayu) setMayuBubbleActive(true)
    else        setMeekoBubbleActive(true)
    hook.fetchAffirmation()
  }

  function handleHotspotClick(slug) {
    setTooltip({ visible: false, label: '', x: 0, y: 0 })
    setActiveSlug(slug)
    setExpanded(false)
  }

  function handleDismiss()          { setActiveSlug(null); setExpanded(false) }
  function handleExpand()           { setExpanded(true) }
  function handleMobileOpen(slug)   { setActiveSlug(slug); setExpanded(true) }

  const cardAnchorResolved = activeProject ? resolveCardAnchor(activeProject.cardAnchor) : null

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={`vault-scene${phase === 'exiting' ? ' vault-scene--exiting' : ''}`}>

      {/* vault-canvas: shared 3:2 coordinate space for image + SVG + canvas.
          All children fill this box identically so hotspot % coords map
          pixel-perfectly to the image at any viewport size. */}
      <div className="vault-canvas">
        <img
          src="/images/vault-background.png"
          alt="Mayu's Architecture Vault - an ancient candlelit library"
          className="vault-bg"
          draggable={false}
        />

        {/* Vignette pseudo-elements anchored to image edges */}
        <div className="vault-scene__inner" aria-hidden="true" />

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
            const isMayu = cat.affirmationTheme === 'dark'
            const busy   = isMayu
              ? (mayu.rendering  || mayuBubbleActive)
              : (meeko.rendering || meekoBubbleActive)
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

        {/* Cat affirmation bubbles */}
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

        {/* Project card -- state 1 */}
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

        {/* Dim overlay -- inside vault-canvas so z-index competes correctly
            with vault-card (z-index 3) rather than escaping to vault-scene level */}
        <div
          className={`vault-dim${activeSlug ? ' vault-dim--active' : ''}`}
          onClick={handleDismiss}
          aria-hidden="true"
        />

        <VaultAtmosphere />
      </div>{/* end vault-canvas */}

      {/* Cursor tooltip -- project hotspots only */}
      <div
        className={`vault-tooltip${tooltip.visible ? ' vault-tooltip--visible' : ''}`}
        style={{ left: tooltip.x, top: tooltip.y }}
        aria-hidden="true"
      >
        {tooltip.label}
      </div>

      {/* Project panel -- state 2 */}
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

      {/* Intro text -- fades out when a project is active */}
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

      {/* Mobile layout -- hidden on desktop via CSS */}
      <div className="vault-mobile-list">
        {PROJECTS.map(project => (
          <VaultMobileCard
            key={project.slug}
            project={project}
            onOpen={handleMobileOpen}
          />
        ))}
      </div>

      <VaultMobileFooter />

    </div>
  )
}
