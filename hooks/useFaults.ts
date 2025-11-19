
import { useState, useEffect, useCallback } from 'react';
import type { Fault } from '../types';

const STORAGE_KEY = 'weekly-habit-tracker-faults';

export const useFaults = () => {
  const [faults, setFaults] = useState<Fault[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error('Error reading faults from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(faults));
    } catch (error) {
      console.error('Error writing faults to localStorage', error);
    }
  }, [faults]);

  const addFault = useCallback((date: string, description: string) => {
    if (description.trim() === '') return;
    const newFault: Fault = {
      id: crypto.randomUUID(),
      date,
      description,
    };
    setFaults((prevFaults) => [...prevFaults, newFault]);
  }, []);
  
  const deleteFault = useCallback((faultId: string) => {
    setFaults(prevFaults => prevFaults.filter(fault => fault.id !== faultId));
  }, []);

  return { faults, addFault, deleteFault };
};
