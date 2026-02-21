
import React from 'react';

interface ViewToggleProps {
  view: 'day' | 'week';
  setView: (view: 'day' | 'week') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, setView }) => {
  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl inline-flex w-full md:w-auto shadow-inner">
      <button
        onClick={() => setView('day')}
        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none ${
            view === 'day' 
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        Diário
      </button>
      <button
        onClick={() => setView('week')}
        className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none ${
            view === 'week' 
            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        Semanal
      </button>
    </div>
  );
};

export default ViewToggle;
