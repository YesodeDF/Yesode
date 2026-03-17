import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial OS preference or local storage
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark-theme');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  return (
    <Button 
      icon={isDark ? "pi pi-sun" : "pi pi-moon"} 
      onClick={toggleTheme} 
      className="p-button-text p-button-sm p-0 m-0 w-2rem h-2rem mr-3" 
      aria-label="Toggle Theme"
      style={{ color: 'var(--text-light)', border: 'none' }}
    />
  );
};
