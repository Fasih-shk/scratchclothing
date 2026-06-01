'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/context/AuthContext';

export default function ThemeSelector() {
  const { setTheme } = useTheme();
  const token = useAuthStore((state) => state.token);
  const [themeMode, setThemeMode] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const themes = [
    { id: 'dark', name: 'Original (Dark)', color: '#111111' },
    { id: 'winter', name: 'Winter Seasonal', color: '#0f172a' },
    { id: 'summer', name: 'Summer Seasonal', color: '#fffbeb' },
    { id: 'auto', name: 'Auto (Weather-based)', color: 'linear-gradient(135deg, #0f172a 0%, #111111 50%, #fffbeb 100%)' },
  ];

  useEffect(() => {
    const fetchCurrentMode = async () => {
      try {
        const res = await fetch('/api/admin/theme', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.themeMode) {
            setThemeMode(data.themeMode);
          }
        }
      } catch (err) {
        console.error('Failed to load theme mode:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCurrentMode();
    }
  }, [token]);

  const handleThemeChange = async (id) => {
    try {
      setError('');
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ themeMode: id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update theme mode');
      }

      setThemeMode(id);

      // Now fetch resolved theme to update the page instantly
      const themeRes = await fetch('/api/theme?t=' + Date.now());
      if (themeRes.ok) {
        const themeData = await themeRes.json();
        if (themeData.theme) {
          setTheme(themeData.theme);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-card" style={{ marginTop: '2rem' }}>
        <p className="admin-card__title">Seasonal Theme Settings</p>
        <p style={{ marginTop: '1.5rem', color: 'var(--color-muted)', fontSize: '0.85rem' }}>Loading configurations...</p>
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ marginTop: '2rem' }}>
      <p className="admin-card__title">Seasonal Theme Settings</p>
      {error && <p className="form-error" style={{ marginTop: '1rem', color: 'red', fontSize: '0.8rem' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: themeMode === t.id ? 'var(--admin-accent)' : 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              color: themeMode === t.id ? '#000' : 'var(--color-white)',
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
            {themeMode === t.id && (
              <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>(Active)</span>
            )}
          </button>
        ))}
      </div>
      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: '1.5' }}>
        Configure the global theme setting. Selecting "Auto (Weather-based)" will automatically determine the theme (Winter, Summer, or Original Dark) for visitors based on their location's current weather conditions.
      </p>
    </div>
  );
}

