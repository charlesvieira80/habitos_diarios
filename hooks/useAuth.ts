
import { useState, useEffect } from 'react';
import { useSync } from '../contexts/SyncContext';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

const AUTH_KEY = 'habit-tracker-auth-pwd';

export const useAuth = () => {
  const { familyId } = useSync();
  const [isParentMode, setIsParentMode] = useState(false);
  const [passwordHash, setPasswordHash] = useState<string | null>(null);

  // Carrega senha (local ou remota)
  useEffect(() => {
    if (familyId && db) {
        // Se estamos sincronizados, a "senha correta" vem do banco
        const authRef = ref(db, `families/${familyId}/auth`);
        const unsubscribe = onValue(authRef, (snapshot) => {
            const val = snapshot.val();
            setPasswordHash(val);
        });
        return () => unsubscribe();
    } else {
        // Senão, vem do local storage
        const stored = localStorage.getItem(AUTH_KEY);
        setPasswordHash(stored);
    }
  }, [familyId, db]);

  // Se a senha remota mudar (alguém mudou em outro dispositivo) e eu estou logado...
  // Idealmente não deslogamos abruptamente, mas a verificação de login usará a nova senha.

  const hasPasswordSet = !!passwordHash;

  const login = (password: string): boolean => {
    if (passwordHash === password) {
      setIsParentMode(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsParentMode(false);
  };

  const setPassword = (newPassword: string) => {
    if (familyId && db) {
        set(ref(db, `families/${familyId}/auth`), newPassword);
    } else {
        localStorage.setItem(AUTH_KEY, newPassword);
        setPasswordHash(newPassword);
    }
    setIsParentMode(true); // Auto login after setting
  };

  return {
    isParentMode,
    hasPasswordSet,
    login,
    logout,
    setPassword
  };
};
