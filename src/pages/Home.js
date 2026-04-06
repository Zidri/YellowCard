import "../styles/Home.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useState, useEffect, useRef } from "react";
import YD from "../imgs/YD.png";
import s1 from "../imgs/s1.png";
import s2 from "../imgs/s2.png";
import s3 from "../imgs/s3.png";
import s4 from "../imgs/s4.png";


// Mobile images
import s1Mobile from "../imgs/s1.png";
import s2Mobile from "../imgs/s2.png";
import s3Mobile from "../imgs/s3.png";
import s4Mobile from "../imgs/s4.png";


function Home() {
  // ----------------------
  // PAGE STATUS
  // ----------------------
  const [pageStatus, setPageStatus] = useState(1);
  const totalStatus = 2;

  const nextStatus = () => {
    if (pageStatus < totalStatus) setPageStatus(pageStatus + 1);
  };

  const prevStatus = () => {
    if (pageStatus > 1) setPageStatus(pageStatus - 1);
  };

  // ----------------------
  // PAGE VISIBILITY
  // ----------------------
  const [showPage, setShowPage] = useState(false);

  useEffect(() => setShowPage(true), []);

  // ----------------------
  // SKILLS INTERSECTION
  // ----------------------
  const [skillsVisible, setSkillsVisible] = useState(false);

  useEffect(() => {
    const skillsEl = document.querySelector(".skills");
    if (!skillsEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSkillsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    observer.observe(skillsEl);
    return () => observer.disconnect();
  }, []);

  // ----------------------
  // SLIDES
  // ----------------------
  const [activeSlide, setActiveSlide] = useState(1);
  const totalSlides = 4;

  const slideBackgroundsDesktop = [s1, s2, s3, s4];
  const slideBackgroundsMobile = [s1Mobile, s2Mobile, s3Mobile, s4Mobile];

  // ----------------------
  // SCREEN DETECTION
  // ----------------------
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const checkScreen = () => setIsMobile(window.innerWidth <= 768);

  useEffect(() => {
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // ----------------------
  // ACTIVE BACKGROUND
  // ----------------------
  const activeBackground = isMobile
    ? slideBackgroundsMobile[activeSlide - 1]
    : slideBackgroundsDesktop[activeSlide - 1];

  // ----------------------
  // SLIDESHOW
  // ----------------------
  const slideInterval = useRef(null);
  const slideDelay = 6000;

  const startSlideshow = () => {
    stopSlideshow();
    slideInterval.current = setInterval(() => {
      setActiveSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
    }, slideDelay);
  };

  const stopSlideshow = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
    }
  };

  const restartSlideshow = () => {
    stopSlideshow();
    startSlideshow();
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
    restartSlideshow();
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev <= 1 ? totalSlides : prev - 1));
    restartSlideshow();
  };

  useEffect(() => {
    startSlideshow();
    return () => stopSlideshow();
  }, []);

  // ----------------------
  // JSX RETURN
  // ----------------------
  return (
    <div className="homegrid">
      <div className="homebox">
        <img src={YD} alt="convert" />
        <p className="deets1">
          A fast, all-in-one PDF tool that lets you convert to Word. Merge files,
          and split pdf documents effortlessly in a clean, user-friendly interface.
        </p>

        <p className="deets2">
          Image resizer feature that lets you quickly adjust dimensions and optimize
          images with ease.
        </p>
         <p className="deets1m">
          A fast, all-in-one PDF tool that lets you<br></br>convert to Word. Merge files,
          and split <br></br> pdf documents effortlessly in a clean, <br></br> user-friendly interface.
        </p>
        <p className="deets2m">
          Image resizer feature that lets you quickly<br></br> adjust dimensions and optimize
          images <br></br> with ease.
        </p>
      </div>

     
  {/* Slide Image */}
  <div className="homebox1">
<img
  key={activeSlide}
  src={activeBackground}
  alt={`Slide ${activeSlide}`}
  className={`homebox1-img fade ${
    activeSlide === 1
      ? "slide-s1"
      : activeSlide === 4
      ? "slide-s4"
      : activeSlide === 3
      ? "slide-s3"
      : ""
  }`}
/>
    {/* Pagination Buttons */}
    <div className="paginationcorner2">
      {Array.from({ length: totalSlides }, (_, index) => {
        const n = index + 1;
        return (
          <button
            key={n}
            onClick={() => {
              setActiveSlide(n); // set active slide
              restartSlideshow(); // restart auto slideshow
            }}
            className={activeSlide === n ? "active" : ""}
          ></button>
        );
      })}
    
  </div>
</div>
    </div>
  );
}

export default Home;