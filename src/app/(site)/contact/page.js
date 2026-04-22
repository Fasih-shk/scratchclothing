'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Get In Touch</p>
      <h1 className="contact-page__title">Contact Us</h1>
      <p className="contact-page__sub">
        Got a question about an order? Want to collaborate? Or just want to say what's up?
        We read every message. Drop us a line below and we'll get back to you within 24–48 hours.
      </p>

      {submitted ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-accent)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Message Sent!
          </h2>
          <p style={{ color: 'var(--color-muted)' }}>
            Thanks for reaching out. We'll be in touch within 24–48 hours.
          </p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">Name</label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">Email</label>
              <input
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject" className="form-label">Subject</label>
            <input
              id="contact-subject"
              type="text"
              className="form-input"
              placeholder="What is it about?"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message" className="form-label">Message</label>
            <textarea
              id="contact-message"
              className="form-input"
              placeholder="Your message..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            Send Message
          </button>
        </form>
      )}

      {/* Info cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginTop: '4rem',
        }}
      >
        {[
          { icon: '📧', label: 'Email', value: 'hello@munidrip.co.uk' },
          { icon: '⏱️', label: 'Response Time', value: 'Within 24–48 hours' },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
