
import React from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  currentDate: string; // YYYY-MM-DD
  onToggle: (taskId: string, date: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, currentDate, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">Nenhuma tarefa cadastrada ainda.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Clique no botão '+' para adicionar sua primeira tarefa!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isCompleted={task.completions.includes(currentDate)}
          onToggle={() => onToggle(task.id, currentDate)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;
