import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import { educations } from '../../data/education';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Education.css';

const Education = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();

  const degrees = educations.filter(e => e.type === 'degree');
  const certs = educations.filter(e => e.type === 'certification');

  return (
    <section id="education" className="section education" ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ {t.education.tag}</span>
          <h2 className="section-title">
            {t.education.title} <span>{t.education.titleHighlight}</span>
          </h2>
          <p className="section-desc">{t.education.desc}</p>
        </div>

        <div className="education-grid">
          {/* Degree */}
          <div className="edu-column">
            <h3 className="edu-column-title">
              <span>🎓</span>
              {lang === 'en' ? 'Academic' : 'Akademik'}
            </h3>
            {degrees.map(edu => (
              <div key={edu.id} className="edu-card glass-card reveal">
                <div className="edu-card-left">
                  <div className="edu-logo" style={{ background: `${edu.color}22` }}>
                    {edu.logo}
                  </div>
                  <div className="edu-line" style={{ background: edu.color }}></div>
                </div>
                <div className="edu-card-right">
                  <div className="edu-period" style={{ color: edu.color }}>
                    {edu.period.start} — {edu.period.end}
                  </div>
                  <h4 className="edu-degree">{edu.degree[lang]}</h4>
                  <p className="edu-institution">{edu.institution}</p>
                  <p className="edu-desc">{edu.description[lang]}</p>
                  {edu.gpa && (
                    <span className="edu-gpa" style={{ color: edu.color, background: `${edu.color}22` }}>
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="edu-column">
            <h3 className="edu-column-title">
              <span>🏅</span>
              {lang === 'en' ? 'Certifications' : 'Sertifikasi'}
            </h3>
            {certs.map(cert => (
              <div key={cert.id} className="edu-card glass-card reveal">
                <div className="edu-card-left">
                  <div className="edu-logo" style={{ background: `${cert.color}22` }}>
                    {cert.logo}
                  </div>
                  <div className="edu-line" style={{ background: cert.color }}></div>
                </div>
                <div className="edu-card-right">
                  <div className="edu-period" style={{ color: cert.color }}>
                    {cert.period.start}
                  </div>
                  <h4 className="edu-degree">{cert.degree[lang]}</h4>
                  <p className="edu-institution">{cert.institution}</p>
                  <p className="edu-desc">{cert.description[lang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
