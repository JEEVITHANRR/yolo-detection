from flask import Flask
from flask_cors import CORS
from routes.detection import detection_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])

app.register_blueprint(detection_bp, url_prefix="/api")

@app.route("/health")
def health():
    return {"status": "ok", "service": "yolo-detection-api"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
