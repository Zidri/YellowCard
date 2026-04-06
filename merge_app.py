from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfMerger
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads_merge"
OUTPUT_FOLDER = "outputs_merge"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/merge", methods=["POST"])
def merge_pdfs():
    if "files" not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist("files")
    pdf_files = [f for f in files if f.filename.endswith(".pdf")]

    if not pdf_files:
        return jsonify({"error": "No PDF files found"}), 400

    # Save uploaded PDFs
    saved_paths = []
    for f in pdf_files:
        path = os.path.join(UPLOAD_FOLDER, f.filename)
        f.save(path)
        saved_paths.append(path)

    # Merge PDFs
    merger = PdfMerger()
    for path in saved_paths:
        merger.append(path)

    output_filename = "merged.pdf"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)
    merger.write(output_path)
    merger.close()

    return send_file(output_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, port=5001)