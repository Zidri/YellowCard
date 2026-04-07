import "../styles/Convert.css";
import { useState } from "react";
import arrow from "../imgs/Arrow.png";

function Convert() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null); // New state

  // Handle file selection
  const handleFile = (selectedFile) => {
    setDownloadUrl(null); // Reset previous download link
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
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

  // Convert PDF to Word
  const handleStart = async () => {
    if (!file) {
      alert("Please upload a PDF first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://your-app.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Conversion failed");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url); // Save URL for download-box
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  // Remove file safely
  const handleRemove = () => {
    setFile(null);
    setDownloadUrl(null);
  };

  return (
    <div className="convertgrid">

      {/* PDF Upload Box */}
      <div className="convertbox">
        <p className="conhead1">PDF</p>
        <p className="conhead2">Click Below to Upload your PDF File</p>

        <div
          className={`upload-box1 ${dragActive ? "active" : ""}`}
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
         <p className="mghead7">
          To reset and convert again. Please remove the file
        </p>
      </div>

      {/* Start Conversion */}
      <div className="convertbox2">
        <div className="button-container">
          <button className="conhead6" onClick={handleStart} disabled={loading || !file}>
            {loading ? "Start" : "Start"}
          </button>
        </div>
        <img src={arrow} alt="convert" />
    <p
  className={`conhead5 ${loading || !file ? "disabled" : ""}`}
  onClick={() => {
    if (!loading && file) handleStart();
  }}
>
  {loading ? "Converting..." : "Click Here to Start"}
</p>
      </div>

      {/* Word Download Box */}
      <div className="convertbox1">
        <p className="conhead3">Word</p>
        <p className="conhead4">Click the link below to download</p>
        <div className="download-box">
          {downloadUrl && file ? (
            <a
              href={downloadUrl}
              download={file.name.replace(".pdf", ".docx")}
              className="download-label"
            >
              📥 Download {file.name.replace(".pdf", ".docx")}
            </a>
          ) : (
            <label className="download-label">
              {file ? "Ready to convert" : "Empty File"}
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

export default Convert;