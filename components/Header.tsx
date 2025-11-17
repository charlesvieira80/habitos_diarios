import React from 'react';

interface HeaderProps {
  dailyScore: number;
  weeklyScore: number;
}

const ScoreCard: React.FC<{ title: string; score: number; colorClass: string }> = ({ title, score, colorClass }) => (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
    </div>
);

const Header: React.FC<HeaderProps> = ({ dailyScore, weeklyScore }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">
          Hábitos Diários
        </h1>
        <div className="grid grid-cols-2 gap-4">
            <ScoreCard title="Pontos do Dia" score={dailyScore} colorClass="text-green-500" />
            <ScoreCard title="Pontos da Semana" score={weeklyScore} colorClass="text-purple-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;