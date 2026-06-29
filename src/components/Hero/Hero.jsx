import { useState, useEffect, useRef } from 'react';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import './Hero.css';

const TYPING_ROLES = {
  en: ['UI/UX Designer', 'Frontend Developer', 'Creative Thinker', 'Problem Solver'],
  id: ['UI/UX Designer', 'Frontend Developer', 'Pemikir Kreatif', 'Pemecah Masalah'],
};

const Hero = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;

  const [displayedRole, setDisplayedRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const roles = TYPING_ROLES[lang];

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 60 : 100;
    const pauseTime = isDeleting ? 0 : 2000;

    let timeout;

    if (!isDeleting && charIndex === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      timeout = setTimeout(() => {
        setCharIndex(prev => isDeleting ? prev - 1 : prev + 1);
        setDisplayedRole(currentRole.substring(0, isDeleting ? charIndex - 1 : charIndex + 1));
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex, roles]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(p => !p), 530);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '20+', label: t.hero.stats.projects },
    { value: '15+', label: t.hero.stats.clients },
    { value: '4+', label: t.hero.stats.experience },
  ];

  const handleScroll = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      {/* Animated background blobs */}
      <div className="hero-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="container hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>{lang === 'en' ? 'Available for work' : 'Tersedia untuk bekerja'}</span>
          </div>

          <h1 className="hero-title">
            <span className="greeting">{t.hero.greeting}</span>
            <span className="hero-name">{t.hero.name}</span>
          </h1>

          <div className="hero-role-wrapper">
            <span className="role-prefix">{lang === 'en' ? 'I am a ' : 'Saya seorang '}</span>
            <span className="typing-text">
              {displayedRole}
              <span className={`cursor ${showCursor ? 'visible' : ''}`}>|</span>
            </span>
          </div>

          <p className="hero-tagline">{t.hero.tagline}</p>

          <div className="hero-cta">
            <a href="/cv.pdf" download className="btn btn-primary" id="download-cv-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {t.hero.cta_primary}
            </a>
            <a
              href="#contact"
              className="btn btn-outline"
              id="contact-hero-btn"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {t.hero.cta_secondary}
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Avatar Visual */}
        <div className="hero-visual">
          <div className="avatar-wrapper">
            <div className="avatar-ring ring-1"></div>
            <div className="avatar-ring ring-2"></div>
            <div className="avatar-blob">
              <div className="avatar-placeholder">
                <span className="avatar-emoji">👨‍💻</span>
                <p>{lang === 'en' ? 'Your Photo Here' : 'Foto Anda Di Sini'}</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="floating-badge badge-figma">
              <span>🎨</span> Figma
            </div>
            <div className="floating-badge badge-react">
              <span>⚛️</span> React
            </div>
            <div className="floating-badge badge-css">
              <span>✨</span> CSS
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button className="scroll-indicator" onClick={handleScroll} aria-label="Scroll down">
        <span className="scroll-text">{t.hero.scrollHint}</span>
        <div className="scroll-mouse">
          <div className="scroll-dot"></div>
        </div>
      </button>
    </section>
  );
};

export default Hero;
