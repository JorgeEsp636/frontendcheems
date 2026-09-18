import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '', showLabel = false, size = 'md' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-2 rounded-2xl transition-all duration-300 backdrop-blur-xl border ${
        isLight
          ? 'bg-white/80 hover:bg-white text-amber-500 border-amber-300/40 shadow-[0_2px_12px_rgba(245,158,11,0.2)]'
          : 'bg-slate-900/70 hover:bg-slate-800 text-sky-300 border-white/15 shadow-glass-sm'
      } ${
        size === 'sm'
          ? 'p-1.5 text-xs'
          : size === 'lg'
          ? 'px-4 py-2.5 text-sm'
          : 'px-3 py-1.5 text-xs'
      } ${className}`}
      title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      aria-label={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <span className="text-base transition-transform duration-300 rotate-0 hover:rotate-45" role="img" aria-label="Modo Oscuro">
            🌙
          </span>
        ) : (
          <span className="text-base transition-transform duration-300 rotate-0 hover:rotate-90 text-amber-500" role="img" aria-label="Modo Claro">
            ☀️
          </span>
        )}
      </div>

      {showLabel && (
        <span className="font-semibold text-xs transition-colors">
          {isDark ? 'Modo Oscuro' : 'Modo Claro'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
