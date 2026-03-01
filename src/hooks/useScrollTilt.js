import { useEffect, useRef } from "react";

/**
 * useScrollTilt
 *
 * Tracks scroll position relative to the element and sets a CSS custom
 * property --tilt-progress on it. Value ranges from -1 (element above
 * viewport centre) to 1 (below centre), passing through 0 at centre.
 *
 * The image transform in CSS reads this property to drive a smooth,
 * continuous perspective tilt that responds to scroll direction and speed.
 *
 * Respects prefers-reduced-motion - sets --tilt-progress to 0 and exits.
 */
export default function useScrollTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--tilt-progress", "0");
      return;
    }

    let rafId = null;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Centre of the element relative to centre of viewport
      // -1 = element centre is at top of viewport
      //  0 = element centre is at centre of viewport
      //  1 = element centre is at bottom of viewport
      const elementCentre = rect.top + rect.height / 2;
      const viewportCentre = viewportHeight / 2;
      const distanceFromCentre = elementCentre - viewportCentre;
      const normalised = distanceFromCentre / viewportHeight;

      // Clamp to -1 / 1
      const clamped = Math.max(-1, Math.min(1, normalised));

      el.style.setProperty("--tilt-progress", clamped.toFixed(3));
      rafId = null;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    // Set initial value
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
