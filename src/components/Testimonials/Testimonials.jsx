import { useState } from 'react';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import { testimonials } from '../../data/testimonials';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Testimonials.css';

const Testimonials = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  return (
    <section id="testimonials" className="section testimonials" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ {t.testimonials.tag}</span>
          <h2 className="section-title">
            {t.testimonials.title} <span>{t.testimonials.titleHighlight}</span>
          </h2>
          <p className="section-desc">{t.testimonials.desc}</p>
        </div>

        <div className="testimonials-layout reveal">
          {/* Carousel */}
          <div className="testimonials-carousel">
            <div className="testimonial-card glass-card active-card" style={{ borderColor: testimonials[active].color }}>
              {/* Quote Icon */}
              <div className="quote-icon" style={{ color: testimonials[active].color }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.15">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              {/* Rating */}
              <div className="testimonial-rating">
                {Array.from({ length: testimonials[active].rating }).map((_, i) => (
                  <span key={i} style={{ color: testimonials[active].color }}>★</span>
                ))}
              </div>

              {/* Text */}
              <p className="testimonial-text">"{testimonials[active].text[lang]}"</p>

              {/* Author */}
              <div className="testimonial-author">
                <div className="author-avatar" style={{ background: `${testimonials[active].color}22`, color: testimonials[active].color }}>
                  {testimonials[active].avatar}
                </div>
                <div>
                  <div className="author-name">{testimonials[active].name}</div>
                  <div className="author-role">{testimonials[active].role[lang]}</div>
                  <div className="author-company">{testimonials[active].company}</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="carousel-controls">
              <button className="carousel-btn" onClick={prev} id="testimonial-prev-btn" aria-label="Previous testimonial">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <div className="carousel-dots">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${i === active ? 'active' : ''}`}
                    onClick={() => setActive(i)}
                    id={`testimonial-dot-${i}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                    style={i === active ? { background: testimonials[active].color } : {}}
                  ></button>
                ))}
              </div>
              <button className="carousel-btn" onClick={next} id="testimonial-next-btn" aria-label="Next testimonial">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* All Testimonial Thumbs */}
          <div className="testimonials-thumbs">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                className={`thumb-card ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
                id={`testimonial-thumb-${i}`}
                style={i === active ? { borderColor: t.color, background: `${t.color}11` } : {}}
              >
                <span className="thumb-avatar">{t.avatar}</span>
                <div>
                  <div className="thumb-name">{t.name}</div>
                  <div className="thumb-company">{t.company}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
