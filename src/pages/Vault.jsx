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
    hotspot: { points: [[29.21, 37.96], [38.46, 42.18], [38.38, 50.28], [29.87, 47.72], [28.84, 45.06]] },
    cardAnchor: { left: '32.95%', top: '44.64%' },
  },
  {
    slug: 'engineering-gym',
    title: 'Eng Gym',
    subtitle: 'Quiz-based learning system. Doubles as a teaching tool for A-Level CS.',
    shelf: 'Architecture vault',
    hotspot: { points: [[29.5, 23.64], [37.13, 29.08], [37.27, 35.96], [29.21, 31.96]] },
    cardAnchor: { left: '33.28%', top: '30.16%' },
  },
  {
    slug: 'homeserver',
    title: 'HomeServer',
    subtitle: 'Self-hosted VPS infrastructure. The backbone that unblocks everything else.',
    shelf: 'Architecture vault',
    hotspot: { points: [[99.5, 53.05], [87.51, 54.27], [87.14, 60.93], [99.13, 60.71]] },
    cardAnchor: { left: '93.32%', top: '57.24%' },
  },
  {
    slug: 'drewbrew',
    title: 'drewBrew',
    subtitle: 'Coffee tracking app. An architecture case study in earning complexity.',
    shelf: 'Architecture vault',
    hotspot: { points: [[86.77, 44.06], [86.92, 49.83], [99.13, 48.39], [98.98, 41.29], [92.18, 42.73]] },
    cardAnchor: { left: '92.8%', top: '45.26%' },
  },
  {
    slug: 'drew-portfolio',
    title: 'drew-portfolio',
    subtitle: 'This site. The meta-narrative: building a portfolio that documents itself being built.',
    shelf: 'Architecture vault',
    hotspot: { points: [[39.12, 54.94], [34.02, 54.5], [35.72, 59.16], [35.5, 63.04], [39.05, 63.04]] },
    cardAnchor: { left: '36.68%', top: '58.94%' },
  },
  {
    slug: 'quitrx',
    title: 'QuitRx',
    subtitle: 'Cross-platform stop-smoking tracker. Local-first health data, honest stats, and a one-time Pro unlock -- no subscriptions, no data leaving your device.',
    shelf: 'Architecture vault',
    hotspot: { points: [[98.02, 25.31], [87.74, 28.63], [80.04, 32.96], [79.97, 37.62], [87.88, 33.85], [98.24, 30.85]] },
    cardAnchor: { left: '88.65%', top: '31.54%' },
  },
]

