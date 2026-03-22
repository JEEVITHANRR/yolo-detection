export default function StatsPanel({ stats }) {
  if (!stats) return null
  return (
    <div style={{
      background:'var(--bg2)',border:'1px solid var(--border)',
      borderRadius:'var(--radius)',padding:'14px 16px',marginTop:16
    }}>
      <div className="section-title">Session stats</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {[
          ['Frames', stats.total_frames],
          ['Detections', stats.total_detections],
          ['Avg ms', stats.avg_inference_ms],
          ['Classes', stats.top_classes?.length || 0],
        ].map(([label, val]) => (
          <div key={label} style={{
            background:'var(--bg3)',borderRadius:'var(--radius-sm)',
            padding:'10px 12px'
          }}>
            <div style={{fontSize:11,color:'var(--text2)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.04em'}}>{label}</div>
            <div style={{fontSize:20,fontWeight:600,color:'var(--text)'}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
