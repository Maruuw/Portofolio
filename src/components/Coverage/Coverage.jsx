import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import { methodologies, automationTools, technicalStack } from '../../data/coverage';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Coverage.css';

const Coverage = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();

  return (
    <section id="coverage" className="section coverage" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ {t.coverage.tag}</span>
          <h2 className="section-title">
            {t.coverage.title} <span>{t.coverage.titleHighlight}</span>
          </h2>
          <p className="section-desc">{t.coverage.desc}</p>
        </div>

        <div className="coverage-dashboard">
          {/* Methodologies Card */}
          <div className="coverage-card glass-card reveal">
            <div className="card-header-custom">
              <span className="card-icon">⚡</span>
              <h3 className="card-title-custom">{t.coverage.categories.methodologies}</h3>
            </div>
            <div className="methodologies-list">
              {methodologies.map((item) => (
                <div key={item.id} className="methodology-item">
                  <span className="methodology-name">{item.name}</span>
                  <span className="status-badge pass">
                    <span className="status-dot"></span>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Automation & Tools Card */}
          <div className="coverage-card glass-card reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="card-header-custom">
              <span className="card-icon">💻</span>
              <h3 className="card-title-custom">{t.coverage.categories.tools}</h3>
            </div>
            <div className="tools-grid-custom">
              {automationTools.map((tool) => (
                <div 
                  key={tool.id} 
                  className="tool-badge-custom" 
                  style={{ '--tool-color': tool.color }}
                >
                  <span className="tool-icon-custom">{tool.icon}</span>
                  <span className="tool-name-custom">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Stack Card */}
          <div className="coverage-card glass-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="card-header-custom">
              <span className="card-icon">📊</span>
              <h3 className="card-title-custom">{t.coverage.categories.stack}</h3>
            </div>
            <div className="tech-stack-list">
              {technicalStack.map((tech) => (
                <div key={tech.id} className="tech-progress-item">
                  <div className="tech-progress-header">
                    <span className="tech-name-custom">{tech.name}</span>
                    <span className="tech-level-custom">{tech.level}%</span>
                  </div>
                  <div className="tech-progress-bar-container">
                    <div 
                      className="tech-progress-bar-fill" 
                      style={{ 
                        width: `${tech.level}%`, 
                        background: tech.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coverage;
