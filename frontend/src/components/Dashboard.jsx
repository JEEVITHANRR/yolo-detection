import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell
} from 'recharts'

const TIP_STYLE = {
  background: '#22263a', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6, fontSize: 12
}

export default function Dashboard({ stats }) {
  const histData = stats.history.map((h, i) => ({
    frame: i + 1,
    detections: h.count,
    ms: h.inference_ms,
  }))

  const classData = stats.top_classes.slice(0, 8)

  return (
    <>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Session statistics — auto-refreshes every 5 seconds</div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Frames processed</div>
          <div className="stat-val">{stats.total_frames}</div>
          <div className="stat-sub">Images analysed</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total detections</div>
          <div className="stat-val">{stats.total_detections}</div>
          <div className="stat-sub">Objects found</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg inference</div>
          <div className="stat-val">{stats.avg_inference_ms}<span style={{fontSize:14,fontWeight:400}}> ms</span></div>
          <div className="stat-sub">Per frame</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unique classes</div>
          <div className="stat-val">{stats.top_classes.length}</div>
          <div className="stat-sub">Detected so far</div>
        </div>
      </div>

      <div className="dashboard">
        <div className="two-col" style={{marginTop:20}}>
          <div className="chart-section" style={{marginTop:0}}>
            <div className="section-title">Detections per frame</div>
            {histData.length === 0
              ? <div style={{color:'var(--text3)',fontSize:13,padding:'20px 0',textAlign:'center'}}>No data yet</div>
              : <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={histData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="frame" tick={{fill:'#555b72',fontSize:11}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:'#555b72',fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={TIP_STYLE} labelStyle={{color:'#8b90a4'}} itemStyle={{color:'#e8eaf0'}} />
                    <Line type="monotone" dataKey="detections" stroke="#a78bfa" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
            }
          </div>

          <div className="chart-section" style={{marginTop:0}}>
            <div className="section-title">Inference time (ms)</div>
            {histData.length === 0
              ? <div style={{color:'var(--text3)',fontSize:13,padding:'20px 0',textAlign:'center'}}>No data yet</div>
              : <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={histData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="frame" tick={{fill:'#555b72',fontSize:11}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill:'#555b72',fontSize:11}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TIP_STYLE} labelStyle={{color:'#8b90a4'}} itemStyle={{color:'#e8eaf0'}} />
                    <Line type="monotone" dataKey="ms" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
            }
          </div>
        </div>

        <div className="chart-section">
          <div className="section-title">Top detected classes</div>
          {classData.length === 0
            ? <div style={{color:'var(--text3)',fontSize:13,padding:'20px 0',textAlign:'center'}}>No detections yet — run the detector first</div>
            : <ResponsiveContainer width="100%" height={200}>
                <BarChart data={classData} barSize={20} layout="vertical">
                  <XAxis type="number" tick={{fill:'#555b72',fontSize:11}} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="label" tick={{fill:'#8b90a4',fontSize:12}} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={TIP_STYLE} labelStyle={{color:'#8b90a4'}} itemStyle={{color:'#e8eaf0'}} />
                  <Bar dataKey="count" radius={[0,4,4,0]}>
                    {classData.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? '#a78bfa' : '#7c3aed'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </div>
      </div>
    </>
  )
}
