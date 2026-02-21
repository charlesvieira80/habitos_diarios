
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from './icons/Icons';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    switch (theme) {
      case 'light': return <SunIcon />;
      case 'dark': return <MoonIcon />;
      case 'system': return <ComputerDesktopIcon />;
    }
  };

  const getLabel = () => {
     switch (theme) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'system': return 'Auto';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      title={`Tema atual: ${getLabel()}. Clique para alterar.`}
      aria-label="Alternar tema"
    >
      <span className="text-indigo-600 dark:text-indigo-400">
        {getIcon()}
      </span>
      <span className="text-xs font-medium hidden md:block uppercase tracking-wide">{getLabel()}</span>
    </button>
  );
};

export default ThemeToggle;
