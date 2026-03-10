import { toSVGPoints } from '../../utils/vaultHelpers.js'

// ---------------------------------------------------------------------------
// CatHotspot
//
// Easter egg SVG hotspot for Meeko and Mayu. Clicking triggers an affirmation
// fetch via the parent's onAffirmation handler. Deliberately has no hover
// visual feedback -- cats are meant to be discovered, not signposted.
// ---------------------------------------------------------------------------

export default function CatHotspot({ cat, onAffirmation, disabled }) {
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
