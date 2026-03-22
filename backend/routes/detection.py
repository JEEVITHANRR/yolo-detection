from flask import Blueprint, request, jsonify
from services.yolo_service import detect_image, get_stats

detection_bp = Blueprint("detection", __name__)


@detection_bp.route("/detect", methods=["POST"])
def detect():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in {"jpg", "jpeg", "png", "bmp", "webp"}:
        return jsonify({"error": "Only image files are supported (jpg, png, bmp, webp)"}), 400

    conf = float(request.form.get("confidence", 0.4))

    try:
        result = detect_image(file.read(), conf_threshold=conf)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@detection_bp.route("/stats", methods=["GET"])
def stats():
    return jsonify(get_stats())
