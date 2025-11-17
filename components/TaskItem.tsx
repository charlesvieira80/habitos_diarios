
import React from 'react';
import type { Task } from '../types';
import { TrashIcon } from './icons/Icons';

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isCompleted, onToggle, onDelete }) => {
  return (
    <div className={`flex items-center p-4 rounded-lg shadow-sm transition-all duration-300 ${isCompleted ? 'bg-green-100 dark:bg-green-900/50' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex-grow flex items-center cursor-pointer" onClick={onToggle}>
        <div 
            className={`w-6 h-6 rounded-md border-2 flex-shrink-0 mr-4 flex items-center justify-center transition-colors ${
            isCompleted 
                ? 'bg-blue-600 border-blue-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
        >
          {isCompleted && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="flex-grow">
          <p className={`font-medium ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
            {task.name}
          </p>
        </div>
      </div>
      <div className={`font-bold text-lg mr-4 px-3 py-1 rounded-full text-white ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}>
          {task.points}
      </div>
      <button 
        onClick={(e) => {
            e.stopPropagation();
            onDelete();
        }}
        className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 transition-colors"
        aria-label="Deletar tarefa"
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export default TaskItem;
