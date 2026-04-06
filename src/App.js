import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Convert from "./pages/Convert";
import Merge from "./pages/Merge";
import Edit from "./pages/Edit";
import ImageResizer from "./pages/ImageResizer";
import Edit2 from "./pages/Edit2";

function AppContent() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="App">
      
      {location.pathname !== "/edit2" && (
        <nav className="navbar">

          {/* 🍔 Hamburger Button */}
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✖" : "☰"}
          </div>

          {/* NAV LINKS */}
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/convert" onClick={() => setMenuOpen(false)}>Convert</Link></li>
            <li><Link to="/merge" onClick={() => setMenuOpen(false)}>Merge</Link></li>
            <li><Link to="/edit" onClick={() => setMenuOpen(false)}>Split</Link></li>
            <li><Link to="/image-resizer" onClick={() => setMenuOpen(false)}>Image Resizer</Link></li>
          </ul>

        </nav>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/merge" element={<Merge />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/edit2" element={<Edit2 />} />
        <Route path="/image-resizer" element={<ImageResizer />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;