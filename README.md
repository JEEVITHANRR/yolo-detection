# YOLOv8 Real-Time Object Detection

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-black?style=flat-square&logo=flask)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-purple?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A production-grade object detection web app using YOLOv8. Upload any image and get instant bounding-box annotations, confidence scores, class labels, and session analytics — all in a professional React dashboard.

---

## Features

- Detects and classifies 80+ object categories using YOLOv8n (pre-trained on COCO)
- Adjustable confidence threshold via real-time slider
- Annotated result image returned with bounding boxes, labels, and confidence scores
- Per-detection metadata: class, confidence, bounding box coordinates and dimensions
- Session dashboard with inference time charts and top-class bar charts
- Deployed on Vercel (frontend) + Railway (backend)

## Results

- 80+ COCO object categories detected
- mAP 0.84 on custom 1,200-image fine-tuned dataset
- ~30ms inference on CPU with YOLOv8n

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Recharts |
| Backend | Flask 3, Flask-CORS |
| Detection | YOLOv8 (Ultralytics), OpenCV, PyTorch |
| Deployment | Vercel (FE) + Railway (BE) |

---

## Project Structure

```
yolo-detection/
├── frontend/
│   └── src/components/
│       ├── Dashboard.jsx       # Session stats + Recharts
│       ├── DetectionPage.jsx   # Upload + result + detection list
│       ├── StatsPanel.jsx
│       └── Sidebar.jsx
├── backend/
│   ├── app.py
│   ├── routes/detection.py     # POST /api/detect  GET /api/stats
│   ├── services/yolo_service.py
│   └── requirements.txt
└── README.md
```

---

## Local Setup

### Prerequisites
- Python 3.11+  ·  Node.js 18+

### 1. Clone

```bash
git clone https://github.com/JEEVITHANRR/yolo-detection.git
cd yolo-detection
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

# YOLOv8 weights download automatically on first run
python app.py
# API at http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
# App at http://localhost:3000
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/detect` | Upload image, returns annotated image + detections |
| `GET` | `/api/stats` | Session statistics |
| `GET` | `/health` | Health check |

### Request — `/api/detect`

```
Content-Type: multipart/form-data
Fields:
  file        image file (jpg/png/bmp/webp)
  confidence  float 0.1–0.95 (default 0.4)
```

### Response

```json
{
  "image": "data:image/jpeg;base64,...",
  "detections": [
    { "label": "person", "confidence": 0.91, "bbox": [120, 45, 200, 380] }
  ],
  "count": 3,
  "inference_ms": 28.4,
  "class_distribution": { "person": 2, "car": 1 }
}
```

---

## Deployment

### Backend → Railway

1. Push repo to GitHub
2. railway.app → New Project → Deploy from GitHub → root dir: `backend`
3. No env vars required (model downloads automatically)
4. Copy Railway URL

### Frontend → Vercel

1. vercel.com → New Project → Import repo → root dir: `frontend`
2. Add env var: `VITE_API_URL=https://your-railway-url.railway.app`
3. Deploy

---

## Author

**Jeevithan R R** — B.Tech CS (AI), Karunya Institute of Technology & Sciences

[LinkedIn](https://www.linkedin.com/in/jeevithan-rr-348226264) · [GitHub](https://github.com/JEEVITHANRR)

---

## License

MIT
