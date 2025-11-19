import React, { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { useFaults } from './hooks/useFaults';
import { useAuth } from './hooks/useAuth';
import { formatDate, getWeekRange } from './utils/dateHelpers';
import Header from './components/Header';
import DayNavigator from './components/DayNavigator';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import AuthModal from './components/AuthModal';
import { PlusIcon } from './components/icons/Icons';
import ViewToggle from './components/ViewToggle';
import WeekNavigator from './components/WeekNavigator';
import WeeklyTaskGrid from './components/WeeklyTaskGrid';
import FaultsSection from './components/FaultsSection';

export default function App() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTasks();
  const { faults, addFault, deleteFault } = useFaults();
  const { isParentMode, hasPasswordSet, login, logout, setPassword } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [view, setView] = useState<'day' | 'week'>('day');
  
  // Auth Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'change_password'>('login');

  const formattedCurrentDate = useMemo(() => formatDate(currentDate), [currentDate]);

  // Derived state for child components
  const isReadOnly = !isParentMode;

  const dailyScore = useMemo(() => {
    const pointsFromTasks = tasks.reduce((total, task) => {
      if (task.completions.includes(formattedCurrentDate)) {
        return total + task.points;
      }
      return total;
    }, 0);
    const pointsFromFaults = faults.filter(f => f.date === formattedCurrentDate).length;
    return pointsFromTasks - pointsFromFaults;
  }, [tasks, faults, formattedCurrentDate]);

  const weeklyScore = useMemo(() => {
    const { start, end } = getWeekRange(currentDate);
    end.setHours(23, 59, 59, 999);

    let totalTaskPoints = 0;
    for (const task of tasks) {
      for (const completionStr of task.completions) {
        const completionDate = new Date(`${completionStr}T00:00:00`);
        if (completionDate >= start && completionDate <= end) {
          totalTaskPoints += task.points;
        }
      }
    }

    let totalFaults = 0;
    for (const fault of faults) {
        const faultDate = new Date(`${fault.date}T00:00:00`);
        if(faultDate >= start && faultDate <= end) {
            totalFaults++;
        }
    }

    return totalTaskPoints - totalFaults;
  }, [tasks, faults, currentDate]);

  const handleAddTask = (name: string, points: number, description: string) => {
    addTask(name, points, description);
    setIsTaskModalOpen(false);
  };

  // Auth Handlers
  const handleAuthClick = () => {
    if (isParentMode) {
      logout();
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleSettingsClick = () => {
    if (isParentMode) {
      setAuthMode('change_password');
      setIsAuthModalOpen(true);
    }
  };
  
  const faultsForToday = useMemo(() => {
    return faults.filter(f => f.date === formattedCurrentDate).sort((a,b) => a.id.localeCompare(b.id));
  }, [faults, formattedCurrentDate]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        dailyScore={dailyScore} 
        weeklyScore={weeklyScore} 
        isParentMode={isParentMode}
        onAuthClick={handleAuthClick}
        onSettingsClick={handleSettingsClick}
      />
      
      <main className="flex-grow w-full max-w-7xl mx-auto p-2 md:p-6 space-y-6 pb-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-1 md:px-0">
             <ViewToggle view={view} setView={setView} />
             <div className="w-full md:w-auto">
                {view === 'day' ? (
                    <DayNavigator currentDate={currentDate} setCurrentDate={setCurrentDate} />
                ) : (
                    <WeekNavigator currentDate={currentDate} setCurrentDate={setCurrentDate} />
                )}
             </div>
        </div>

        <div className="animate-fade-in">
            {view === 'day' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <TaskList
                      tasks={tasks}
                      currentDate={formattedCurrentDate}
                      onToggle={toggleTaskCompletion}
                      onDelete={deleteTask}
                      isReadOnly={isReadOnly}
                    />
                </div>
                <div className="lg:col-span-1">
                    <FaultsSection 
                      faults={faultsForToday}
                      onAddFault={(desc) => addFault(formattedCurrentDate, desc)}
                      onDeleteFault={deleteFault}
                      isReadOnly={isReadOnly}
                    />
                </div>
            </div>
            ) : (
            <WeeklyTaskGrid
                tasks={tasks}
                currentDate={currentDate}
                onToggle={toggleTaskCompletion}
                onDelete={deleteTask}
                isReadOnly={isReadOnly}
            />
            )}
        </div>
      </main>

      {isParentMode && (
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-4 shadow-xl shadow-indigo-500/30 transform transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900 z-40"
          aria-label="Adicionar nova tarefa"
        >
          <PlusIcon />
        </button>
      )}

      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={login}
        onSetPassword={setPassword}
        hasPasswordSet={hasPasswordSet}
        isSettingNewPassword={!hasPasswordSet || authMode === 'change_password'}
      />
    </div>
  );
}