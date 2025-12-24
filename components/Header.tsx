
import React from 'react';
import { PlayerStats, GameState } from '../types';
import { Wallet, Heart, Bird, BookOpen, BarChart3, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  stats: PlayerStats;
  onShowGallery: () => void;
  onShowSummary: () => void;
  onBack: () => void;
  gameState: GameState;
}

const Header: React.FC<HeaderProps> = ({ stats, onShowGallery, onShowSummary, onBack, gameState }) => {
  return (
    <header className="absolute top-0 left-0 right-0 p-2 md:p-4 z-50 flex justify-between items-start pointer-events-none">
      <div className="flex flex-wrap gap-2 md:gap-4 pointer-events-auto max-w-[70%]">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg flex items-center gap-1.5 md:gap-2 border border-emerald-100">
          <Wallet className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
          <span className="font-bold text-xs md:text-sm lg:text-base text-emerald-800">${stats.budget}</span>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg flex items-center gap-1.5 md:gap-2 border border-rose-100">
          <Heart className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />
          <span className="font-bold text-xs md:text-sm lg:text-base text-rose-700">{stats.satisfaction}%</span>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg flex items-center gap-1.5 md:gap-2 border border-sky-100">
          <Bird className="w-4 h-4 md:w-5 md:h-5 text-sky-500" />
          <span className="font-bold text-xs md:text-sm lg:text-base text-sky-700">{stats.birdsSaved}/{stats.totalBirds}</span>
        </div>
      </div>

      <div className="flex gap-2 pointer-events-auto">
        <button 
          onClick={onBack}
          className="bg-white/90 hover:bg-white backdrop-blur-md p-2 md:p-2.5 rounded-full shadow-lg border border-slate-200 transition-all active:scale-95"
          title="返回"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
        </button>
        <button 
          onClick={onShowGallery}
          className="bg-white/90 hover:bg-white backdrop-blur-md p-2 md:p-2.5 rounded-full shadow-lg border border-slate-200 transition-all active:scale-95"
          title="鸟类图鉴"
        >
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
        </button>
        <button 
          onClick={onShowSummary}
          className="bg-white/90 hover:bg-white backdrop-blur-md p-2 md:p-2.5 rounded-full shadow-lg border border-slate-200 transition-all active:scale-95"
          title="成效总结"
        >
          <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
