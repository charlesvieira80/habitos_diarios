import React, { useState } from 'react';
import type { Fault } from '../types';
import { TrashIcon, PlusIcon } from './icons/Icons';

interface FaultsSectionProps {
  faults: Fault[];
  onAddFault: (description: string) => void;
  onDeleteFault: (faultId: string) => void;
  isReadOnly: boolean;
}

const FaultsSection: React.FC<FaultsSectionProps> = ({ faults, onAddFault, onDeleteFault, isReadOnly }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAddFault(description.trim());
      setDescription('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-rose-100 dark:border-rose-900/20 h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-rose-100 dark:bg-rose-900/30 p-1.5 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600 dark:text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
             </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Faltas (-1 Ponto)</h2>
      </div>
      
      {!isReadOnly && (
        <form onSubmit={handleSubmit} className="mb-4 relative">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="O que houve?"
            className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 transition-colors"
            disabled={!description.trim()}
            aria-label="Adicionar Falta"
          >
            <div className="w-4 h-4">
              <PlusIcon />
            </div>
          </button>
        </form>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {faults.length > 0 ? (
          faults.map(fault => (
            <div key={fault.id} className={`group flex items-center justify-between bg-rose-50/50 dark:bg-rose-900/10 p-3 rounded-xl border border-transparent ${!isReadOnly ? 'hover:border-rose-200 dark:hover:border-rose-800' : ''} transition-all`}>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{fault.description}</p>
              {!isReadOnly && (
                <button
                  onClick={() => onDeleteFault(fault.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-800/30 transition-colors"
                  aria-label={`Deletar falta: ${fault.description}`}
                >
                  <div className="w-4 h-4">
                      <TrashIcon />
                  </div>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
            <p className="text-sm text-slate-400 dark:text-slate-500">Nenhuma falta hoje.</p>
            <p className="text-xs text-slate-300 dark:text-slate-600 font-medium mt-1">Continue assim!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaultsSection;