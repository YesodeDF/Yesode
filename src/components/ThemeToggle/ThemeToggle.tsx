import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Default to Light
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark-theme');
      setIsDark(false);
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
      className="p-button-rounded p-button-text p-button-sm" 
      aria-label="Toggle Theme"
      style={{ 
        width: '38px', 
        height: '38px', 
        color: "currentColor"
      }}
    />
  );
};
