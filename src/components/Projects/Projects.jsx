import { useState } from 'react';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import { projects } from '../../data/projects';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Projects.css';

const Projects = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: t.projects.filters.all },
    { key: 'uiux', label: t.projects.filters.uiux },
    { key: 'frontend', label: t.projects.filters.frontend },
    { key: 'fullstack', label: t.projects.filters.fullstack },
  ];

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="section projects" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ {t.projects.tag}</span>
          <h2 className="section-title">
            {t.projects.title} <span>{t.projects.titleHighlight}</span>
          </h2>
          <p className="section-desc">{t.projects.desc}</p>
        </div>

        {/* Filter Tabs */}
        <div className="projects-filters reveal">
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-tab ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
              id={`project-filter-${f.key}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`project-card glass-card reveal ${project.featured ? 'featured' : ''}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* Project Image / Gradient Preview */}
              <div
                className="project-thumbnail"
                style={{ background: project.gradient }}
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-thumbnail-img"
                  />
                )}
                <div className="project-category-badge">{project.category.toUpperCase()}</div>
                <div className="project-overlay">
                  {project.demo && project.demo !== '#' && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link-btn" id={`project-demo-${project.id}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      {t.projects.viewDemo}
                    </a>
                  )}
                  {project.github && project.github !== '#' && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link-btn outline" id={`project-code-${project.id}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      {t.projects.viewCode}
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="project-content">
                {project.featured && (
                  <span className="featured-badge">⭐ Featured</span>
                )}
                <h3 className="project-title">
                  {project.demo && project.demo !== '#' ? (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      {project.title}
                    </a>
                  ) : project.github && project.github !== '#' ? (
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p className="project-desc">{project.description[lang]}</p>
                <div className="project-tags">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
