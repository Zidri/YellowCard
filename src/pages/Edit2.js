import "../styles/Edit2.css";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaTimes,
 FaFileAlt,
  FaArrowLeft,
  FaFileExport,
  FaCut
} from "react-icons/fa";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import jsPDF from "jspdf";

function Edit2() {
  const [file, setFile] = useState(null);
  const [pageImages, setPageImages] = useState([]);
  const [tool, setTool] = useState("cursor");
  const [drawing, setDrawing] = useState(false);

  const [selectedPages, setSelectedPages] = useState([]);
  const [isSelectingSplit, setIsSelectingSplit] = useState(false);

  const canvasRefs = useRef([]);
  const imgRefs = useRef([]);

  useEffect(() => {
    const storedPDF = localStorage.getItem("pdfToEdit");
    if (storedPDF) {
      const f = base64ToFile(storedPDF, "uploaded.pdf");
      setFile(f);
      generatePreview(f);
    }
  }, []);

  const base64ToFile = (base64, filename) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const generatePreview = async (pdfFile) => {
    const formData = new FormData();
    formData.append("file", pdfFile);
    const res = await fetch("http://localhost:5003/preview_pdf", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setPageImages(data.pages || []);
  };

  const togglePageSelect = (idx) => {
    setSelectedPages((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSplitPDF = () => {
    if (selectedPages.length === 0) {
      alert("Select pages to create a new PDF!");
      return;
    }

    const newPdf = new jsPDF();
    selectedPages.sort((a, b) => a - b).forEach((idx, i) => {
      if (i !== 0) newPdf.addPage();
      newPdf.addImage(pageImages[idx], "PNG", 0, 0, 210, 297);
    });

    newPdf.save("split.pdf");
    setSelectedPages([]);
    setIsSelectingSplit(false);
    setTool("cursor");
  };

  const exportPDF = () => {
    const pdf = new jsPDF();
    pageImages.forEach((img, i) => {
      if (i !== 0) pdf.addPage();
      pdf.addImage(img, "PNG", 0, 0, 210, 297);
    });
    pdf.save("edited.pdf");
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(pageImages);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setPageImages(items);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div className="sidebar">
        <Link title="Back" className="ed2head1" to="/edit"><FaArrowLeft /></Link>
        <button title="Save" className="ed2head2"onClick={exportPDF}><FaFileExport /></button>
        <div className="align-buttons">
         
          <button
            className="edcursor"
              title="Split"
            onClick={() => {
            
              setTool("split");
              setIsSelectingSplit(true);
            }}
          ><FaCut /></button>

          {isSelectingSplit && (
            <>
              <button title="Split Selected Pages" className="eddraw" onClick={handleSplitPDF}><FaFileAlt/></button>
              <button title="Cancel" className="ederase"
                onClick={() => {
                setIsSelectingSplit(false);
                setSelectedPages([]);
                setTool("cursor");
              }}><FaTimes /></button>
            </>
          )}
        </div>
      </div>

      {/* Scrollable PDF Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="pages">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {pageImages.map((src, idx) => (
                  <Draggable key={idx} draggableId={String(idx)} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => isSelectingSplit && togglePageSelect(idx)}
                        style={{
                          position: "relative",
                          width: "60%",
                          margin: "1rem auto",
                          border: selectedPages.includes(idx)
                            ? "3px solid #4CAF50"
                            : "1px solid #ccc",
                          cursor: isSelectingSplit ? "pointer" : "default"
                        }}
                      >
                        <img
                          ref={(el) => (imgRefs.current[idx] = el)}
                          src={src}
                          alt={`Page ${idx + 1}`}
                          style={{ width: "100%", display: "block" }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Edit2;