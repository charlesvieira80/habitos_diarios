
import React from 'react';
import type { RewardTier } from '../types';
import { GiftIcon } from './icons/Icons';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: RewardTier[];
  currentScore: number;
  maxScore: number;
  isParentMode: boolean;
  onUpdateReward: (tierId: string, description: string) => void;
  onUpdateThreshold?: (tierId: string, newMinPercentage: number) => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  rewards,
  currentScore,
  maxScore,
  isParentMode,
  onUpdateReward,
  onUpdateThreshold
}) => {
  // Importar o hook internamente se não for passado via props para compatibilidade, 
  // mas idealmente deveria vir de cima. Como alteramos o hook, vamos assumir que App.tsx pode não ter passado ainda
  // mas para garantir funcionamento vamos usar condicional no render.
  
  if (!isOpen) return null;

  const percentage = maxScore > 0 ? Math.min(100, Math.max(0, (currentScore / maxScore) * 100)) : 0;

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'diamond': return 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800';
      case 'gold': return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'silver': return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      default: return '';
    }
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
        case 'diamond': return '💎';
        case 'gold': return '🥇';
        case 'silver': return '🥈';
        default: return '';
    }
  }

  // Helper para calcular pontos necessários
  const pointsNeeded = (percent: number) => Math.ceil((percent / 100) * maxScore);

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 flex-shrink-0">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                <GiftIcon />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Quadro de Recompensas</h2>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar pr-1 flex-grow">
            {/* Progress Section */}
            <div className="mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Progresso Semanal</span>
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400 dark:text-slate-500">
                    <span>0%</span>
                    <span>{currentScore} / {maxScore} Pontos</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Tiers List */}
            <div className="space-y-4 pb-2">
                {rewards.map((tier) => {
                    const isAchieved = percentage >= tier.minPercentage;
                    const isNextGoal = !isAchieved && percentage < tier.minPercentage && (
                        // Lógica simples: é o próximo se não atingido e a porcentagem atual é maior que o máximo do nível anterior
                        // Como a lista é decrescente (Diamante -> Ouro -> Prata), verificamos "de baixo pra cima" visualmente
                        // Mas aqui vamos simplificar: Se estou no range do nível abaixo deste.
                        rewards.find(r => r.maxPercentage === tier.minPercentage)?.minPercentage ? percentage >= (rewards.find(r => r.maxPercentage === tier.minPercentage)?.minPercentage || 0) : true
                    );
                    
                    return (
                        <div 
                            key={tier.id} 
                            className={`relative p-4 rounded-xl border-2 transition-all ${getTierColor(tier.id)} ${isAchieved ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-green-400' : 'opacity-90'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 w-full">
                                    <span className="text-2xl">{getTierIcon(tier.id)}</span>
                                    <div className="w-full">
                                        <div className="flex items-center justify-between w-full">
                                            <h3 className="font-bold text-lg">{tier.label}</h3>
                                            
                                            {isParentMode && onUpdateThreshold ? (
                                                <div className="flex items-center bg-white/50 dark:bg-black/20 rounded px-2">
                                                    <span className="text-xs font-bold mr-1">Mín:</span>
                                                    <input 
                                                        type="number" 
                                                        min="0" 
                                                        max="100"
                                                        value={tier.minPercentage}
                                                        onChange={(e) => onUpdateThreshold(tier.id, Number(e.target.value))}
                                                        className="w-12 bg-transparent text-right font-bold text-sm focus:outline-none border-b border-slate-400 focus:border-indigo-500"
                                                    />
                                                    <span className="text-xs ml-0.5 font-bold">%</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-semibold opacity-75 bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">
                                                    {tier.minPercentage}% - {tier.maxPercentage}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {isAchieved && (
                                <div className="mb-2">
                                     <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm animate-pulse inline-block">
                                        CONQUISTADO!
                                    </span>
                                </div>
                            )}
                            
                             {!isAchieved && percentage < tier.minPercentage && percentage >= (tier.id === 'silver' ? 0 : rewards.find(r => r.maxPercentage === tier.minPercentage)?.minPercentage || 0) && (
                                <div className="mb-2">
                                    <span className="bg-slate-800 text-white dark:bg-white dark:text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-sm inline-block">
                                        Faltam {Math.max(0, pointsNeeded(tier.minPercentage) - currentScore)} pts
                                    </span>
                                </div>
                            )}
                            
                            <div className="mt-1">
                                <label className="block text-xs font-semibold uppercase opacity-60 mb-1">Benefício:</label>
                                {isParentMode ? (
                                    <input 
                                        type="text" 
                                        value={tier.description}
                                        onChange={(e) => onUpdateReward(tier.id, e.target.value)}
                                        className="w-full bg-white/50 dark:bg-black/20 border-b border-black/10 dark:border-white/10 px-2 py-1 rounded focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                                    />
                                ) : (
                                    <p className="font-medium text-sm italic leading-relaxed">
                                        "{tier.description}"
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
            <p className="text-xs text-slate-400 italic hidden md:block">
               {isParentMode ? "Edite os percentuais e textos acima." : "Complete as tarefas para atingir os níveis!"}
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors w-full md:w-auto"
            >
              Fechar
            </button>
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;
