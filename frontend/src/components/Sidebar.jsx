const GridIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const ScanIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
    <rect x="7" y="7" width="10" height="10" rx="1"/>
  </svg>
)

export default function Sidebar({ tab, setTab, frames }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <GridIcon /> },
    { id: 'detect',    label: 'Detect',    icon: <ScanIcon />,
      badge: frames > 0 ? frames : null },
  ]
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-dot" />
          <span>YOLOv8 Detect</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {items.map(it => (
          <button key={it.id} className={`nav-item ${tab === it.id ? 'active' : ''}`}
            onClick={() => setTab(it.id)}>
            {it.icon}<span>{it.label}</span>
            {it.badge != null && (
              <span style={{marginLeft:'auto',fontSize:11,background:'var(--accent-bg)',
                color:'var(--accent)',padding:'1px 7px',borderRadius:20,
                border:'1px solid var(--accent-border)'}}>{it.badge}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">YOLOv8 · OpenCV · PyTorch</div>
    </aside>
  )
}
