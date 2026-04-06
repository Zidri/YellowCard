import "../styles/merge.css";
import { useState } from "react";
import arrow from "../imgs/Arrow.png";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function Merge() {
  const [files, setFiles] = useState([]); // multiple files
  const [dragActive, setDragActive] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null); // new state for merged file
  const [loading, setLoading] = useState(false);

  // Handle uploaded files
  const handleFiles = (selectedFiles) => {
    setDownloadUrl(null); // reset previous merged file
    const pdfFiles = Array.from(selectedFiles).filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== selectedFiles.length) {
      alert("Only PDF files are allowed.");
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const handleChange = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  // Merge PDFs via backend
  const handleStart = async () => {
    if (files.length === 0) {
      alert("Please upload PDF files first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("http://localhost:5001/merge", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Merge failed");
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
    <div className="mergegrid">

      {/* Upload Box */}
      <div className="mergebox">
        <p className="mghead1">PDF</p>
        <p className="mghead2">Click Below to Upload your PDF Files</p>

        <div
          className={`upload-box ${dragActive ? "active" : ""}`}
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
            multiple
            onChange={handleChange}
          />

          {/* Initial Upload Label */}
          {files.length === 0 && (
            <label htmlFor="fileUpload" className="upload-label">
              📄 Choose PDF Files
            </label>
          )}

          {/* File Preview + Drag & Drop */}
          {files.length > 0 && (
            <DragDropContext
              onDragEnd={(result) => {
                const { source, destination } = result;
                if (!destination) return;
                const newFiles = Array.from(files);
                const [moved] = newFiles.splice(source.index, 1);
                newFiles.splice(destination.index, 0, moved);
                setFiles(newFiles);
              }}
            >
              <Droppable droppableId="files">
                {(provided) => (
                  <div
                    className="file-preview"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {files.map((file, index) => (
                      <Draggable
                        key={file.name + index}
                        draggableId={file.name + index}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="file-item1"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "180px",
                              }}
                              title={file.name}
                            >
                              ✅ {file.name}
                            </p>

                            <button
                              className="remove1"
                              onClick={() =>
                                setFiles(files.filter((_, i) => i !== index))
                              }
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Add More Button */}
                    <label htmlFor="fileUpload" className="add-more-btn">
                      ➕ Add More Files
                    </label>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        <p className="mghead7">
          Please put your files in order! You can also drag the files. <br></br>
        To merge again. Please remove the files
        </p>
      </div>

      {/* Start Section */}
      <div className="mergebox2">
        <div className="button-container1">
         <button className="mghead6" onClick={handleStart} disabled={loading|| !files.length}>
            {loading ? "Start" : "Start"}
          </button>
        <img src={arrow} alt="->" />
       <p className={`mghead5 ${loading ? "disabled" : ""}`}>
  {loading ? "Merging..." : "Click Here to Start"}
</p>
        
      </div>
</div>
      {/* Merged File Section */}
      <div className="mergebox1">
        <p className="mghead3">Merged File</p>
        <p className="mghead4">Click Below to Download your File</p>
        <div className="download1-box">
          {downloadUrl ? (
            <a href={downloadUrl} download="merged.pdf" className="download-label">
              📥 Download Merged PDF
            </a>
          ) : (
            <label className="download-label">
              {files.length > 0 ? "Ready to merge" : "Empty File"}
            </label>
          )}
        </div>
      </div>

    </div>
  );
}

export default Merge;