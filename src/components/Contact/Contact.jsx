import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useLang } from '../../context/LanguageContext';
import { en } from '../../locales/en';
import { id } from '../../locales/id';
import useScrollReveal from '../../hooks/useScrollReveal';
import './Contact.css';

const SOCIAL_LINKS = [
  { name: 'GitHub', icon: '🐙', href: 'https://github.com/yourusername', color: '#333' },
  { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com/in/yourusername', color: '#0077B5' },
  { name: 'Dribbble', icon: '🏀', href: 'https://dribbble.com/yourusername', color: '#EA4C89' },
  { name: 'Instagram', icon: '📸', href: 'https://instagram.com/yourusername', color: '#E4405F' },
];

const Contact = () => {
  const { lang } = useLang();
  const t = lang === 'en' ? en : id;
  const sectionRef = useScrollReveal();
  const formRef = useRef();

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Replace with your EmailJS credentials
      await emailjs.sendForm(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formRef.current,
        'YOUR_PUBLIC_KEY'
      );
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" className="section contact" ref={sectionRef}>
      {/* Background decoration */}
      <div className="contact-bg">
        <div className="contact-blob"></div>
      </div>

      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">✦ {t.contact.tag}</span>
          <h2 className="section-title">
            {t.contact.title} <span>{t.contact.titleHighlight}</span>
          </h2>
          <p className="section-desc">{t.contact.desc}</p>
        </div>

        <div className="contact-grid">
          {/* Left - Info */}
          <div className="contact-info reveal-left">
            <div className="glass-card contact-info-card">
              <h3>{t.contact.info.title}</h3>
              <p className="contact-info-desc">{t.contact.info.desc}</p>

              <div className="contact-detail-items">
                <div className="contact-detail-item">
                  <div className="detail-icon">📍</div>
                  <div>
                    <div className="detail-label">{lang === 'en' ? 'Location' : 'Lokasi'}</div>
                    <div className="detail-value">{t.contact.info.location}</div>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon">📧</div>
                  <div>
                    <div className="detail-label">{lang === 'en' ? 'Email' : 'Email'}</div>
                    <div className="detail-value">youremail@example.com</div>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="detail-icon">✅</div>
                  <div>
                    <div className="detail-label">{lang === 'en' ? 'Status' : 'Status'}</div>
                    <div className="detail-value available">{t.contact.info.availability}</div>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <p className="social-title">{t.contact.social}</p>
                <div className="social-links">
                  {SOCIAL_LINKS.map(social => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      id={`social-${social.name.toLowerCase()}`}
                      style={{ '--social-color': social.color }}
                      title={social.name}
                    >
                      <span>{social.icon}</span>
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="contact-form-wrapper reveal-right">
            <form ref={formRef} onSubmit={handleSubmit} className="glass-card contact-form" id="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">{t.contact.form.name}</label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.contact.form.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">{t.contact.form.email}</label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contact.form.email}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">{t.contact.form.subject}</label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t.contact.form.subject}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">{t.contact.form.message}</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.contact.form.message}
                  required
                ></textarea>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="form-status success">{t.contact.form.success}</div>
              )}
              {status === 'error' && (
                <div className="form-status error">{t.contact.form.error}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary submit-btn"
                id="contact-submit-btn"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <div className="spinner"></div>
                    {t.contact.form.sending}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    {t.contact.form.send}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
