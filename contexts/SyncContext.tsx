
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, get, child, set } from 'firebase/database';

interface SyncContextType {
  familyId: string | null;
  joinFamily: (id: string) => Promise<boolean>;
  createFamily: () => Promise<string>;
  leaveFamily: () => void;
  isOnline: boolean;
}

const SyncContext = createContext<SyncContextType>({} as SyncContextType);

export const useSync = () => useContext(SyncContext);

const STORAGE_KEY_FAMILY_ID = 'habitos_family_id';

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [familyId, setFamilyId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY_FAMILY_ID);
  });

  const isOnline = !!db && !!familyId;

  useEffect(() => {
    if (familyId) {
      localStorage.setItem(STORAGE_KEY_FAMILY_ID, familyId);
    } else {
      localStorage.removeItem(STORAGE_KEY_FAMILY_ID);
    }
  }, [familyId]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createFamily = async () => {
    if (!db) {
        alert("Erro: Firebase não configurado em firebase.ts");
        return '';
    }
    const newId = generateId();
    
    // Verifica se ID já existe (improvável, mas boa prática)
    const snapshot = await get(child(ref(db), `families/${newId}`));
    if (snapshot.exists()) {
        return createFamily(); // Tenta de novo
    }

    // Salva dados locais atuais na nuvem ao criar
    const initialData = {
        tasks: JSON.parse(localStorage.getItem('weekly-habit-tracker-tasks') || '[]'),
        faults: JSON.parse(localStorage.getItem('weekly-habit-tracker-faults') || '[]'),
        rewards: JSON.parse(localStorage.getItem('weekly-habit-tracker-rewards') || '[]'),
        auth: localStorage.getItem('habit-tracker-auth-pwd') || null
    };

    await set(ref(db, `families/${newId}`), initialData);
    setFamilyId(newId);
    return newId;
  };

  const joinFamily = async (id: string) => {
    if (!db) {
        alert("Erro: Firebase não configurado em firebase.ts");
        return false;
    }
    const cleanId = id.trim().toUpperCase();
    try {
        const snapshot = await get(child(ref(db), `families/${cleanId}`));
        if (snapshot.exists()) {
            setFamilyId(cleanId);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
  };

  const leaveFamily = () => {
    if (window.confirm("Tem certeza que deseja sair desta sincronização? Os dados voltarão a ser apenas locais neste dispositivo.")) {
        // REMOÇÃO MANUAL IMEDIATA para evitar race condition com o reload
        localStorage.removeItem(STORAGE_KEY_FAMILY_ID);
        setFamilyId(null);
        window.location.reload();
    }
  };

  return (
    <SyncContext.Provider value={{ familyId, joinFamily, createFamily, leaveFamily, isOnline }}>
      {children}
    </SyncContext.Provider>
  );
};
