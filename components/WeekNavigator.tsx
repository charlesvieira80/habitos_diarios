
import React from 'react';
import { getWeekRange } from '../utils/dateHelpers';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from './icons/Icons';

interface WeekNavigatorProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

const WeekNavigator: React.FC<WeekNavigatorProps> = ({ currentDate, setCurrentDate }) => {
  const changeWeek = (amount: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (amount * 7));
    setCurrentDate(newDate);
  };
  
  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  }

  const { start, end } = getWeekRange(currentDate);
  
  const formatRange = (start: Date, end: Date) => {
    const startMonth = start.toLocaleDateString('pt-BR', { month: 'short' });
    const endMonth = end.toLocaleDateString('pt-BR', { month: 'short' });

    if (start.getFullYear() !== end.getFullYear()) {
        return `${start.toLocaleDateString('pt-BR', {day: 'numeric', month: 'short', year: 'numeric'})} - ${end.toLocaleDateString('pt-BR', {day: 'numeric', month: 'short', year: 'numeric'})}`;
    }

    if (startMonth === endMonth) {
      return `${start.getDate()} - ${end.getDate()} de ${endMonth}`;
    }
    return `${start.getDate()} de ${startMonth} - ${end.getDate()} de ${endMonth}`;
  };

  return (
    <div className="flex items-center justify-between md:justify-end gap-4 bg-white dark:bg-slate-800 md:bg-transparent md:dark:bg-transparent p-2 md:p-0 rounded-xl shadow-sm md:shadow-none border border-slate-100 dark:border-slate-700 md:border-none">
      <button
        onClick={() => changeWeek(-1)}
        className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 transition-all"
        aria-label="Semana anterior"
      >
        <ChevronLeftIcon />
      </button>
      
      <div className="flex flex-col items-center md:items-end min-w-[160px]">
         <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide cursor-pointer hover:text-indigo-700" onClick={goToCurrentWeek} title="Voltar para hoje">
            <CalendarDaysIcon />
            <span>Semana</span>
         </div>
         <span className="text-sm font-bold text-slate-800 dark:text-white">
            {formatRange(start, end)}
         </span>
      </div>

      <button
        onClick={() => changeWeek(1)}
        className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 transition-all"
        aria-label="Próxima semana"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default WeekNavigator;
