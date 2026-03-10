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
// All particle state lives inside the useEffect closure -- no React state involved.
// The canvas is absolutely positioned to fill its parent (vault-canvas).
// ---------------------------------------------------------------------------

const NUM_RAYS   = 8
const MAX_EMBERS = 40

export default function VaultAtmosphere() {
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
    function spawnEmber() {
      const src = LANTERNS[Math.floor(Math.random() * LANTERNS.length)]
      return {
        x:            px(src.x, W()) + (Math.random() - 0.5) * 6,
        y:            px(src.y, H()) + (Math.random() - 0.5) * 4,
        r:            Math.random() * 1.2 + 0.3,
        speedX:       (Math.random() - 0.5) * 0.35,
        speedY:       -(Math.random() * 0.6 + 0.2),
        life:         1.0,
        decay:        Math.random() * 0.008 + 0.004,
        flicker:      Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.12 + 0.06,
      }
    }

    const embers = Array.from({ length: MAX_EMBERS }, () => spawnEmber())

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
    function drawRays(t) {
      ctx.filter = 'blur(8px)'
      const rx  = px(ROSE_WINDOW.x, W())
      const ry  = px(ROSE_WINDOW.y, H())
      const len = Math.max(W(), H()) * 1.4

      rays.forEach(ray => {
        const a       = ray.angle * (Math.PI / 180)
        const flicker = 0.6 + 0.4 * Math.sin(t * ray.speed + ray.phase)
        const alpha   = ray.opacity * flicker
        const halfW   = ray.width * W()
        const ex = rx + Math.cos(a) * len
        const ey = ry + Math.sin(a) * len
        const nx = -Math.sin(a)
        const ny =  Math.cos(a)

        const grad = ctx.createLinearGradient(rx, ry, ex, ey)
        grad.addColorStop(0,   `hsla(45, 90%, 92%, ${alpha})`)
        grad.addColorStop(0.1, `hsla(42, 85%, 85%, ${alpha * 0.8})`)
        grad.addColorStop(0.5, `hsla(40, 80%, 80%, ${alpha * 0.35})`)
        grad.addColorStop(1,   `hsla(38, 70%, 75%, 0)`)

        ctx.beginPath()
        ctx.moveTo(rx + nx * halfW,        ry + ny * halfW)
        ctx.lineTo(ex + nx * halfW * 0.1,  ey + ny * halfW * 0.1)
        ctx.lineTo(ex - nx * halfW * 0.1,  ey - ny * halfW * 0.1)
        ctx.lineTo(rx - nx * halfW,        ry - ny * halfW)
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()
      })
      ctx.filter = 'none'
    }

    function drawLanterns() {
      LANTERNS.forEach((src, i) => {
        const s = lanternState[i]
        s.phase  += s.speed
        s.phase2 += s.speed2
        const flicker = 0.55 + 0.25 * Math.sin(s.phase) + 0.2 * Math.sin(s.phase2 * 2.3)
        const lx = px(src.x, W())
        const ly = px(src.y, H())
        const r1 = W() * 0.012 * flicker
        const r2 = W() * 0.04  * flicker

        const outer = ctx.createRadialGradient(lx, ly, 0, lx, ly, r2)
        outer.addColorStop(0,   `hsla(38, 90%, 75%, ${0.06 * flicker})`)
        outer.addColorStop(0.5, `hsla(35, 80%, 65%, ${0.025 * flicker})`)
        outer.addColorStop(1,   `hsla(30, 70%, 55%, 0)`)
        ctx.beginPath()
        ctx.arc(lx, ly, r2, 0, Math.PI * 2)
        ctx.fillStyle = outer
        ctx.fill()

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
        e.speedX += (Math.random() - 0.5) * 0.04
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
      drawLanterns()
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
