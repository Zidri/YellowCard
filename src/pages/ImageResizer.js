import "../styles/Resizer.css";
import { useState } from "react";
import arrow from "../imgs/Arrow.png";

function ImageResizer() {
  const [resizeValue, setResizeValue] = useState(50);
  const [resizeValue1, setResizeValue1] = useState(50);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [mode, setMode] = useState(null); // smaller or bigger
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const validateImage = (file) => {
    setDownloadUrl(null); // reset download
    if (
      file &&
      (file.type === "image/jpeg" || file.type === "image/png")
    ) {
      setFile(file);
    } else {
      alert("Only JPG and PNG images are allowed.");
    }
  };

  const onSelect = (e) => validateImage(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateImage(e.dataTransfer.files[0]);
  };

  // 🔥 Start Resize
  const handleStart = async () => {
    if (!file) {
      alert("Upload an image first!");
      return;
    }

    if (!mode) {
      alert("Please select Smaller or Bigger!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const scale =
        mode === "smaller"
          ? resizeValue
          : 100 + Number(resizeValue1);

      formData.append("scale", scale);

      const res = await fetch("https://yellowcard-backend.onrender.com", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Resize failed");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="resizergrid">

      {/* Upload */}
      <div className="resizerbox">
        <p className="resizerhead1">Picture (JPG, PNG)</p>
        <p className="resizerhead2">Click Below to Upload your Picture</p>

        <div
          className={`upload-box3 ${isDragging ? "active" : ""}`}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <input
            type="file"
            accept="image/jpeg, image/png"
            id="fileUpload"
            hidden
            onChange={onSelect}
          />

          {!file && (
            <label htmlFor="fileUpload" className="upload-label">
              🖼️ Choose Image
            </label>
          )}

          {file && (
            <div className="file-preview1">
              <div className="file-item">
                <p>✅ {file.name}</p>
                <button className="remove" onClick={() => setFile(null)}>
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sliders */}
        <div className="slider-container">

          <p
            className={`resizerhead7 ${mode === "smaller" ? "active" : ""}`}
            onClick={() => setMode("smaller")}
          >
            Smaller
          </p>

          <div className={`slider-row ${mode !== "smaller" ? "disabled" : ""}`}>
            <input
  type="range"
  min="1"
  max="100"
  value={resizeValue}
  onChange={(e) => setResizeValue(e.target.value)}
  className="slider"
  disabled={mode !== "smaller"}   // 👈 disable if not selected
/>
            <p className="slider-value">{resizeValue}%</p>
          </div>

          <p
            className={`resizerhead8 ${mode === "bigger" ? "active" : ""}`}
            onClick={() => setMode("bigger")}
          >
            Bigger
          </p>

         <div className={`slider-row1 ${mode !== "bigger" ? "disabled" : ""}`}>
            <input
  type="range"
  min="1"
  max="100"
  value={resizeValue1}
  onChange={(e) => setResizeValue1(e.target.value)}
  className="slider1"
  disabled={mode !== "bigger"}   // 👈 disable if not selected
/>
            
            <p className="slider-value1">{resizeValue1}%</p>
          </div>

          <p className="resizerhead9">
            Please choose smaller or bigger first! <br></br>
            Then adjust your desired percentage.
          </p>
          <p className="resizerhead10">
            To resize again. Please remove the file
          </p>
           <p className="resizerhead11">
            Please choose smaller or bigger first! To resize again. <br></br>Please remove the file 
          </p>
        </div>
      </div>

      {/* Start */}
      <div className="resizerbox2">
        <div className="button-container2">
        <button className="resizerhead6" onClick={handleStart} disabled={loading|| !file}>
          {loading ? "Start" : "Start"}
        </button>
        </div>
        <img src={arrow} alt="convert" />
 <p className={`conhead5 ${loading ? "disabled" : ""}`}>
  {loading ? "Resizing..." : "Click Here to Start"}
</p>
       
      </div>

      {/* Download */}
      <div className="resizerbox1">
        <p className="resizerhead3">Image Resized</p>
        <p className="resizerhead4">Click Below to Download your File</p>

        <div className="download-box2">
          {downloadUrl ? (
            <a
              href={downloadUrl}
              download="resized.png"
              className="download-label"
            >
              📥 Download Resized Image
            </a>
          ) : (
            <label className="download-label">
              {file ? "Ready to resize" : "Empty File"}
            </label>
          )}
        </div>
      </div>

    </div>
  );
}

export default ImageResizer;