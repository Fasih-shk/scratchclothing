'use client';

import { useEffect, useState } from 'react';

export default function AppLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideLoader = () => {
      setTimeout(() => setIsVisible(false), 350);
    };

    if (document.readyState === 'complete') {
      hideLoader();
      return;
    }

    window.addEventListener('load', hideLoader, { once: true });
    return () => window.removeEventListener('load', hideLoader);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="app-loader-overlay" aria-live="polite" aria-label="Loading">
      <div className="loader" />
    </div>
  );
}

