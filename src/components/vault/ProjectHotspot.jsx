import { useState } from 'react'
import { toSVGPoints } from '../../utils/vaultHelpers.js'

// ---------------------------------------------------------------------------
// ProjectHotspot
//
// Interactive SVG hotspot for a project bookshelf. Manages its own hover
// state and delegates tooltip positioning to the parent via onTooltip.
//
// Props:
//   project   -- project data object from PROJECTS
//   isActive  -- true when this project's card or panel is open
//   onClick   -- called with project.slug when clicked
//   onTooltip -- called with { visible, label, x, y } on mouse events
// ---------------------------------------------------------------------------

export default function ProjectHotspot({ project, isActive, onClick, onTooltip }) {
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
