from flask import Flask, request, jsonify
import fitz  # PyMuPDF
import base64
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from React dev server

@app.route("/preview_pdf", methods=["POST"])
def preview_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    pdf_file = request.files["file"]

    try:
        # Open PDF in memory
        pdf_doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        pages_base64 = []

        for page_number in range(len(pdf_doc)):
            page = pdf_doc[page_number]
            # Render page to PNG
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x resolution
            img_bytes = pix.tobytes("png")
            b64_str = base64.b64encode(img_bytes).decode("utf-8")
            pages_base64.append(f"data:image/png;base64,{b64_str}")

        pdf_doc.close()
        return jsonify({"pages": pages_base64})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/edit_pdf", methods=["POST"])
def edit_pdf():
    # Placeholder for your PDF editing logic
    return jsonify({"message": "PDF editing endpoint"})


if __name__ == "__main__":
    app.run(port=5003, debug=True)