const CATS = [
  {
    id: 'meeko',
    label: 'Meeko',
    affirmationTheme: 'light',
    points: [[78.26, 51.83], [75.16, 55.49], [73.9, 68.04], [76.93, 84.68], [79.45, 85.79], [84.63, 86.68], [90.47, 84.79], [89.96, 75.58], [84.55, 66.93], [82.7, 64.48], [82.48, 56.94], [80.93, 53.39]],
    bubbleAnchor: { left: '63%', top: '48%' },
  },
  {
    id: 'mayu',
    label: 'Mayu',
    affirmationTheme: 'dark',
    points: [[14.19, 32.74], [9.53, 36.07], [8.27, 44.06], [7.68, 52.39], [11.08, 53.61], [14.04, 57.27], [19.29, 52.94], [26.32, 54.72], [32.17, 63.71], [33.72, 60.71], [25.66, 47.39], [18.92, 43.84], [18.26, 37.62], [16.48, 34.63]],
    bubbleAnchor: { left: '1%', top: '28%' },
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

// Light source positions from hotspot editor (percentage of canvas)
const LIGHT_SOURCES = [
  { id: 'rose-window', x: 63.41, y: 16.70 },
  { id: 'lantern-1',  x: 32.23, y: 11.62 },
  { id: 'lantern-2',  x: 90.82, y: 15.33 },
  { id: 'lantern-3',  x: 92.77, y: 48.54 },
  { id: 'lantern-4',  x: 73.50, y: 19.92 },
  { id: 'lantern-5',  x: 46.81, y: 55.27 },
  { id: 'lantern-6',  x: 53.39, y: 73.63 },
  { id: 'lantern-7',  x: 66.54, y: 43.85 },
  { id: 'lantern-8',  x: 40.49, y: 33.89 },
]
const LANTERNS = LIGHT_SOURCES.filter(s => s.id !== 'rose-window')
const ROSE_WINDOW = LIGHT_SOURCES.find(s => s.id === 'rose-window')

function VaultAtmosphere() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const W = () => canvas.width
    const H = () => canvas.height
    const px = (pct, dim) => (pct / 100) * dim

    // -------------------------------------------------------------------------
    // Dust motes -- stored in 0-1 percentage space so resize doesn't break them
    // -------------------------------------------------------------------------
    const motes = Array.from({ length: 80 }, () => ({
      x:            Math.random(),           // 0-1 fraction of canvas width
      y:            Math.random(),           // 0-1 fraction of canvas height
      r:            Math.random() * 1.8 + 0.5,
      speedX:       (Math.random() - 0.5) * 0.00015,  // per-frame delta as fraction
      speedY:       -(Math.random() * 0.0003 + 0.00006),
      opacity:      Math.random() * 0.65 + 0.25,
      flicker:      Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.025 + 0.006,
    }))

    // -------------------------------------------------------------------------
    // Lantern flicker state -- each lantern has an independent noise phase
    // -------------------------------------------------------------------------
    const lanternState = LANTERNS.map(() => ({
      phase:      Math.random() * Math.PI * 2,
      speed:      Math.random() * 0.04 + 0.02,
      phase2:     Math.random() * Math.PI * 2,  // second oscillator for irregular feel
      speed2:     Math.random() * 0.09 + 0.05,
    }))

    // -------------------------------------------------------------------------
    // Embers -- pool of particles, respawned from random lanterns
    // -------------------------------------------------------------------------
    const MAX_EMBERS = 40
    const embers = Array.from({ length: MAX_EMBERS }, () => spawnEmber())

    function spawnEmber() {
      const src = LANTERNS[Math.floor(Math.random() * LANTERNS.length)]
      return {
        x:       px(src.x, W()) + (Math.random() - 0.5) * 6,
        y:       px(src.y, H()) + (Math.random() - 0.5) * 4,
        r:       Math.random() * 1.2 + 0.3,
        speedX:  (Math.random() - 0.5) * 0.35,
        speedY:  -(Math.random() * 0.6 + 0.2),
        life:    1.0,
        decay:   Math.random() * 0.008 + 0.004,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.12 + 0.06,
      }
    }

    // -------------------------------------------------------------------------
    // God rays -- pre-computed fan of rays from rose window
    // -------------------------------------------------------------------------
    const NUM_RAYS = 8
    const rays = Array.from({ length: NUM_RAYS }, (_, i) => ({
      angle:   75 + (i / (NUM_RAYS - 1)) * 30,  // fan: 75deg to 105deg (narrower downward spread)
      width:   Math.random() * 0.011 + 0.005,  // slightly thicker
      opacity: Math.random() * 0.09 + 0.05,
      phase:   Math.random() * Math.PI * 2,
      speed:   Math.random() * 0.006 + 0.003,   // medium shimmer
    }))

    // -------------------------------------------------------------------------
    // Draw helpers
    // -------------------------------------------------------------------------
    function drawRays(t) {
      ctx.filter = 'blur(8px)'
      const rx = px(ROSE_WINDOW.x, W())
      const ry = px(ROSE_WINDOW.y, H())
      const len = Math.max(W(), H()) * 1.4

      rays.forEach(ray => {
        const a = ray.angle * (Math.PI / 180)
        const flicker = 0.6 + 0.4 * Math.sin(t * ray.speed + ray.phase)
        const alpha = ray.opacity * flicker
        const halfW = ray.width * W()

        // End point of ray
        const ex = rx + Math.cos(a) * len
        const ey = ry + Math.sin(a) * len

        // Perpendicular direction for ray width
        const nx = -Math.sin(a)
        const ny =  Math.cos(a)

        const grad = ctx.createLinearGradient(rx, ry, ex, ey)
        grad.addColorStop(0,    `hsla(45, 90%, 92%, ${alpha})`)
        grad.addColorStop(0.1,  `hsla(42, 85%, 85%, ${alpha * 0.8})`)
        grad.addColorStop(0.5,  `hsla(40, 80%, 80%, ${alpha * 0.35})`)
        grad.addColorStop(1,    `hsla(38, 70%, 75%, 0)`)

        ctx.beginPath()
        ctx.moveTo(rx + nx * halfW, ry + ny * halfW)
        ctx.lineTo(ex + nx * halfW * 0.1, ey + ny * halfW * 0.1)
        ctx.lineTo(ex - nx * halfW * 0.1, ey - ny * halfW * 0.1)
        ctx.lineTo(rx - nx * halfW, ry - ny * halfW)
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()
      })
      ctx.filter = 'none'
    }

    function drawLanterns(t) {
      LANTERNS.forEach((src, i) => {
        const s = lanternState[i]
        s.phase  += s.speed
        s.phase2 += s.speed2
        // Two-oscillator flicker gives irregular candle feel
        const flicker = 0.55 + 0.25 * Math.sin(s.phase) + 0.2 * Math.sin(s.phase2 * 2.3)
        const lx = px(src.x, W())
        const ly = px(src.y, H())
        const r1 = W() * 0.012 * flicker  // tight inner glow
        const r2 = W() * 0.04  * flicker  // wide outer haze

        // Outer haze
        const outer = ctx.createRadialGradient(lx, ly, 0, lx, ly, r2)
        outer.addColorStop(0,   `hsla(38, 90%, 75%, ${0.06 * flicker})`)
        outer.addColorStop(0.5, `hsla(35, 80%, 65%, ${0.025 * flicker})`)
        outer.addColorStop(1,   `hsla(30, 70%, 55%, 0)`)
        ctx.beginPath()
        ctx.arc(lx, ly, r2, 0, Math.PI * 2)
        ctx.fillStyle = outer
        ctx.fill()

        // Inner bright core
        const inner = ctx.createRadialGradient(lx, ly, 0, lx, ly, r1)
        inner.addColorStop(0,   `hsla(50, 100%, 95%, ${0.18 * flicker})`)
        inner.addColorStop(0.5, `hsla(42,  90%, 80%, ${0.08 * flicker})`)
        inner.addColorStop(1,   `hsla(38,  80%, 70%, 0)`)
        ctx.beginPath()
        ctx.arc(lx, ly, r1, 0, Math.PI * 2)
        ctx.fillStyle = inner
        ctx.fill()
      })
    }

    function drawEmbers() {
      embers.forEach((e, i) => {
        e.x      += e.speedX
        e.y      += e.speedY
        e.speedX += (Math.random() - 0.5) * 0.04  // gentle drift
        e.life   -= e.decay
        e.flicker += e.flickerSpeed
        if (e.life <= 0) { embers[i] = spawnEmber(); return }
        const a = e.life * 0.7 * (0.6 + 0.4 * Math.sin(e.flicker))
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(38, 95%, 78%, ${a})`
        ctx.fill()
      })
    }

    function drawMotes() {
      motes.forEach(m => {
        m.x += m.speedX
        m.y += m.speedY
        m.flicker += m.flickerSpeed
        // wrap in percentage space
        if (m.y < -0.002) m.y = 1.002
        if (m.x < -0.002) m.x = 1.002
        if (m.x >  1.002) m.x = -0.002
        const a = m.opacity * (0.55 + 0.45 * Math.sin(m.flicker))
        ctx.beginPath()
        ctx.arc(m.x * W(), m.y * H(), m.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(42, 80%, 90%, ${a})`
        ctx.fill()
      })
    }

    // -------------------------------------------------------------------------
    // Main loop
    // -------------------------------------------------------------------------
    let raf
    let t = 0
    const tick = () => {
      ctx.clearRect(0, 0, W(), H())
      t++
      drawRays(t)
      drawLanterns(t)
      drawEmbers()
      drawMotes()
      raf = requestAnimationFrame(tick)
    }
    tick()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}

function VaultFilterDefs() {
  return (
    <defs>
      {/* Shelf idle -- blur the fill outward. fill is our colour so no
          lantern pixels can bleed in. SourceGraphic is the soft fill,
          blurred it becomes a haze with no hard edges. */}
      <filter id="shelf-idle" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="glow" />
      </filter>

      {/* Shelf hover -- wider, stronger haze */}
      <filter id="shelf-hover" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b2" />
        <feMerge>
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>

      {/* Cat -- white fill blurs outward, neutral shimmer */}
      <filter id="cat-idle" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="glow" />
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
        fill="white"
        fillOpacity="0.08"
        stroke="none"
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
        fill="hsl(175 70% 65%)"
        fillOpacity="0.12"
        stroke="none"
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
      {/* vault-canvas: shared 3:2 coordinate space for image + SVG overlay.
          Both children fill this box identically so hotspot percentages
          map pixel-perfectly to the image at any viewport size. */}
      <div className="vault-canvas">
        <img
          src="/images/vault-background.png"
          alt="Mayu's Architecture Vault - an ancient candlelit library"
          className="vault-bg"
          draggable={false}
        />
        {/* Carries the vignette pseudo-elements anchored to the image edges */}
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

        <VaultAtmosphere />
      </div>{/* end vault-canvas */}

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
