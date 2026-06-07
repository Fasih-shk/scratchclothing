export default function AboutPage() {
  const values = [
    { icon: '🔥', title: 'Built Different', desc: 'We create for those who refused to quit. Every piece is made for a reason — because where you come from is your greatest flex.' },
    { icon: '🎯', title: 'Purpose Over Hype', desc: 'No gimmicks. No shortcuts. Just premium quality streetwear built with intent, care, and real craftsmanship.' },
    { icon: '🤝', title: 'Community First', desc: 'MUNI DRIP is a family. From our team to our customers — we are building together. Every purchase is a vote for the culture.' },
    { icon: '🌍', title: 'Rooted in Culture', desc: 'From the streets of the UK to the globe, our designs carry the voice of a generation that started from nothing.' },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-page__hero">
        <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>Who We Are</p>
        <h1 className="about-page__hero-title">MUNI DRIP DAILY?.</h1>
        <p className="about-page__hero-body">
          MUNI DRIP WAS BUILT FROM NOTHING AND BECAME SOMETHING — FOR THE BROTHERS AND SISTERS
          WHO CAME FROM THE SAME. THIS IS MORE THAN FASHION. EVERY STITCH, EVERY DROP, EVERY
          COLOURWAY CARRIES THE ENERGY OF THOSE WHO REFUSED TO QUIT. WE ALL STARTED FROM ZERO.
          Let&apos;s BUILD TOGETHER. WELCOME TO THE FAMILY
        </p>
      </div>

      {/* Values */}
      <div className="about-values">
        {values.map(({ icon, title, desc }) => (
          <div key={title} className="value-card">
            <div className="value-card__icon">{icon}</div>
            <h3 className="value-card__title">{title}</h3>
            <p className="value-card__desc">{desc}</p>
          </div>
        ))}
      </div>

      {/* Extra section */}
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '0 1.5rem 4rem',
          textAlign: 'center',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '4rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
          }}
        >
          Join The Movement
        </h2>
        <p style={{ color: 'var(--color-muted)', lineHeight: 1.75, marginBottom: '2rem' }}>
          Follow us on social media for new drops, exclusive content and behind-the-scenes access
          to the MUNI DRIP universe. Tag us in your fits — we might just feature you.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://instagram.com/munidrip"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@munidrip"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            TikTok
          </a>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'About Us | MUNI DRIP',
  description:
    'MUNI DRIP was built from nothing and became something. Learn about the brand, our values and our journey.',
};
