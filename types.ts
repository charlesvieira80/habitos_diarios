
export interface Task {
  id: string;
  name: string;
  description?: string; // Nova propriedade opcional
  points: number;
  completions: string[]; // Array of dates in 'YYYY-MM-DD' format
}

export interface Fault {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
}

export interface RewardTier {
  id: 'diamond' | 'gold' | 'silver';
  label: string;
  minPercentage: number;
  maxPercentage: number;
  description: string; // O benefício cadastrado pelos pais
}
