import React from 'react';
import ThemeToggle from './ThemeToggle';
import { LockClosedIcon, LockOpenIcon, CogIcon } from './icons/Icons';

interface HeaderProps {
  dailyScore: number;
  weeklyScore: number;
  isParentMode: boolean;
  onAuthClick: () => void;
  onSettingsClick: () => void;
}

const ScoreCard: React.FC<{ title: string; score: number; gradient: string }> = ({ title, score, gradient }) => (
    <div className={`flex flex-col items-center justify-center px-6 py-3 rounded-xl shadow-sm text-white ${gradient} flex-1 md:flex-none min-w-[140px] transition-transform hover:scale-105`}>
        <span className="text-xs font-medium uppercase tracking-wider opacity-90">{title}</span>
        <span className="text-3xl font-bold drop-shadow-sm">{score}</span>
    </div>
);

const Header: React.FC<HeaderProps> = ({ 
  dailyScore, 
  weeklyScore, 
  isParentMode, 
  onAuthClick, 
  onSettingsClick 
}) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto p-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between w-full md:w-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                    Hábitos Diários
                    </h1>
                </div>
                
                {/* Mobile controls */}
                <div className="flex items-center gap-2 md:hidden">
                   <ThemeToggle />
                   {isParentMode && (
                     <button 
                       onClick={onSettingsClick}
                       className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                     >
                       <CogIcon />
                     </button>
                   )}
                   <button 
                     onClick={onAuthClick}
                     className={`p-2 rounded-lg transition-colors ${isParentMode ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                     title={isParentMode ? "Sair do modo pais" : "Acesso dos pais"}
                   >
                     {isParentMode ? <LockOpenIcon /> : <LockClosedIcon />}
                   </button>
                </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 w-full md:w-auto">
                <div className="hidden md:flex items-center gap-2">
                    <ThemeToggle />
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                    
                    {isParentMode && (
                      <button 
                        onClick={onSettingsClick}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all"
                        title="Alterar senha"
                      >
                        <CogIcon />
                        <span className="text-xs font-medium uppercase">Config</span>
                      </button>
                    )}

                    <button 
                      onClick={onAuthClick}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                        isParentMode 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30' 
                          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                      title={isParentMode ? "Sair do modo pais" : "Acesso dos pais"}
                    >
                      {isParentMode ? <LockOpenIcon /> : <LockClosedIcon />}
                      <span className="text-xs font-medium uppercase">{isParentMode ? 'Modo Pais' : 'Acesso Pais'}</span>
                    </button>
                </div>
                
                <div className="flex gap-3 md:gap-4 w-full md:w-auto">
                    <ScoreCard 
                        title="Dia" 
                        score={dailyScore} 
                        gradient="bg-gradient-to-br from-emerald-400 to-emerald-600" 
                    />
                    <ScoreCard 
                        title="Semana" 
                        score={weeklyScore} 
                        gradient="bg-gradient-to-br from-violet-400 to-violet-600" 
                    />
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;