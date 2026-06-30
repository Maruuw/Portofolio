import { useState, useCallback, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import { experiences } from '../../data/experience';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Experience.css';

const Experience = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();

  const [currentPage, setCurrentPage] = useState(0);
  const [animatingLeaf, setAnimatingLeaf] = useState(null);
  const [animationType, setAnimationType] = useState(null); // 'next' | 'prev'
  const totalPages = experiences.length;

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null); // { x: number, leafIndex: number, direction: 'next' | 'prev' }
  const [dragAngle, setDragAngle] = useState(0);

  // Snapping State (for smooth release transition)
  const [snappingLeaf, setSnappingLeaf] = useState(null);
  const [snapTargetAngle, setSnapTargetAngle] = useState(0);

  const flipNext = useCallback(() => {
    if (animatingLeaf !== null || snappingLeaf !== null || currentPage >= totalPages) return;
    setAnimatingLeaf(currentPage);
    setAnimationType('next');
    // Delayed state update: we update currentPage AFTER the animation finishes
  }, [animatingLeaf, snappingLeaf, currentPage, totalPages]);

  const flipPrev = useCallback(() => {
    if (animatingLeaf !== null || snappingLeaf !== null || currentPage <= 0) return;
    setAnimatingLeaf(currentPage - 1);
    setAnimationType('prev');
    // Delayed state update: we update currentPage AFTER the animation finishes
  }, [animatingLeaf, snappingLeaf, currentPage]);

  const handleTransitionEnd = useCallback((e) => {
    // Only trigger state clear if the event targets the leaf container itself
    if (e.target !== e.currentTarget) return;

    if (e.propertyName === 'transform' || e.animationName === 'flip-next' || e.animationName === 'flip-prev') {
      if (animatingLeaf !== null) {
        if (animationType === 'next') {
          setCurrentPage(p => p + 1);
        } else if (animationType === 'prev') {
          setCurrentPage(p => p - 1);
        }
      }
      setAnimatingLeaf(null);
      setAnimationType(null);
      setSnappingLeaf(null);
    }
  }, [animatingLeaf, animationType]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (isDragging || animatingLeaf !== null || snappingLeaf !== null) return;
      if (e.key === 'ArrowRight') flipNext();
      if (e.key === 'ArrowLeft') flipPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [flipNext, flipPrev, isDragging, animatingLeaf, snappingLeaf]);

  // Unified Drag Start on Book Container level
  const handleBookMouseDown = (e) => {
    if (animatingLeaf !== null || snappingLeaf !== null) return;
    if (e.button !== 0) return; // Only left click

    // If clicking a link, button, or interactive element inside the page, allow default behavior
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }

    e.preventDefault(); // Stop text highlight and default drag behaviors

    const bookEl = e.currentTarget;
    const rect = bookEl.getBoundingClientRect();
    const clientX = e.clientX;
    const clickXRelative = clientX - rect.left;
    const bookWidth = rect.width;
    const isRightSide = clickXRelative > bookWidth / 2;

    if (isRightSide) {
      if (currentPage < totalPages) {
        setIsDragging(true);
        setDragStart({ x: clientX, leafIndex: currentPage, direction: 'next' });
        setDragAngle(0);
      }
    } else {
      if (currentPage > 0) {
        setIsDragging(true);
        setDragStart({ x: clientX, leafIndex: currentPage - 1, direction: 'prev' });
        setDragAngle(-180);
      }
    }
  };

  const handleBookTouchStart = (e) => {
    if (animatingLeaf !== null || snappingLeaf !== null) return;
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }

    const bookEl = e.currentTarget;
    const rect = bookEl.getBoundingClientRect();
    const clientX = e.touches[0].clientX;
    const clickXRelative = clientX - rect.left;
    const bookWidth = rect.width;
    const isRightSide = clickXRelative > bookWidth / 2;

    if (isRightSide) {
      if (currentPage < totalPages) {
        setIsDragging(true);
        setDragStart({ x: clientX, leafIndex: currentPage, direction: 'next' });
        setDragAngle(0);
      }
    } else {
      if (currentPage > 0) {
        setIsDragging(true);
        setDragStart({ x: clientX, leafIndex: currentPage - 1, direction: 'prev' });
        setDragAngle(-180);
      }
    }
  };

  // Drag Move & End Effect
  useEffect(() => {
    if (!isDragging || !dragStart) return;

    const handleMove = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const dx = clientX - dragStart.x;

      const bookEl = document.querySelector('.book');
      const leafWidth = bookEl ? bookEl.offsetWidth / 2 : 400;

      let angle = 0;
      if (dragStart.direction === 'next') {
        const pct = Math.min(1, Math.max(0, -dx / leafWidth));
        angle = -pct * 180;
      } else {
        const pct = Math.min(1, Math.max(0, dx / leafWidth));
        angle = -180 + pct * 180;
      }
      setDragAngle(angle);
    };

    const handleUp = (e) => {
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const dx = clientX - dragStart.x;

      if (Math.abs(dx) < 15) {
        // Simple tap/click -> trigger keyframe flip
        if (dragStart.direction === 'next') {
          flipNext();
        } else {
          flipPrev();
        }
      } else {
        // Drag snap release
        setSnappingLeaf(dragStart.leafIndex);
        if (dragStart.direction === 'next') {
          if (dragAngle < -90) {
            setSnapTargetAngle(-180);
            setCurrentPage(p => p + 1);
          } else {
            setSnapTargetAngle(0);
          }
        } else {
          if (dragAngle > -90) {
            setSnapTargetAngle(0);
            setCurrentPage(p => p - 1);
          } else {
            setSnapTargetAngle(-180);
          }
        }
      }

      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener('mousemove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, dragStart, dragAngle, flipNext, flipPrev]);

  // Helper to compute paper corner-peel dimensions and clip paths
  const getPeelStyles = (i) => {
    const isLeafDragged = isDragging && dragStart && dragStart.leafIndex === i;
    const isLeafSnapping = snappingLeaf === i;

    let frontPeelStyle = {};
    let frontContentStyle = {};
    let backPeelStyle = {};
    let backContentStyle = {};

    if (isLeafDragged) {
      const rad = (dragAngle * Math.PI) / 180;
      let pct = 0;
      if (dragStart.direction === 'next') {
        pct = Math.min(1, Math.max(0, -dragAngle / 180));
      } else {
        pct = Math.min(1, Math.max(0, (dragAngle + 180) / 180));
      }

      // Peel peaks in the middle and wraps flat at edges
      let peelSize = 0;
      if (pct < 0.25) {
        peelSize = (pct / 0.25) * 85;
      } else if (pct < 0.75) {
        peelSize = 85;
      } else {
        peelSize = Math.max(0, ((1 - pct) / 0.25) * 85);
      }

      frontPeelStyle = {
        width: `${peelSize}px`,
        height: `${peelSize}px`,
        transition: 'none'
      };
      frontContentStyle = {
        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${peelSize}px), calc(100% - ${peelSize}px) 100%, 0 100%)`,
        transition: 'none'
      };

      backPeelStyle = {
        width: `${peelSize}px`,
        height: `${peelSize}px`,
        transition: 'none'
      };
      backContentStyle = {
        clipPath: `polygon(0 0, 100% 0, 100% 100%, ${peelSize}px 100%, 0 calc(100% - ${peelSize}px))`,
        transition: 'none'
      };
    } else if (isLeafSnapping) {
      // Transition back to 0px / full rectangle
      frontPeelStyle = {
        width: '0px',
        height: '0px',
        transition: 'width 0.5s cubic-bezier(0.25, 1, 0.5, 1), height 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
      };
      frontContentStyle = {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: 'clip-path 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
      };
      backPeelStyle = {
        width: '0px',
        height: '0px',
        transition: 'width 0.5s cubic-bezier(0.25, 1, 0.5, 1), height 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
      };
      backContentStyle = {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: 'clip-path 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
      };
    }

    return { frontPeelStyle, frontContentStyle, backPeelStyle, backContentStyle };
  };

  return (
    <section id="experience" className="section experience" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ {t.experience.tag}</span>
          <h2 className="section-title">
            {t.experience.title} <span>{t.experience.titleHighlight}</span>
          </h2>
          <p className="section-desc">{t.experience.desc}</p>
        </div>

        {/* ===== BOOK ===== */}
        <div className="book-scene reveal">
          <div 
            className={`book ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleBookMouseDown}
            onTouchStart={handleBookTouchStart}
          >
            {/* ---------- Decorative book cover edges ---------- */}
            <div className="book-cover book-cover-left"></div>
            <div className="book-cover book-cover-right"></div>

            {/* ---------- Static left page (intro cover) ---------- */}
            <div className="page-static page-static-left">
              <div className="cover-inner">
                <div className="cover-ornament">📖</div>
                <h3 className="cover-title">
                  {lang === 'en' ? 'My Professional Journey' : 'Perjalanan Profesional Saya'}
                </h3>
                <p className="cover-subtitle">
                  {lang === 'en'
                    ? 'Drag or click pages to explore my work experience'
                    : 'Seret atau klik halaman untuk menjelajahi pengalaman kerja saya'}
                </p>
                <div className="cover-arrow-hint">
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* ---------- Static right page (end) ---------- */}
            <div className="page-static page-static-right">
              <div className="end-page">
                <div className="end-ornament">✨</div>
                <h3 className="end-title">
                  {lang === 'en' ? 'The Journey Continues...' : 'Perjalanan Berlanjut...'}
                </h3>
                <p className="end-subtitle">
                  {lang === 'en'
                    ? "Thanks for reading! Let's create something amazing together."
                    : 'Terima kasih telah membaca! Mari ciptakan sesuatu yang luar biasa bersama.'}
                </p>
                <a
                  href="#contact"
                  className="end-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {lang === 'en' ? 'Contact Me →' : 'Hubungi Saya →'}
                </a>
              </div>
            </div>

            {/* ---------- Page‐edge stacking lines ---------- */}
            <div className="page-edges page-edges-right"></div>
            <div className="page-edges page-edges-left"></div>

            {/* ---------- Leaves ---------- */}
            {experiences.map((exp, i) => {
              // Leaf is flipped if its index is less than currentPage AND it is not currently animating back (prev)
              const isFlipped = i < currentPage && !(animatingLeaf === i && animationType === 'prev');
              let zIndex;
              
              // Set zIndex values for proper overlap order
              if (i === animatingLeaf || i === snappingLeaf) {
                zIndex = totalPages + 10;
              } else if (isFlipped) {
                zIndex = i + 1;
              } else {
                zIndex = totalPages - i;
              }

              // Build dynamic transforms / transition states
              const isLeafDragged = isDragging && dragStart && dragStart.leafIndex === i;
              const isLeafSnapping = snappingLeaf === i;
              const isLeafAnimating = animatingLeaf === i;

              let leafStyle = { zIndex };
              let leafClass = `leaf ${isFlipped ? 'flipped' : ''}`;

              if (isLeafDragged) {
                // Dragging: calculate organic bending/warp based on rotation angle
                const rad = (dragAngle * Math.PI) / 180;
                
                // High-fidelity diagonal corner peel (matches reference portfolio)
                const bendFactor = Math.sin(Math.abs(rad));
                const lift = bendFactor * 52; // height elevation for paper pop-out depth
                const rotX = bendFactor * -18; // tilts top-forward
                const rotZ = bendFactor * (dragStart.direction === 'next' ? -28 : 28); // high angle rotation to match diagonal peel
                const skewX = bendFactor * (dragStart.direction === 'next' ? -22 : 22); // shear warp
                const skewY = bendFactor * (dragStart.direction === 'next' ? 22 : -22);

                leafStyle.transform = `rotateY(${dragAngle}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg) translateZ(${lift}px) skewX(${skewX}deg) skewY(${skewY}deg)`;
                leafStyle.transition = 'none';
              } else if (isLeafSnapping) {
                // Snap back transition after drag release (flattening out skew/bending)
                leafStyle.transform = snapTargetAngle === -180 
                  ? 'rotateY(-180deg) rotateX(0deg) rotateZ(0deg) translateZ(0px) skewX(0deg) skewY(0deg)'
                  : 'rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateZ(0px) skewX(0deg) skewY(0deg)';
                leafStyle.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
              } else if (isLeafAnimating) {
                // Click navigation animations (using high performance CSS keyframes)
                leafClass += animationType === 'next' ? ' animating-next' : ' animating-prev';
              }

              // Dynamic corner-peel styles
              const { frontPeelStyle, frontContentStyle, backPeelStyle, backContentStyle } = getPeelStyles(i);

              return (
                <div
                  key={exp.id}
                  className={leafClass}
                  style={leafStyle}
                  onTransitionEnd={handleTransitionEnd}
                  onAnimationEnd={handleTransitionEnd}
                >
                  {/* ---- FRONT face (right page — experience HEADER) ---- */}
                  <div className="leaf-face leaf-front">
                    {/* Notebook lines */}
                    <div className="page-lines"></div>

                    {/* Left shadow to simulate paper depth crease */}
                    <div className="page-crease-shadow crease-left"></div>

                    {/* FOLDED CORNER (dog ear) for front face */}
                    <div className="corner-peel corner-peel-front" style={frontPeelStyle}></div>

                    <div className="page-content" style={frontContentStyle}>
                      <div className="exp-logo-large">{exp.logo}</div>

                      <h3 className="exp-role">{exp.role[lang]}</h3>
                      <div className="exp-company">{exp.company}</div>

                      <span
                        className="exp-type-badge"
                        style={{ color: exp.color, background: `${exp.color}18` }}
                      >
                        {exp.type[lang]}
                      </span>

                      <div className="exp-meta-info">
                        <div className="meta-item">
                          <span className="meta-icon">📅</span>
                          <span>{exp.period.start} — {exp.period.end ?? t.experience.present}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">📍</span>
                          <span>{exp.location}</span>
                        </div>
                      </div>

                      <div className="page-turn-hint">
                        {lang === 'en' ? 'Drag or click to flip →' : 'Seret atau klik untuk membalik →'}
                      </div>

                      <div className="page-number page-number-right">{i + 1}</div>
                    </div>
                  </div>

                  {/* ---- BACK face (left page — experience DETAILS) ---- */}
                  <div className="leaf-face leaf-back">
                    <div className="page-lines"></div>

                    {/* Right shadow to simulate paper depth crease */}
                    <div className="page-crease-shadow crease-right"></div>

                    {/* FOLDED CORNER (dog ear) for back face */}
                    <div className="corner-peel corner-peel-back" style={backPeelStyle}></div>

                    <div className="page-content" style={backContentStyle}>
                      <div
                        className="exp-details-header"
                        style={{ borderColor: `${exp.color}44` }}
                      >
                        <span className="exp-details-emoji">{exp.logo}</span>
                        <div>
                          <span className="exp-details-role">{exp.role[lang]}</span>
                          <span className="exp-details-company">{exp.company}</span>
                        </div>
                      </div>

                      <ul className="exp-description">
                        {exp.description[lang].map((item, j) => (
                          <li key={j}>
                            <span className="bullet" style={{ background: exp.color }}></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="exp-skills-wrap">
                        {exp.skills.map((skill, j) => (
                          <span
                            key={j}
                            className="exp-skill"
                            style={{ borderColor: `${exp.color}44`, color: exp.color }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="page-number page-number-left">{i + 1}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ---------- Spine ---------- */}
            <div className="book-spine"></div>
          </div>

          {/* ===== NAVIGATION ===== */}
          <div className="book-nav">
            <button
              className="nav-btn nav-prev"
              onClick={flipPrev}
              disabled={currentPage <= 0 || animatingLeaf !== null || snappingLeaf !== null}
              id="exp-prev-btn"
              aria-label="Previous page"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="book-page-indicator">
              <span className="page-current">{currentPage}</span>
              <span className="page-sep">/</span>
              <span className="page-total">{totalPages}</span>
            </div>

            <button
              className="nav-btn nav-next"
              onClick={flipNext}
              disabled={currentPage >= totalPages || animatingLeaf !== null || snappingLeaf !== null}
              id="exp-next-btn"
              aria-label="Next page"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* ===== PAGE DOTS ===== */}
          <div className="book-dots">
            {Array.from({ length: totalPages + 1 }).map((_, i) => (
              <span
                key={i}
                className={`book-dot ${i === currentPage ? 'active' : ''}`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
