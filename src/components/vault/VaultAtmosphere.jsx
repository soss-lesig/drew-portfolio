import { useEffect, useRef } from 'react'
import { LANTERNS, ROSE_WINDOW } from '../../data/vault.js'

// ---------------------------------------------------------------------------
// VaultAtmosphere
//
// Canvas-based atmosphere renderer. Draws four layered effects each frame:
//   1. God rays    -- fan of blurred gradient beams from the rose window
//   2. Lanterns    -- radial glow at each light source with two-oscillator flicker
//   3. Embers      -- short-lived particles spawned from random lanterns, drift upward
//   4. Dust motes  -- long-lived drifting particles in percentage space (resize-safe)
//
// Performance notes:
//   - God rays are pre-rendered to an offscreen canvas and composited via drawImage.
//     This eliminates the per-frame ctx.filter blur pass (the single biggest CPU cost).
//     The offscreen canvas is only redrawn every RAY_REDRAW_INTERVAL frames since
//     ray opacity changes slowly.
//   - W/H are cached at the top of each tick to avoid repeated property lookups.
//   - Lantern colour stop strings are pre-built as constants -- only gradient
//     geometry (position, radius) changes per frame.
//   - Particle counts are tuned to be visually sufficient without excess draw calls.
//   - prefers-reduced-motion: loop does not start if the user has requested it.
// ---------------------------------------------------------------------------

const NUM_RAYS            = 8
const MAX_EMBERS          = 25
const NUM_MOTES           = 50
const RAY_REDRAW_INTERVAL = 4   // redraw offscreen ray canvas every N frames

// Pre-built colour stop strings -- these never change, no per-frame allocation needed
const RAY_STOP_0      = 'hsla(45, 90%, 92%,'
const RAY_STOP_1      = 'hsla(42, 85%, 85%,'
const RAY_STOP_2      = 'hsla(40, 80%, 80%,'
const LANTERN_OUTER_0 = 'hsla(38, 90%, 75%,'
const LANTERN_OUTER_1 = 'hsla(35, 80%, 65%,'
const LANTERN_INNER_0 = 'hsla(50, 100%, 95%,'
const LANTERN_INNER_1 = 'hsla(42,  90%, 80%,'
const EMBER_COLOUR    = 'hsla(38, 95%, 78%,'
const MOTE_COLOUR     = 'hsla(42, 80%, 90%,'

