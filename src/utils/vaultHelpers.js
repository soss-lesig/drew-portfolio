// ---------------------------------------------------------------------------
// Vault utility functions
// ---------------------------------------------------------------------------

/**
 * resolveCardAnchor
 * Determines whether a project card anchors from the left or right edge.
 * Cards whose left% > 65 would overflow the right viewport edge, so we
 * flip them to right-anchored and apply the modifier class.
 *
 * @param {{ left?: string, top?: string }} anchor
 * @returns {{ style: object, className: string }}
 */
export function resolveCardAnchor(anchor) {
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

/**
 * toSVGPoints
 * Converts an array of [x, y] coordinate pairs to an SVG points string.
 * Used for SVG <polygon> elements in the vault hotspot overlay.
 *
 * @param {number[][]} points
 * @returns {string}
 */
export function toSVGPoints(points) {
  return points.map(([x, y]) => `${x},${y}`).join(' ')
}
