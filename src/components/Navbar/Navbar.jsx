import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const t = lang === 'en' ? en : id;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { key: 'industry', href: '#industry' },
    { key: 'coverage', href: '#coverage' },
    { key: 'projects', href: '#projects' },
    { key: 'experience', href: '#experience' },
    { key: 'contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Active section detection
      const sections = ['home', 'industry', 'coverage', 'projects', 'experience', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="#home" className="navbar-logo" onClick={() => handleNavClick('#home')}>
          <span className="logo-bracket">&lt;</span>
          <span className="logo-name">DP</span>
          <span className="logo-bracket">/&gt;</span>
        </a>

        {/* Desktop Nav */}
        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.key}>
              <a
                href={link.href}
                className={`nav-link ${activeSection === link.key ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {t.nav[link.key]}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Language Toggle */}
          <button
            className="lang-toggle"
            onClick={toggleLang}
            id="lang-toggle-btn"
            aria-label="Toggle language"
          >
            <span className={lang === 'en' ? 'active' : ''}>EN</span>
            <span className="divider">|</span>
            <span className={lang === 'id' ? 'active' : ''}>ID</span>
          </button>

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            id="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            id="hamburger-btn"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          {navLinks.map(link => (
            <li key={link.key}>
              <a
                href={link.href}
                className={`mobile-nav-link ${activeSection === link.key ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {t.nav[link.key]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
