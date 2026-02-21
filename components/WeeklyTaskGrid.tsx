import React from 'react';
import type { Task } from '../types';
import { formatDate, getDatesOfWeek } from '../utils/dateHelpers';
import { TrashIcon } from './icons/Icons';

interface WeeklyTaskGridProps {
  tasks: Task[];
  currentDate: Date;
  onToggle: (taskId: string, date: string) => void;
  onDelete: (taskId: string) => void;
  isReadOnly: boolean;
}

const WeeklyTaskGrid: React.FC<WeeklyTaskGridProps> = ({ tasks, currentDate, onToggle, onDelete, isReadOnly }) => {
  const weekDates = getDatesOfWeek(currentDate);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Sem tarefas ainda</h3>
        {!isReadOnly && (
          <p className="text-slate-500 dark:text-slate-400 mt-2">Comece adicionando um novo hábito para rastrear sua semana.</p>
        )}
      </div>
    );
  }

  const todayStr = formatDate(new Date());

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              {/* Adjusted column width for mobile: w-28 (112px) on mobile, larger on desktop */}
              <th className="px-3 md:px-6 py-4 w-28 min-w-[7rem] md:w-64 md:min-w-[16rem] sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hábito</span>
              </th>
              {weekDates.map((date) => {
                const dateStr = formatDate(date);
                const isToday = dateStr === todayStr;
                return (
                  <th key={dateStr} className={`px-1 md:px-2 py-4 text-center min-w-[50px] md:min-w-[60px] ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <div className={`flex flex-col items-center ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <span className="text-[10px] md:text-xs font-medium uppercase mb-1">{date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                      <span className={`text-base md:text-lg font-bold w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : ''}`}>
                        {date.getDate()}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {tasks.map((task) => (
              <tr key={task.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                {/* Reduced padding and added truncation logic */}
                <td className="px-3 md:px-6 py-3 font-medium text-slate-800 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] max-w-[7rem] md:max-w-[16rem]">
                  <div className="flex items-center justify-between gap-1 md:gap-2">
                      <div className="flex flex-col overflow-hidden">
                          <span className="truncate block w-full text-xs md:text-sm" title={task.description ? `${task.name}: ${task.description}` : task.name}>{task.name}</span>
                          {task.description && (
                              <span className="hidden md:block text-[10px] text-slate-400 truncate w-full">{task.description}</span>
                          )}
                      </div>
                      {!isReadOnly && (
                        <button
                          onClick={() => onDelete(task.id)}
                          className="hidden md:block p-1.5 rounded-lg text-slate-300 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-900/30 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                          aria-label={`Deletar tarefa ${task.name}`}
                        >
                           <div className="w-4 h-4">
                              <TrashIcon />
                           </div>
                        </button>
                      )}
                  </div>
                </td>
                {weekDates.map((date) => {
                  const dateStr = formatDate(date);
                  const isCompleted = task.completions.includes(dateStr);
                  const isToday = dateStr === todayStr;
                  return (
                    <td key={dateStr} className={`px-1 md:px-2 py-3 text-center ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/5' : ''}`}>
                      <button
                        onClick={() => !isReadOnly && onToggle(task.id, dateStr)}
                        disabled={isReadOnly}
                        className={`w-8 h-8 md:w-10 md:h-10 mx-auto rounded-xl flex items-center justify-center transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/50
                          ${isCompleted 
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-100 ' + (!isReadOnly ? 'hover:scale-105 hover:bg-emerald-600' : '') 
                            : 'bg-slate-100 dark:bg-slate-700/50 text-transparent ' + (!isReadOnly ? 'hover:bg-slate-200 dark:hover:bg-slate-700' : 'cursor-default')
                          }`}
                        aria-label={`Alternar tarefa para ${dateStr}`}
                        title={isReadOnly ? (isCompleted ? 'Concluído' : '') : (isCompleted ? 'Concluído' : 'Marcar como concluído')}
                      >
                         {isCompleted ? (
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                         ) : (
                            !isReadOnly && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-300 dark:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyTaskGrid;