
export interface Task {
  id: string;
  name: string;
  points: number;
  completions: string[]; // Array of dates in 'YYYY-MM-DD' format
}
