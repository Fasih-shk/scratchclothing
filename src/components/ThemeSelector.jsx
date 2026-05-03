'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'dark', name: 'Original (Dark)', color: '#111111' },
    { id: 'winter', name: 'Winter Seasonal', color: '#0f172a' },
    { id: 'summer', name: 'Summer Seasonal', color: '#fffbeb' },
  ];

  return (
    <div className="admin-card" style={{ marginTop: '2rem' }}>
      <p className="admin-card__title">Seasonal Theme Settings</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: theme === t.id ? 'var(--admin-accent)' : 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              color: theme === t.id ? '#000' : 'var(--color-white)',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: t.color,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.name}</span>
            {theme === t.id && (
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>(Active)</span>
            )}
          </button>
        ))}
      </div>
      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: '1.5' }}>
        Changing the theme will update the visual appearance of the entire website instantly for all visitors.
      </p>
    </div>
  );
}
