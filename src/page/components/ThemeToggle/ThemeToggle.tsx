import React from 'react';
import { Button } from 'primereact/button';
import { useTheme } from '@shared/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

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
