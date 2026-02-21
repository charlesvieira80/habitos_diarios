
import { useState, useEffect, useCallback } from 'react';
import type { Fault } from '../types';
import { useSync } from '../contexts/SyncContext';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

const STORAGE_KEY = 'weekly-habit-tracker-faults';

export const useFaults = () => {
  const { familyId } = useSync();
  const [faults, setFaults] = useState<Fault[]>([]);

  useEffect(() => {
    if (familyId && db) {
      const faultsRef = ref(db, `families/${familyId}/faults`);
      const unsubscribe = onValue(faultsRef, (snapshot) => {
        const data = snapshot.val();
        const rawData = data || [];
        const faultsArray = (Array.isArray(rawData) ? rawData : Object.values(rawData)).filter(Boolean);
        setFaults(faultsArray);
      });
      return () => unsubscribe();
    } else {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        setFaults(item ? JSON.parse(item) : []);
      } catch (error) {
        console.error('Error reading faults from localStorage', error);
        setFaults([]);
      }
    }
  }, [familyId, db]);

  useEffect(() => {
    if (!familyId) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(faults));
        } catch (error) {
          console.error('Error writing faults to localStorage', error);
        }
    }
  }, [faults, familyId]);

  const addFault = useCallback((date: string, description: string) => {
    if (description.trim() === '') return;
    const newFault: Fault = {
      id: crypto.randomUUID(),
      date,
      description,
    };
    
    setFaults(prev => {
        const updated = [...prev, newFault];
        if (familyId && db) {
            set(ref(db, `families/${familyId}/faults`), updated);
        }
        return updated;
    });
  }, [familyId]);
  
  const deleteFault = useCallback((faultId: string) => {
    setFaults(prev => {
        const updated = prev.filter(fault => fault.id !== faultId);
        if (familyId && db) {
            set(ref(db, `families/${familyId}/faults`), updated);
        }
        return updated;
    });
  }, [familyId]);

  return { faults, addFault, deleteFault };
};
