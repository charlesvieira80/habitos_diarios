
import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { formatDate, getWeekRange } from './utils/dateHelpers';
import Header from './components/Header';
import DayNavigator from './components/DayNavigator';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import { PlusIcon } from './components/icons/Icons';

export default function App() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedCurrentDate = useMemo(() => formatDate(currentDate), [currentDate]);

  const dailyScore = useMemo(() => {
    return tasks.reduce((total, task) => {
      if (task.completions.includes(formattedCurrentDate)) {
        return total + task.points;
      }
      return total;
    }, 0);
  }, [tasks, formattedCurrentDate]);

  const weeklyScore = useMemo(() => {
    const { start, end } = getWeekRange(currentDate);
    end.setHours(23, 59, 59, 999);

    let total = 0;
    for (const task of tasks) {
      for (const completionStr of task.completions) {
        const completionDate = new Date(`${completionStr}T00:00:00`);
        if (completionDate >= start && completionDate <= end) {
          total += task.points;
        }
      }
    }
    return total;
  }, [tasks, currentDate]);

  const handleAddTask = (name: string, points: number) => {
    addTask(name, points);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto flex flex-col font-sans">
      <Header dailyScore={dailyScore} weeklyScore={weeklyScore} />
      
      <main className="flex-grow p-4 space-y-4">
        <DayNavigator currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <TaskList
          tasks={tasks}
          currentDate={formattedCurrentDate}
          onToggle={toggleTaskCompletion}
          onDelete={deleteTask}
        />
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        aria-label="Adicionar nova tarefa"
      >
        <PlusIcon />
      </button>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
