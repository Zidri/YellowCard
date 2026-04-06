import "../styles/Edits.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Edit() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle uploaded PDF
  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);

      // Save PDF to localStorage as base64
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("pdfToEdit", reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = () => {
    setFile(null);
    localStorage.removeItem("pdfToEdit"); // Clear localStorage
  };

  return (
    <div className="edgrid">
      <div className="edbox">
        <p className="edhead1">Split</p>
        <p className="edhead2">Click Below to Upload your PDF File</p>

        <div
          className={`upload-box2 ${dragActive ? "active" : ""}`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            id="fileUpload"
            hidden
            onChange={handleChange}
          />

          {!file && (
            <label htmlFor="fileUpload" className="upload-label">
              📄 Choose PDF File
            </label>
          )}

          {file && (
            <div className="file-preview1">
              <div className="file-item">
                <p>✅ {file.name}</p>
                <button className="remove" onClick={handleRemove}>
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="egap">
          <p className="edhead7">
            This lets you Split the selected pages into another PDF.
          </p>
          <p className="edhead8">
           Please select the pages first to split, once you click the confirm button it gives your file automatically.
          </p>
           <p className="edhead11">
           Please select the pages first to split, once you click the <br></br>confirm button it gives your file automatically.
          </p>

          {/* Enable link only if file exists or localStorage has a PDF */}
          {file || localStorage.getItem("pdfToEdit") ? (
            <Link className="edhead9" to="/edit2">
              Click Here To Start Spliting
            </Link>
          ) : (
            <button className="edhead10" disabled>
              Upload First To Start Spliting
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Edit;
