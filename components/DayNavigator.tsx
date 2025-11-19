
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface DayNavigatorProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DayNavigator: React.FC<DayNavigatorProps> = ({ currentDate, setCurrentDate }) => {
  const changeDay = (amount: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + amount);
    setCurrentDate(newDate);
  };

  const isToday = new Date().toDateString() === currentDate.toDateString();

  return (
    <div className="flex items-center justify-between md:justify-end gap-4 bg-white dark:bg-slate-800 md:bg-transparent md:dark:bg-transparent p-2 md:p-0 rounded-xl shadow-sm md:shadow-none border border-slate-100 dark:border-slate-700 md:border-none">
      <button
        onClick={() => changeDay(-1)}
        className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 transition-all"
        aria-label="Dia anterior"
      >
        <ChevronLeftIcon />
      </button>
      
      <div className="flex flex-col items-center md:items-end min-w-[140px]">
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            {isToday ? 'Hoje' : currentDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
        </span>
        <span className="text-xl font-bold text-slate-800 dark:text-white">
             {currentDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
        </span>
      </div>

      <button
        onClick={() => changeDay(1)}
        className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 transition-all"
        aria-label="Próximo dia"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default DayNavigator;
