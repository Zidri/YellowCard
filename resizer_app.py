from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import os
import uuid

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads_resize"
OUTPUT_FOLDER = "outputs_resize"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/resize", methods=["POST"])
def resize_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if not (file.filename.lower().endswith(".jpg") or file.filename.lower().endswith(".png")):
        return jsonify({"error": "Only JPG and PNG allowed"}), 400

    # Save original
    filename = f"{uuid.uuid4()}_{file.filename}"
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(input_path)

    # Get resize values
    scale = float(request.form.get("scale", 100)) / 100

    try:
        img = Image.open(input_path)

        new_width = int(img.width * scale)
        new_height = int(img.height * scale)

        resized_img = img.resize((new_width, new_height))

        output_filename = f"resized_{uuid.uuid4().hex}.png"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)

        resized_img.save(output_path)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(input_path):
            os.remove(input_path)

    return send_file(output_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, port=5002)