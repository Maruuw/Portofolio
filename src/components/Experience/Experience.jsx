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

  // currentPage = how many leaves have been flipped to the left
  // 0 = no flips (cover + first exp header visible)
  // N = all flipped (last exp details + end page visible)
  const [currentPage, setCurrentPage] = useState(0);
  const [animatingLeaf, setAnimatingLeaf] = useState(null);
  const totalPages = experiences.length;

  const flipNext = useCallback(() => {
    if (animatingLeaf !== null || currentPage >= totalPages) return;
    setAnimatingLeaf(currentPage);
    setCurrentPage(p => p + 1);
  }, [animatingLeaf, currentPage, totalPages]);

  const flipPrev = useCallback(() => {
    if (animatingLeaf !== null || currentPage <= 0) return;
    setAnimatingLeaf(currentPage - 1);
    setCurrentPage(p => p - 1);
  }, [animatingLeaf, currentPage]);

  const handleTransitionEnd = useCallback((e) => {
    if (e.propertyName === 'transform') {
      setAnimatingLeaf(null);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') flipNext();
      if (e.key === 'ArrowLeft') flipPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [flipNext, flipPrev]);

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
          <div className="book">
            {/* ---------- Decorative book cover edges ---------- */}
            <div className="book-cover book-cover-left"></div>
            <div className="book-cover book-cover-right"></div>

            {/* ---------- Static left page (intro cover — visible when no leaves flipped) ---------- */}
            <div className="page-static page-static-left">
              <div className="cover-inner">
                <div className="cover-ornament">📖</div>
                <h3 className="cover-title">
                  {lang === 'en' ? 'My Professional Journey' : 'Perjalanan Profesional Saya'}
                </h3>
                <p className="cover-subtitle">
                  {lang === 'en'
                    ? 'Flip through the pages to explore my work experience'
                    : 'Balik halaman untuk menjelajahi pengalaman kerja saya'}
                </p>
                <div className="cover-arrow-hint">
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* ---------- Static right page (end — visible when all leaves flipped) ---------- */}
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

            {/* ---------- Page‐edge stacking lines (right side) ---------- */}
            <div className="page-edges page-edges-right"></div>
            <div className="page-edges page-edges-left"></div>

            {/* ---------- Leaves ---------- */}
            {experiences.map((exp, i) => {
              const isFlipped = i < currentPage;
              let zIndex;
              if (i === animatingLeaf) {
                zIndex = totalPages + 10;
              } else if (isFlipped) {
                zIndex = i + 1;
              } else {
                zIndex = totalPages - i;
              }

              return (
                <div
                  key={exp.id}
                  className={`leaf ${isFlipped ? 'flipped' : ''}`}
                  style={{ zIndex }}
                  onTransitionEnd={handleTransitionEnd}
                  onClick={() => {
                    if (!isFlipped) flipNext();
                    else if (i === currentPage - 1) flipPrev();
                  }}
                >
                  {/* ---- FRONT face (right page — experience HEADER) ---- */}
                  <div className="leaf-face leaf-front">
                    {/* Notebook lines */}
                    <div className="page-lines"></div>

                    <div className="page-content">
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
                        {lang === 'en' ? 'Flip for details →' : 'Balik untuk detail →'}
                      </div>

                      <div className="page-number page-number-right">{i + 1}</div>
                    </div>
                  </div>

                  {/* ---- BACK face (left page — experience DETAILS) ---- */}
                  <div className="leaf-face leaf-back">
                    <div className="page-lines"></div>

                    <div className="page-content">
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

            {/* ---------- Spine (on top of everything) ---------- */}
            <div className="book-spine"></div>
          </div>

          {/* ===== NAVIGATION ===== */}
          <div className="book-nav">
            <button
              className="nav-btn nav-prev"
              onClick={flipPrev}
              disabled={currentPage <= 0 || animatingLeaf !== null}
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
              disabled={currentPage >= totalPages || animatingLeaf !== null}
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
