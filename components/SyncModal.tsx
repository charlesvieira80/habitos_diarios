
import React, { useState } from 'react';
import { useSync } from '../contexts/SyncContext';
import { CloudIcon, ClipboardIcon } from './icons/Icons';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose }) => {
  const { familyId, createFamily, joinFamily, leaveFamily } = useSync();
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    setIsLoading(true);
    await createFamily();
    setIsLoading(false);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    
    setIsLoading(true);
    const success = await joinFamily(inputCode);
    setIsLoading(false);
    
    if (success) {
        setError('');
        // Opcional: Fechar modal ou mostrar sucesso
    } else {
        setError('Código inválido ou família não encontrada.');
    }
  };

  const copyToClipboard = () => {
    if (familyId) {
        navigator.clipboard.writeText(familyId);
        alert('Código copiado!');
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-6">
            <div className="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-xl text-sky-600 dark:text-sky-400">
                <CloudIcon />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Sincronização em Nuvem</h2>
        </div>

        {!familyId ? (
            <div className="space-y-8">
                <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Já tem um código?</h3>
                    <form onSubmit={handleJoin} className="flex gap-2">
                        <input 
                            type="text" 
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                            placeholder="Digite o código da família"
                            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase font-mono"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading || !inputCode}
                            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OU</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                </div>

                <div className="text-center">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Começar do zero</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Crie um código novo e compartilhe com outros dispositivos para sincronizar seus dados.</p>
                    <button 
                        onClick={handleCreate}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                        {isLoading ? 'Criando...' : 'Criar nova Família'}
                    </button>
                </div>
            </div>
        ) : (
            <div className="space-y-6 text-center">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl">
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium mb-2">Sincronização Ativa!</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Compartilhe este código com outros dispositivos:</p>
                    
                    <div className="flex items-center justify-center gap-2">
                        <code className="text-3xl font-mono font-bold text-slate-800 dark:text-white tracking-widest bg-white dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                            {familyId}
                        </code>
                        <button 
                            onClick={copyToClipboard}
                            className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Copiar código"
                        >
                            <ClipboardIcon />
                        </button>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                        onClick={leaveFamily}
                        className="text-rose-500 hover:text-rose-600 text-sm font-medium hover:underline"
                    >
                        Desconectar deste dispositivo
                    </button>
                </div>
            </div>
        )}

        <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default SyncModal;
