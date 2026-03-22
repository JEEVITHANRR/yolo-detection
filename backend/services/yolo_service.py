import os
import cv2
import numpy as np
import base64
import time
from ultralytics import YOLO
from collections import Counter

MODEL_PATH = os.environ.get("YOLO_MODEL", "yolov8n.pt")

_model = None
_detection_history = []
_session_stats = {
    "total_frames": 0,
    "total_detections": 0,
    "avg_fps": 0,
    "class_counts": {},
}


def _get_model():
    global _model
    if _model is None:
        _model = YOLO(MODEL_PATH)
    return _model


def detect_image(file_bytes: bytes, conf_threshold: float = 0.4) -> dict:
    global _detection_history, _session_stats

    model = _get_model()

    nparr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")

    h, w = img.shape[:2]

    t0 = time.time()
    results = model(img, conf=conf_threshold, verbose=False)[0]
    inference_ms = round((time.time() - t0) * 1000, 1)

    detections = []
    class_names = []

    for box in results.boxes:
        cls_id = int(box.cls[0])
        label = model.names[cls_id]
        conf = float(box.conf[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

        color = _class_color(cls_id)
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
        text = f"{label} {conf:.2f}"
        (tw, th), _ = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 1)
        cv2.rectangle(img, (x1, y1 - th - 8), (x1 + tw + 4, y1), color, -1)
        cv2.putText(img, text, (x1 + 2, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)

        detections.append({
            "label": label,
            "confidence": round(conf, 3),
            "bbox": [x1, y1, x2 - x1, y2 - y1],
        })
        class_names.append(label)

    _, buffer = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 88])
    img_b64 = base64.b64encode(buffer).decode("utf-8")

    class_dist = dict(Counter(class_names))

    entry = {
        "timestamp": time.strftime("%H:%M:%S"),
        "count": len(detections),
        "inference_ms": inference_ms,
        "classes": class_dist,
    }
    _detection_history.append(entry)
    if len(_detection_history) > 50:
        _detection_history = _detection_history[-50:]

    _session_stats["total_frames"] += 1
    _session_stats["total_detections"] += len(detections)
    for cls, cnt in class_dist.items():
        _session_stats["class_counts"][cls] = _session_stats["class_counts"].get(cls, 0) + cnt

    return {
        "image": f"data:image/jpeg;base64,{img_b64}",
        "detections": detections,
        "count": len(detections),
        "inference_ms": inference_ms,
        "image_size": {"width": w, "height": h},
        "class_distribution": class_dist,
    }


def get_stats() -> dict:
    top_classes = sorted(
        _session_stats["class_counts"].items(), key=lambda x: x[1], reverse=True
    )[:10]

    avg_inf = 0
    if _detection_history:
        avg_inf = round(sum(e["inference_ms"] for e in _detection_history) / len(_detection_history), 1)

    return {
        "total_frames": _session_stats["total_frames"],
        "total_detections": _session_stats["total_detections"],
        "avg_inference_ms": avg_inf,
        "top_classes": [{"label": k, "count": v} for k, v in top_classes],
        "history": _detection_history[-20:],
    }


def _class_color(cls_id: int) -> tuple:
    palette = [
        (255, 87, 87), (87, 189, 255), (87, 255, 140), (255, 200, 87),
        (200, 87, 255), (255, 140, 87), (87, 255, 220), (255, 87, 200),
        (140, 255, 87), (87, 87, 255),
    ]
    return palette[cls_id % len(palette)]
