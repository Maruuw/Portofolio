import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import useScrollReveal from '../../hooks/useScrollReveal';
import './About.css';

const About = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();

  const values = t.about.values;

  return (
    <section id="about" className="section about" ref={sectionRef}>
      <div className="container">
        <div className="about-grid">
          {/* Left - Avatar & Fun Facts */}
          <div className="about-left reveal-left">
            <div className="about-avatar-card glass-card">
              <div className="about-avatar">
                <span className="about-avatar-emoji">👨‍💻</span>
                <div className="about-avatar-glow"></div>
              </div>
              <div className="fun-facts">
                <h4>{t.about.funFacts.title}</h4>
                <ul>
                  {t.about.funFacts.items.map((item, i) => (
                    <li key={i}>
                      <span className="fact-icon">{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Values */}
            <div className="about-values">
              {values.map((value, i) => (
                <span key={i} className="value-tag">{value}</span>
              ))}
            </div>
          </div>

          {/* Right - Bio */}
          <div className="about-right reveal-right">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
              <span className="section-tag">✦ {t.about.tag}</span>
              <h2 className="section-title">
                {t.about.title.replace(t.about.titleHighlight, '')}
                <span>{t.about.titleHighlight}</span>
              </h2>
            </div>

            <p className="about-bio">{t.about.bio1}</p>
            <p className="about-bio">{t.about.bio2}</p>

            {/* Stats */}
            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-num gradient-text">20+</span>
                <span>{lang === 'en' ? 'Projects Completed' : 'Proyek Selesai'}</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num gradient-text">15+</span>
                <span>{lang === 'en' ? 'Happy Clients' : 'Klien Puas'}</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num gradient-text">4+</span>
                <span>{lang === 'en' ? 'Years Experience' : 'Tahun Pengalaman'}</span>
              </div>
            </div>

            <a href="/cv.pdf" download className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {t.about.downloadCV}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
