import { useState, useRef } from 'react'

const COLORS = [
  '#ff5757','#57bdff','#57ff8c','#ffc857','#c857ff',
  '#ff8c57','#57ffdc','#ff57c8','#8cff57','#5757ff',
]

export default function DetectionPage({ apiUrl, onDetect }) {
  const [dragOver, setDragOver]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState(null)
  const [preview, setPreview]       = useState(null)
  const [conf, setConf]             = useState(0.4)
  const [error, setError]           = useState(null)
  const inputRef = useRef()

  const runDetection = async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['jpg','jpeg','png','bmp','webp'].includes(ext)) {
      setError('Only image files are supported (jpg, png, bmp, webp)')
      return
    }

    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
    setLoading(true)

    const form = new FormData()
    form.append('file', file)
    form.append('confidence', conf)

    try {
      const res  = await fetch(`${apiUrl}/api/detect`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Detection failed')
      setResult(data)
      onDetect()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    runDetection(e.dataTransfer.files[0])
  }

  const detections = result?.detections || []

  return (
    <>
      <div className="page-header">
        <div className="page-title">Object Detection</div>
        <div className="page-sub">Upload an image — YOLOv8 detects and classifies objects in real time</div>
      </div>

      <div className="detect-layout">
        {/* ── Main column ── */}
        <div className="detect-main">

          {/* Confidence slider */}
          <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'14px 16px'}}>
            <div className="slider-row">
              <span className="slider-label">Confidence threshold</span>
              <input type="range" min="0.1" max="0.95" step="0.05" value={conf}
                onChange={e => setConf(parseFloat(e.target.value))} />
              <span className="slider-val">{Math.round(conf * 100)}%</span>
            </div>
            <div style={{fontSize:12,color:'var(--text3)'}}>
              Lower = more detections (may include noise) · Higher = only confident detections
            </div>
          </div>

          {/* Upload zone */}
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !loading && inputRef.current?.click()}
          >
            <svg width="40" height="40" fill="none" stroke="var(--text3)" strokeWidth="1.2"
              viewBox="0 0 24 24" style={{marginBottom:10}}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <div className="upload-title">Drop an image here or click to browse</div>
            <div className="upload-sub">JPG · PNG · BMP · WEBP</div>
            <button className="upload-btn" disabled={loading}>
              {loading ? 'Detecting…' : 'Choose image'}
            </button>
            <input ref={inputRef} type="file" accept="image/*"
              style={{display:'none'}} onChange={e => runDetection(e.target.files[0])} />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Loading spinner */}
          {loading && (
            <div style={{display:'flex',alignItems:'center',gap:12,padding:'20px 0',
              color:'var(--text2)',fontSize:13}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="var(--accent)" strokeWidth="2"
                style={{animation:'spin 1s linear infinite'}}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Running YOLOv8 inference…
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* Result image */}
          {result && (
            <div className="result-img-wrap">
              <img src={result.image} alt="Detection result" className="result-img" />
              <div className="result-badge">
                {result.count} object{result.count !== 1 ? 's' : ''} · {result.inference_ms} ms
              </div>
            </div>
          )}

          {/* Original preview (shown before result returns) */}
          {preview && !result && !loading && (
            <div className="result-img-wrap">
              <img src={preview} alt="Preview" className="result-img" style={{opacity:0.5}} />
            </div>
          )}
        </div>

        {/* ── Side panel ── */}
        <div className="detect-side">
          <div style={{fontSize:12,fontWeight:500,color:'var(--text2)',
            textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:12}}>
            Detections {detections.length > 0 && `(${detections.length})`}
          </div>

          {detections.length === 0 && (
            <div style={{color:'var(--text3)',fontSize:13,paddingTop:8}}>
              {result ? 'No objects detected above threshold.' : 'Results will appear here after detection.'}
            </div>
          )}

          {detections.map((d, i) => (
            <div className="det-row" key={i}>
              <div className="det-dot" style={{background: COLORS[i % COLORS.length]}} />
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span className="det-label">{d.label}</span>
                  <span className="det-conf">{Math.round(d.confidence * 100)}%</span>
                </div>
                <div className="conf-bar">
                  <div className="conf-fill" style={{
                    width: `${Math.round(d.confidence * 100)}%`,
                    background: COLORS[i % COLORS.length]
                  }} />
                </div>
                <div style={{fontSize:11,color:'var(--text3)',marginTop:3,fontFamily:'var(--mono)'}}>
                  {d.bbox[2]}×{d.bbox[3]}px @ ({d.bbox[0]},{d.bbox[1]})
                </div>
              </div>
            </div>
          ))}

          {result && Object.keys(result.class_distribution).length > 0 && (
            <div style={{marginTop:20}}>
              <div style={{fontSize:12,fontWeight:500,color:'var(--text2)',
                textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8}}>
                Class summary
              </div>
              <div className="cls-grid">
                {Object.entries(result.class_distribution).map(([cls, cnt]) => (
                  <span className="cls-pill" key={cls}>{cls} ×{cnt}</span>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div style={{marginTop:20,background:'var(--bg3)',borderRadius:'var(--radius-sm)',
              padding:'10px 12px',fontSize:12,color:'var(--text2)',lineHeight:1.8}}>
              <div>Image: {result.image_size?.width}×{result.image_size?.height}px</div>
              <div>Inference: <span style={{color:'var(--green)',fontFamily:'var(--mono)'}}>{result.inference_ms} ms</span></div>
              <div>Confidence: <span style={{color:'var(--accent)',fontFamily:'var(--mono)'}}>{Math.round(conf * 100)}%</span></div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
