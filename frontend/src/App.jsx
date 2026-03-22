import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import DetectionPage from './components/DetectionPage'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function App() {
  const [tab, setTab] = useState('detect')
  const [stats, setStats] = useState({
    total_frames: 0, total_detections: 0,
    avg_inference_ms: 0, top_classes: [], history: []
  })

  const refreshStats = () => {
    fetch(`${API}/api/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }

  useEffect(() => {
    refreshStats()
    const t = setInterval(refreshStats, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="app">
      <Sidebar tab={tab} setTab={setTab} frames={stats.total_frames} />
      <main className="main">
        {tab === 'dashboard' && <Dashboard stats={stats} />}
        {tab === 'detect'    && <DetectionPage apiUrl={API} onDetect={refreshStats} />}
      </main>
    </div>
  )
}
