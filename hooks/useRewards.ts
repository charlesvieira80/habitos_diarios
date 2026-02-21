
import { useState, useEffect, useCallback } from 'react';
import type { RewardTier } from '../types';
import { useSync } from '../contexts/SyncContext';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

const STORAGE_KEY = 'weekly-habit-tracker-rewards';

const DEFAULT_REWARDS: RewardTier[] = [
  {
    id: 'diamond',
    label: 'Nível Diamante',
    minPercentage: 95,
    maxPercentage: 100,
    description: 'Passeio especial no fim de semana + Escolher o almoço de domingo',
  },
  {
    id: 'gold',
    label: 'Nível Ouro',
    minPercentage: 80,
    maxPercentage: 95,
    description: '1 hora extra de videogame ou TV',
  },
  {
    id: 'silver',
    label: 'Nível Prata',
    minPercentage: 70,
    maxPercentage: 80,
    description: 'Escolher um filme para assistir com a família',
  },
];

export const useRewards = () => {
  const { familyId } = useSync();
  const [rewards, setRewards] = useState<RewardTier[]>(DEFAULT_REWARDS);

  useEffect(() => {
    if (familyId && db) {
      const rewardsRef = ref(db, `families/${familyId}/rewards`);
      const unsubscribe = onValue(rewardsRef, (snapshot) => {
        const data = snapshot.val();
        // Se vier do banco, usa. Se não tiver nada no banco (null), usa default.
        const rawData = data || [];
        const rewardsArray = (Array.isArray(rawData) ? rawData : Object.values(rawData)).filter(Boolean);
        setRewards(rewardsArray.length === 3 ? rewardsArray : DEFAULT_REWARDS);
      });
      return () => unsubscribe();
    } else {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) {
            const parsed = JSON.parse(item);
            setRewards(parsed.length === 3 ? parsed : DEFAULT_REWARDS);
        } else {
            setRewards(DEFAULT_REWARDS);
        }
      } catch (error) {
        console.error('Error reading rewards from localStorage', error);
      }
    }
  }, [familyId, db]);

  useEffect(() => {
    if (!familyId) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rewards));
        } catch (error) {
          console.error('Error writing rewards to localStorage', error);
        }
    }
  }, [rewards, familyId]);

  const updateRewardDescription = useCallback((tierId: string, description: string) => {
    setRewards((prev) => {
        const updated = prev.map((tier) =>
            tier.id === tierId ? { ...tier, description } : tier
        );
        if (familyId && db) {
            set(ref(db, `families/${familyId}/rewards`), updated);
        }
        return updated;
    });
  }, [familyId]);

  const updateRewardThreshold = useCallback((tierId: string, newMinPercentage: number) => {
    // Validação básica: 0 a 100
    if (newMinPercentage < 0 || newMinPercentage > 100) return;

    setRewards((prev) => {
        // Clona o array para não mutar diretamente
        const updated = [...prev];
        const tierIndex = updated.findIndex(t => t.id === tierId);
        
        if (tierIndex === -1) return prev;

        // Atualiza o mínimo do nível atual
        updated[tierIndex] = {
            ...updated[tierIndex],
            minPercentage: newMinPercentage
        };

        // Lógica de Cascata:
        // Se eu mudo o mínimo do Diamante (index 0), o máximo do Ouro (index 1) deve ser igual ao novo mínimo do Diamante.
        // Se eu mudo o mínimo do Ouro (index 1), o máximo da Prata (index 2) deve ser igual ao novo mínimo do Ouro.
        // A Prata é o último, então só muda o mínimo dela.
        
        if (tierIndex + 1 < updated.length) {
             updated[tierIndex + 1] = {
                ...updated[tierIndex + 1],
                maxPercentage: newMinPercentage
            };
        }

        if (familyId && db) {
            set(ref(db, `families/${familyId}/rewards`), updated);
        }
        return updated;
    });
  }, [familyId]);

  return { rewards, updateRewardDescription, updateRewardThreshold };
};
