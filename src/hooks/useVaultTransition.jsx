import { createContext, useContext, useState, useCallback, useRef } from 'react'

// ---------------------------------------------------------------------------
// Vault Transition Context
//
// State machine for the cinematic vault entry/exit sequence.
//
// States:
//   idle      -- no transition active
//   entering  -- black curtain + title sequence playing (pre-navigation)
//   revealing -- navigated, overlay fading out to reveal new page
//   exiting   -- black curtain falling over vault (pre-navigation)
//
// The key principle: navigation always happens while the overlay is fully
// opaque (black). The overlay then fades out to reveal the new page.
// This eliminates both the entry black flash and the exit flashbang.
//
// Consumers:
//   - Header.jsx                  -- hover preview, click intercepts
//   - VaultTransitionOverlay.jsx  -- runs animations, calls complete* fns
// ---------------------------------------------------------------------------

const VaultTransitionContext = createContext(null)

export function VaultTransitionProvider({ children }) {
  const [phase, setPhase] = useState('idle')
  const navigateRef = useRef(null)
  const destinationRef = useRef(null)

  const startEnter = useCallback((navigateFn) => {
    navigateRef.current = navigateFn
    setPhase('entering')
  }, [])

  // Called by overlay when title sequence is done.
  // Sets data-page BEFORE navigating so vault styles are active when overlay lifts.
  const completeEnter = useCallback(() => {
    document.body.setAttribute('data-page', 'vault')
    navigateRef.current?.('/vault')
    setPhase('revealing')
  }, [])

  const startExit = useCallback((destination, navigateFn) => {
    destinationRef.current = destination
    navigateRef.current = navigateFn
    setPhase('exiting')
  }, [])

  // Called by overlay when curtain is fully down.
  // Removes data-page BEFORE navigating so site styles are active when overlay lifts.
  const completeExit = useCallback(() => {
    document.body.removeAttribute('data-page')
    const dest = destinationRef.current ?? '/'
    navigateRef.current?.(dest)
    destinationRef.current = null
    setPhase('revealing')
  }, [])

  // Called by overlay once the reveal fade-out is complete.
  const finishReveal = useCallback(() => {
    setPhase('idle')
    navigateRef.current = null
  }, [])

  const reset = useCallback(() => {
    setPhase('idle')
    navigateRef.current = null
    destinationRef.current = null
  }, [])

  return (
    <VaultTransitionContext.Provider value={{
      phase,
      startEnter,
      completeEnter,
      startExit,
      completeExit,
      finishReveal,
      reset,
    }}>
      {children}
    </VaultTransitionContext.Provider>
  )
}

export function useVaultTransition() {
  const ctx = useContext(VaultTransitionContext)
  if (!ctx) throw new Error('useVaultTransition must be used within VaultTransitionProvider')
  return ctx
}
