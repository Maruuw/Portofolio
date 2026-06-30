import { useState } from 'react';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import { industries } from '../../data/industry';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Industry.css';

const Industry = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState(industries[0]?.id || 'fintech');

  const activeIndustry = industries.find(ind => ind.id === activeCategory);

  return (
    <section id="industry" className="section industry" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ {t.industry.tag}</span>
          <h2 className="section-title">
            {t.industry.title} <span>{t.industry.titleHighlight}</span>
          </h2>
          <p className="section-desc">{t.industry.desc}</p>
        </div>

        {/* Tabs for Industry Categories */}
        <div className="industry-filters reveal">
          {industries.map((ind) => (
            <button
              key={ind.id}
              className={`filter-tab ${activeCategory === ind.id ? 'active' : ''}`}
              style={{ '--tab-theme-color': ind.color }}
              onClick={() => setActiveCategory(ind.id)}
              id={`industry-filter-${ind.id}`}
            >
              <span className="industry-tab-icon">{ind.icon}</span>
              {ind.label[lang]}
            </button>
          ))}
        </div>

        {/* Interactive content grid: key triggers animations when activeCategory changes */}
        {activeIndustry && (
          <div className="industry-dashboard-layout" key={activeCategory}>
            
            {/* Left Column: Test Logs (Experiences) */}
            <div className="industry-column">
              <div className="column-header">
                <span className="column-icon">📊</span>
                <h3 className="column-title">{activeIndustry.experienceTitle[lang]}</h3>
              </div>
              <div className="column-cards-stack">
                {activeIndustry.experiences && activeIndustry.experiences.map((exp, idx) => (
                  <div 
                    key={exp.id} 
                    className="industry-log-card glass-card"
                    style={{ 
                      '--industry-theme-color': activeIndustry.color,
                      animationDelay: `${idx * 0.08}s` 
                    }}
                  >
                    <div className="log-card-header">
                      <h4 className="log-role-title">{exp.role[lang]}</h4>
                      <span className="log-period-badge">{exp.period}</span>
                    </div>
                    <div className="log-company-name">{exp.company}</div>
                    
                    <p className="log-description">{exp.description[lang]}</p>
                    
                    <div className="highlights-section">
                      <span className="highlights-title">
                        {lang === 'en' ? 'EXECUTION HIGHLIGHTS:' : 'SOROTAN EKSEKUSI:'}
                      </span>
                      <ul className="highlights-list">
                        {exp.highlights[lang].map((hl, i) => (
                          <li key={i}>
                            <svg className="check-icon" style={{ color: '#10b981' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Key Projects */}
            <div className="industry-column">
              <div className="column-header">
                <span className="column-icon">🛡️</span>
                <h3 className="column-title">{activeIndustry.projectsTitle[lang]}</h3>
              </div>
              <div className="column-cards-stack">
                {activeIndustry.projects && activeIndustry.projects.map((proj, idx) => (
                  <div 
                    key={proj.id} 
                    className="industry-project-card glass-card"
                    style={{ 
                      '--industry-theme-color': activeIndustry.color,
                      animationDelay: `${idx * 0.08}s` 
                    }}
                  >
                    <div className="project-card-header">
                      <h4 className="project-card-name">{proj.name}</h4>
                    </div>
                    <p className="project-card-desc">{proj.description[lang]}</p>
                    
                    <div className="project-card-badges">
                      {proj.badges.map((badge, i) => (
                        <span key={i} className="project-badge">{badge}</span>
                      ))}
                    </div>
                    
                    <div className="project-card-divider"></div>
                    
                    <div className="project-card-metric">
                      <span className="metric-label">{proj.metricLabel[lang]}:</span>
                      <span className="metric-value" style={{ color: activeIndustry.color }}>
                        {proj.metricValue[lang]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default Industry;
