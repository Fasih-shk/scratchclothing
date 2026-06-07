'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (value) => set({ theme: value }),
      toggleTheme: () =>
        set((state) => {
          const themes = ['dark', 'winter', 'summer'];
          const currentIndex = themes.indexOf(state.theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          return { theme: themes[nextIndex] };
        }),
    }),
    {
      name: 'global-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export function ThemeProvider({ children }) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const syncTheme = async () => {
      try {
        const res = await fetch('/api/theme');
        if (res.ok) {
          const data = await res.json();

          // isAutoMode means the global setting is 'auto' — always prompt for GPS
          if (data.isAutoMode && typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                  const geoRes = await fetch(`/api/theme?lat=${latitude}&lon=${longitude}`);
                  if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData.theme) {
                      setTheme(geoData.theme);
                    }
                  }
                } catch (err) {
                  console.error('Failed to resolve theme with client coordinates:', err);
                }
              },
              (error) => {
                console.warn('Geolocation denied. Using server fallback:', error.message);
                if (data.theme) {
                  setTheme(data.theme);
                }
              },
              { timeout: 6000, enableHighAccuracy: false }
            );
          } else {
            // Static admin-set theme or geolocation not available
            if (data.theme) {
              setTheme(data.theme);
            }
          }
        }
      } catch (err) {
        console.error('Error syncing theme with server:', err);
      }
    };
    syncTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return children;
}


export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return { theme, setTheme, toggleTheme };
}
