// ---------------------------------------------------------------------------
// VaultMobileCard
//
// Frosted glass project card for the mobile vault layout.
// Hidden on desktop via CSS (.vault-mobile-list display: none).
// Tapping opens the expanded panel directly -- skips the desktop card state.
// ---------------------------------------------------------------------------

export default function VaultMobileCard({ project, onOpen }) {
  return (
    <button
      className="vault-mobile-card"
      onClick={() => onOpen(project.slug)}
      aria-label={`Open ${project.title} architecture vault`}
    >
      <p className="vault-mobile-card__eyebrow">Architecture vault</p>
      <h2 className="vault-mobile-card__title">{project.title}</h2>
      <p className="vault-mobile-card__subtitle">{project.subtitle}</p>
      <span className="vault-mobile-card__arrow" aria-hidden="true">→</span>
    </button>
  )
}
