
import React, { useState, useEffect } from 'react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (name: string, points: number, description: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [name, setName] = useState('');
  const [points, setPoints] = useState<number | ''>('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setPoints('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && typeof points === 'number' && points > 0) {
      onAddTask(name.trim(), points, description.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Adicionar Nova Tarefa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome da Tarefa
            </label>
            <input
              type="text"
              id="task-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="task-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição <span className="text-xs font-normal text-gray-500">(Opcional)</span>
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Explique como realizar esta tarefa..."
            />
          </div>

          <div>
            <label htmlFor="task-points" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pontos
            </label>
            <input
              type="number"
              id="task-points"
              value={points}
              onChange={(e) => setPoints(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="1"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
              disabled={!name.trim() || !points || points <= 0}
            >
              Salvar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;