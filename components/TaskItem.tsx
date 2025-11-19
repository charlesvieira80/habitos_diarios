import React, { useState } from 'react';
import type { Task } from '../types';
import { TrashIcon, InfoIcon } from './icons/Icons';

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isReadOnly: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isCompleted, onToggle, onDelete, isReadOnly }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleToggleClick = () => {
    if (!isReadOnly) {
      onToggle();
    }
  };

  return (
    <div 
        className={`group relative flex flex-col p-4 rounded-xl transition-all duration-300 border 
        ${isCompleted 
            ? 'bg-slate-50 dark:bg-slate-800/50 border-emerald-200 dark:border-emerald-900/30' 
            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'
        }
        ${!isReadOnly ? 'hover:shadow-md hover:-translate-y-0.5' : ''}
        `}
    >
      {/* Main Row: Checkbox, Name, Actions */}
      <div className="flex items-center w-full">
        {/* Click area wrapper for toggling completion */}
        <div 
          className={`flex-grow flex items-center select-none ${!isReadOnly ? 'cursor-pointer' : 'cursor-default'}`} 
          onClick={handleToggleClick}
        >
            <div 
                className={`w-8 h-8 rounded-xl border-2 flex-shrink-0 mr-4 flex items-center justify-center transition-all duration-300 ${
                isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 scale-110' 
                    : `bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-500 ${!isReadOnly ? 'group-hover:border-indigo-400' : ''}`
                } ${isReadOnly && !isCompleted ? 'opacity-50' : ''}`}
            >
            {isCompleted && (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
            </div>
            
            <div className="flex-grow">
            <h3 className={`text-lg font-semibold transition-colors ${isCompleted ? 'text-slate-400 dark:text-slate-500 line-through decoration-2 decoration-slate-300' : 'text-slate-800 dark:text-slate-100'}`}>
                {task.name}
            </h3>
            </div>
        </div>

        <div className="flex items-center gap-2 pl-2">
            {task.description && (
                <button 
                    onClick={toggleExpand}
                    className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                    aria-label="Ver descrição"
                    title="Ver descrição"
                >
                    <InfoIcon />
                </button>
            )}

            <span className={`px-3 py-1 rounded-full text-sm font-bold border whitespace-nowrap ${
                isCompleted 
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'
            }`}>
                +{task.points} pts
            </span>
            
            {!isReadOnly && (
              <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Deletar tarefa"
              >
                  <TrashIcon />
              </button>
            )}
        </div>
        
        {/* Mobile delete button */}
        {!isReadOnly && (
          <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                  }}
                  className="lg:hidden absolute top-2 right-2 p-1.5 rounded-lg text-slate-300 hover:text-rose-500 transition-colors"
                  aria-label="Deletar tarefa mobile"
              >
                  <div className="w-4 h-4">
                  <TrashIcon />
                  </div>
          </button>
        )}
      </div>

      {/* Description Section */}
      {isExpanded && task.description && (
        <div className="mt-3 ml-12 mr-2 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 animate-fade-in">
            <div className="flex gap-2">
                <div className="mt-0.5 flex-shrink-0 text-indigo-500">
                    <InfoIcon />
                </div>
                <p className="leading-relaxed">{task.description}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;