import { useEffect, useRef, useState } from 'react'
import { useVaultTransition } from '../hooks/useVaultTransition.jsx'

// ---------------------------------------------------------------------------
// VaultTransitionOverlay
//
// Full-screen cinematic overlay. Stays opaque through navigation in both
// directions so the new page is always revealed by a fade, never a snap.
//
// ENTER sequence:
//   entering  0ms     fade to black (700ms)
//             350ms   title fades in at screen centre
//             1300ms  cross-dissolve to bottom-left title + subtitle
//             2400ms  completeEnter() -- navigate('/vault'), phase -> revealing
//   revealing          overlay fades out over mounted vault page (500ms)
//             500ms   finishReveal() -- phase -> idle
//
// EXIT sequence:
//   exiting   0ms     black curtain falls (600ms)
//             700ms   completeExit() -- navigate(dest), phase -> revealing
//   revealing          overlay fades out over mounted site page (500ms)
//             500ms   finishReveal() -- phase -> idle
// ---------------------------------------------------------------------------

const REVEAL_DURATION = 500

export default function VaultTransitionOverlay() {
  const { phase, completeEnter, completeExit, finishReveal } = useVaultTransition()
  const timerRefs = useRef([])
  const [stage, setStage] = useState('centre') // 'centre' | 'bottomleft'

  const isActive = phase !== 'idle'

  useEffect(() => {
    if (phase === 'entering') setStage('centre')
  }, [phase])

  useEffect(() => {
    timerRefs.current.forEach(clearTimeout)
    timerRefs.current = []

    if (phase === 'entering') {
      const t1 = setTimeout(() => setStage('bottomleft'), 1300)
      const t2 = setTimeout(completeEnter, 2400)
      timerRefs.current.push(t1, t2)
    }

    if (phase === 'exiting') {
      const t = setTimeout(completeExit, 700)
      timerRefs.current.push(t)
    }

    if (phase === 'revealing') {
      // Overlay fades out (CSS handles the animation), then we go idle
      const t = setTimeout(finishReveal, REVEAL_DURATION + 50)
      timerRefs.current.push(t)
    }
  }, [phase, completeEnter, completeExit, finishReveal])

  useEffect(() => {
    return () => timerRefs.current.forEach(clearTimeout)
  }, [])

  if (!isActive) return null

  return (
    <div
      className={`vault-transition-overlay vault-transition-overlay--${phase}`}
      aria-hidden="true"
    >
      <div className="vault-transition-bg" />

      {phase === 'entering' && (
        <>
          {/* Stage 1: title centred */}
          <div className={`vault-transition-centre${stage !== 'centre' ? ' vault-transition-centre--out' : ''}`}>
            <h1 className="vault-transition-title">
              Mayu's Architecture Vault
              <span className="vault-transition-alpha">ALPHA</span>
            </h1>
          </div>

          {/* Stage 2: title + subtitle at bottom-left */}
          <div className={`vault-transition-bottomleft${stage === 'bottomleft' ? ' vault-transition-bottomleft--in' : ''}`}>
            <h1 className="vault-transition-title">
              Mayu's Architecture Vault
              <span className="vault-transition-alpha">ALPHA</span>
            </h1>
            <p className="vault-transition-subtitle">
              Architectural decisions, system design, and honest post-mortems across every project.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