export default function VaultAtmosphere() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Respect prefers-reduced-motion -- skip the loop entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Offscreen canvas for god rays -- blurred once per RAY_REDRAW_INTERVAL frames
    const offscreen = document.createElement('canvas')
    const offCtx    = offscreen.getContext('2d')

    // Declared before resize so the closure can reference them immediately
    let raysDirty     = true
    let rayFrameCount = 0

    const resize = () => {
      canvas.width     = canvas.offsetWidth
      canvas.height    = canvas.offsetHeight
      offscreen.width  = canvas.width
      offscreen.height = canvas.height
      raysDirty = true
    }
    resize()

    const px = (pct, dim) => (pct / 100) * dim

    // -------------------------------------------------------------------------
    // Dust motes -- stored in 0-1 percentage space so resize doesn't break them
    // -------------------------------------------------------------------------
    const motes = Array.from({ length: NUM_MOTES }, () => ({
      x:            Math.random(),
      y:            Math.random(),
      r:            Math.random() * 1.8 + 0.5,
      speedX:       (Math.random() - 0.5) * 0.00015,
      speedY:       -(Math.random() * 0.0003 + 0.00006),
      opacity:      Math.random() * 0.65 + 0.25,
      flicker:      Math.random() * Math.PI * 2,
      flickerSpeed: Math.random() * 0.025 + 0.006,
    }))

    // -------------------------------------------------------------------------
    // Lantern flicker state -- independent noise phase per lantern
    // -------------------------------------------------------------------------
    const lanternState = LANTERNS.map(() => ({
      phase:  Math.random() * Math.PI * 2,
      speed:  Math.random() * 0.04 + 0.02,
      phase2: Math.random() * Math.PI * 2,
      speed2: Math.random() * 0.09 + 0.05,
    }))

    // -------------------------------------------------------------------------
    // Embers -- pool of particles, respawned from random lanterns
    // -------------------------------------------------------------------------
    function spawnEmber(w, h) {
      const src = LANTERNS[Math.floor(Math.random() * LANTERNS.length)]
      return {
        x:            px(src.x, w) + (Math.random() - 0.5) * 6,
        y:            px(src.y, h) + (Math.random() - 0.5) * 4,
        r:            Math.random() * 1.2 + 0.3,
        speedX:       (Math.random() - 0.5) * 0.35,
        speedY:       -(Math.random() * 0.6 + 0.2),
        life:         1.0,
        decay:        Math.random() * 0.008 + 0.004,
        flicker:      Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.12 + 0.06,
      }
    }

    const embers = Array.from({ length: MAX_EMBERS }, () => spawnEmber(canvas.width, canvas.height))

    // -------------------------------------------------------------------------
    // God rays -- pre-computed fan from rose window
    // -------------------------------------------------------------------------
    const rays = Array.from({ length: NUM_RAYS }, (_, i) => ({
      angle:   75 + (i / (NUM_RAYS - 1)) * 30,
      width:   Math.random() * 0.011 + 0.005,
      opacity: Math.random() * 0.09 + 0.05,
      phase:   Math.random() * Math.PI * 2,
      speed:   Math.random() * 0.006 + 0.003,
    }))

    // -------------------------------------------------------------------------
    // Draw helpers
    // -------------------------------------------------------------------------

    // Renders god rays onto the offscreen canvas with a single blur pass.
    // Called only every RAY_REDRAW_INTERVAL frames -- rays change slowly.
    function redrawRays(t, w, h) {
      offCtx.clearRect(0, 0, w, h)
      offCtx.filter = 'blur(8px)'

      const rx  = px(ROSE_WINDOW.x, w)
      const ry  = px(ROSE_WINDOW.y, h)
      const len = Math.max(w, h) * 1.4

      rays.forEach(ray => {
        const a       = ray.angle * (Math.PI / 180)
        const flicker = 0.6 + 0.4 * Math.sin(t * ray.speed + ray.phase)
        const alpha   = ray.opacity * flicker
        const halfW   = ray.width * w
        const ex = rx + Math.cos(a) * len
        const ey = ry + Math.sin(a) * len
        const nx = -Math.sin(a)
        const ny =  Math.cos(a)

        const grad = offCtx.createLinearGradient(rx, ry, ex, ey)
        grad.addColorStop(0,   `${RAY_STOP_0} ${alpha})`)
        grad.addColorStop(0.1, `${RAY_STOP_1} ${(alpha * 0.8).toFixed(3)})`)
        grad.addColorStop(0.5, `${RAY_STOP_2} ${(alpha * 0.35).toFixed(3)})`)
        grad.addColorStop(1,   'hsla(38, 70%, 75%, 0)')

        offCtx.beginPath()
        offCtx.moveTo(rx + nx * halfW,       ry + ny * halfW)
        offCtx.lineTo(ex + nx * halfW * 0.1, ey + ny * halfW * 0.1)
        offCtx.lineTo(ex - nx * halfW * 0.1, ey - ny * halfW * 0.1)
        offCtx.lineTo(rx - nx * halfW,       ry - ny * halfW)
        offCtx.closePath()
        offCtx.fillStyle = grad
        offCtx.fill()
      })

      offCtx.filter = 'none'
    }

    function drawLanterns(w, h) {
      LANTERNS.forEach((src, i) => {
        const s = lanternState[i]
        s.phase  += s.speed
        s.phase2 += s.speed2
        const flicker = 0.55 + 0.25 * Math.sin(s.phase) + 0.2 * Math.sin(s.phase2 * 2.3)
        const lx = px(src.x, w)
        const ly = px(src.y, h)
        const r1 = w * 0.012 * flicker
        const r2 = w * 0.04  * flicker

        const outer = ctx.createRadialGradient(lx, ly, 0, lx, ly, r2)
        outer.addColorStop(0,   `${LANTERN_OUTER_0} ${(0.06 * flicker).toFixed(3)})`)
        outer.addColorStop(0.5, `${LANTERN_OUTER_1} ${(0.025 * flicker).toFixed(3)})`)
        outer.addColorStop(1,   'hsla(30, 70%, 55%, 0)')
        ctx.beginPath()
        ctx.arc(lx, ly, r2, 0, Math.PI * 2)
        ctx.fillStyle = outer
        ctx.fill()

        const inner = ctx.createRadialGradient(lx, ly, 0, lx, ly, r1)
        inner.addColorStop(0,   `${LANTERN_INNER_0} ${(0.18 * flicker).toFixed(3)})`)
        inner.addColorStop(0.5, `${LANTERN_INNER_1} ${(0.08 * flicker).toFixed(3)})`)
        inner.addColorStop(1,   'hsla(38, 80%, 70%, 0)')
        ctx.beginPath()
        ctx.arc(lx, ly, r1, 0, Math.PI * 2)
        ctx.fillStyle = inner
        ctx.fill()
      })
    }

    function drawEmbers(w, h) {
      embers.forEach((e, i) => {
        e.x       += e.speedX
        e.y       += e.speedY
        e.speedX  += (Math.random() - 0.5) * 0.04
        e.life    -= e.decay
        e.flicker += e.flickerSpeed
        if (e.life <= 0) { embers[i] = spawnEmber(w, h); return }
        const a = e.life * 0.7 * (0.6 + 0.4 * Math.sin(e.flicker))
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
        ctx.fillStyle = `${EMBER_COLOUR} ${a.toFixed(3)})`
        ctx.fill()
      })
    }

    function drawMotes(w, h) {
      motes.forEach(m => {
        m.x       += m.speedX
        m.y       += m.speedY
        m.flicker += m.flickerSpeed
        if (m.y < -0.002) m.y = 1.002
        if (m.x < -0.002) m.x = 1.002
        if (m.x >  1.002) m.x = -0.002
        const a = m.opacity * (0.55 + 0.45 * Math.sin(m.flicker))
        ctx.beginPath()
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2)
        ctx.fillStyle = `${MOTE_COLOUR} ${a.toFixed(3)})`
        ctx.fill()
      })
    }

    // -------------------------------------------------------------------------
    // Main loop
    // -------------------------------------------------------------------------
    let raf
    let t = 0

    const tick = () => {
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)
      t++

      // Rays: composite from offscreen, only re-render every RAY_REDRAW_INTERVAL frames
      rayFrameCount++
      if (raysDirty || rayFrameCount >= RAY_REDRAW_INTERVAL) {
        redrawRays(t, w, h)
        raysDirty     = false
        rayFrameCount = 0
      }
      ctx.drawImage(offscreen, 0, 0)

      drawLanterns(w, h)
      drawEmbers(w, h)
      drawMotes(w, h)

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

// ---------------------------------------------------------------------------
// VaultFilterDefs
//
// SVG filter definitions for hotspot polygon glows.
// Must render inside the vault SVG before any polygons that reference
// these filter IDs. Co-located here as both are pure rendering infrastructure.
//
// shelf-idle  -- soft single-pass blur for the resting pulse
// shelf-hover -- wider two-pass blur for the hover state
// cat-idle    -- neutral blur for cat hotspots (no hover variant; cats are easter eggs)
// ---------------------------------------------------------------------------

export function VaultFilterDefs() {
  return (
    <defs>
      <filter id="shelf-idle" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="glow" />
      </filter>

      <filter id="shelf-hover" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b2" />
        <feMerge>
          <feMergeNode in="b2" />
          <feMergeNode in="b1" />
        </feMerge>
      </filter>

      <filter id="cat-idle" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="glow" />
      </filter>
    </defs>
  )
}
