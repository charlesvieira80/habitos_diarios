
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
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
      <button
        onClick={() => changeDay(-1)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Dia anterior"
      >
        <ChevronLeftIcon />
      </button>
      <div className="text-center">
        <p className="font-semibold text-lg">
          {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
        </p>
        {isToday && <p className="text-xs text-blue-500 dark:text-blue-400 font-bold">HOJE</p>}
      </div>
      <button
        onClick={() => changeDay(1)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Próximo dia"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default DayNavigator;
