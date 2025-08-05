import React from 'react';
import { useTheme } from '../../context/ThemeContext';

function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`px-3 py-2 rounded-full border-2 border-accent bg-white dark:bg-gray-800 shadow-md text-xl transition duration-200 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-accent md:min-w-[44px] md:min-h-[44px] min-w-[36px] min-h-[36px] z-10 relative ${className}`}
      aria-label="Toggle dark/light mode"
      title="Toggle dark/light mode"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;