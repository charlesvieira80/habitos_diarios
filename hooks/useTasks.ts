
import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types';
import { useSync } from '../contexts/SyncContext';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

const STORAGE_KEY = 'weekly-habit-tracker-tasks';

export const useTasks = () => {
  const { familyId } = useSync();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Inicialização e Listeners
  useEffect(() => {
    if (familyId && db) {
      // Modo Online: Ouve Firebase
      const tasksRef = ref(db, `families/${familyId}/tasks`);
      const unsubscribe = onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        // CORREÇÃO CRÍTICA: O Firebase pode retornar um objeto se as chaves não forem sequenciais
        // ou se houver "buracos" no array. Também não salva arrays vazios.
        const rawData = data || [];
        const tasksArray = (Array.isArray(rawData) ? rawData : Object.values(rawData)).filter(Boolean);
        
        const sanitizedTasks = tasksArray.map((task: any) => ({
            ...task,
            completions: task.completions || []
        }));
        setTasks(sanitizedTasks);
      });
      return () => unsubscribe();
    } else {
      // Modo Offline: Lê do LocalStorage
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        // Mesma higienização para o localStorage por segurança
        const parsed = item ? JSON.parse(item) : [];
        const sanitizedTasks = parsed.map((task: any) => ({
            ...task,
            completions: task.completions || []
        }));
        setTasks(sanitizedTasks);
      } catch (error) {
        console.error('Error reading from localStorage', error);
        setTasks([]);
      }
    }
  }, [familyId, db]);

  // Persistência Local (apenas quando offline ou como backup)
  useEffect(() => {
    if (!familyId) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
          console.error('Error writing to localStorage', error);
        }
    }
  }, [tasks, familyId]);

  // Helper para salvar (decide se vai pro Firebase ou LocalStorage)
  const saveTasks = (newTasks: Task[]) => {
    if (familyId && db) {
        set(ref(db, `families/${familyId}/tasks`), newTasks);
    } else {
        setTasks(newTasks);
    }
  };

  const addTask = useCallback((name: string, points: number, description: string = '') => {
    if (name.trim() === '' || points <= 0) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      description,
      points: Number(points),
      completions: [],
    };
    
    setTasks(prev => {
        const updated = [...prev, newTask];
        if (familyId && db) {
             set(ref(db, `families/${familyId}/tasks`), updated);
        }
        return updated;
    });
  }, [familyId]);

  const toggleTaskCompletion = useCallback((taskId: string, date: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map((task) => {
        if (task.id === taskId) {
          const currentCompletions = task.completions || []; // Segurança extra
          const completions = currentCompletions.includes(date)
            ? currentCompletions.filter((d) => d !== date)
            : [...currentCompletions, date].sort();
          return { ...task, completions };
        }
        return task;
      });
      
      if (familyId && db) {
        set(ref(db, `families/${familyId}/tasks`), updatedTasks);
      }
      return updatedTasks;
    });
  }, [familyId]);
  
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => {
        const updated = prevTasks.filter(task => task.id !== taskId);
        if (familyId && db) {
            set(ref(db, `families/${familyId}/tasks`), updated);
        }
        return updated;
    });
  }, [familyId]);

  return { tasks, addTask, toggleTaskCompletion, deleteTask };
};
