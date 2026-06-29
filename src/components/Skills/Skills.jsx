import { useState } from 'react';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import { skills } from '../../data/skills';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Skills.css';

const Skills = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: t.skills.categories.all },
    { key: 'design', label: t.skills.categories.design },
    { key: 'frontend', label: t.skills.categories.frontend },
    { key: 'tools', label: t.skills.categories.tools },
  ];

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="section skills" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ {t.skills.tag}</span>
          <h2 className="section-title">
            {t.skills.title} <span>{t.skills.titleHighlight}</span>
          </h2>
          <p className="section-desc">{t.skills.desc}</p>
        </div>

        {/* Filter Tabs */}
        <div className="skills-filters reveal">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`filter-tab ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
              id={`skills-filter-${cat.key}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {filtered.map((skill, i) => (
            <div
              key={skill.id}
              className="skill-card glass-card reveal"
              style={{ animationDelay: `${i * 0.05}s`, transitionDelay: `${i * 0.05}s` }}
            >
              <div className="skill-icon" style={{ background: `${skill.color}22` }}>
                <span>{skill.icon}</span>
              </div>
              <div className="skill-info">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level" style={{ color: skill.color }}>{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-progress"
                    style={{
                      width: `${skill.level}%`,
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}99)`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
