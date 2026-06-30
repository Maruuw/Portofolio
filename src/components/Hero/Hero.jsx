import { useState, useEffect } from 'react';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import './Hero.css';

const TYPING_ROLES = {
  en: ['UI/UX Designer', 'Frontend Developer', 'Graphic Designer'],
  id: ['UI/UX Designer', 'Frontend Developer', 'Desainer Grafis'],
};

const Hero = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;

  const [displayedRole, setDisplayedRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const roles = TYPING_ROLES[lang] || TYPING_ROLES.en;

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

  const handleScroll = () => {
    document.getElementById('industry')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      {/* Ambient background blur blobs */}
      <div className="hero-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="container hero-container">
        {/* Left Side: Mock Developer Terminal */}
        <div className="hero-terminal-side">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="terminal-title">bash - guest@damarpratama: ~</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="prompt">➜  ~</span> <span className="command">whoami</span>
              </div>
              <div className="terminal-output name-output">
                {t.hero.name}
              </div>
              
              <div className="terminal-line">
                <span className="prompt">➜  ~</span> <span className="command">cat role.txt</span>
              </div>
              <div className="terminal-output role-output">
                <span className="typing-role">
                  {displayedRole}
                  <span className={`terminal-cursor ${showCursor ? 'visible' : ''}`}>|</span>
                </span>
              </div>
              
              <div className="terminal-line">
                <span className="prompt">➜  ~</span> <span className="command">./fetch_stats.sh</span>
              </div>
              <div className="terminal-output stats-output">
                <div className="terminal-stat-item">
                  <span className="stat-key">{lang === 'en' ? 'Projects Done' : 'Proyek Selesai'}</span>: <span className="stat-val">20+</span>
                </div>
                <div className="terminal-stat-item">
                  <span className="stat-key">{lang === 'en' ? 'Happy Clients' : 'Klien Puas'}</span>: <span className="stat-val">15+</span>
                </div>
                <div className="terminal-stat-item">
                  <span className="stat-key">{lang === 'en' ? 'Experience' : 'Pengalaman'}</span>: <span className="stat-val">4+ {lang === 'en' ? 'Years' : 'Tahun'}</span>
                </div>
                <div className="terminal-stat-item">
                  <span className="stat-key">{lang === 'en' ? 'Location' : 'Lokasi'}</span>: <span className="stat-val">Indonesia</span>
                </div>
              </div>
              
              <div className="terminal-line last-prompt">
                <span className="prompt">➜  ~</span> <span className="terminal-cursor-blink">_</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Heading & CTA */}
        <div className="hero-text-side">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>{lang === 'en' ? 'Available for freelance' : 'Tersedia untuk freelance'}</span>
          </div>

          <h1 className="hero-title">
            <span className="greeting">{lang === 'en' ? "Hi, I'm" : 'Halo, saya'}</span>
            <span className="hero-name-highlight">Damar Pratama</span>
          </h1>

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
