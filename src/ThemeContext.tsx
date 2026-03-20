import React, { createContext, useContext, useEffect, useState } from 'react';
type Theme = 'light' | 'dark' | 'system';
const ThemeContext = createContext<{theme: Theme, setTheme: (t: Theme) => void}>({ theme: 'system', setTheme: () => {} });
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    let activeTheme = theme;
    if (theme === 'system') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.classList.add(activeTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
