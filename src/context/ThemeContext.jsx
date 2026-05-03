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
