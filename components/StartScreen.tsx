
import React from 'react';
import { Bird as BirdIcon, TreePine, Wind } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-emerald-50 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-20 animate-bounce opacity-30">
        <BirdIcon className="w-16 h-16 text-sky-400" />
      </div>
      <div className="absolute bottom-20 right-20 animate-pulse opacity-20">
        <TreePine className="w-32 h-32 text-emerald-400" />
      </div>
      <div className="absolute top-40 right-40 animate-pulse opacity-20">
        <Wind className="w-12 h-12 text-blue-300" />
      </div>

      <div className="z-10 text-center max-w-2xl px-8">
        <div className="mb-6 flex justify-center">
          <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-emerald-200/50">
             <BirdIcon className="w-20 h-20 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-slate-800 mb-4 tracking-tight">
          城市之翼
          <span className="block text-2xl font-medium text-emerald-600 mt-2">城市生态规划师</span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
          候鸟迁徙季节已至。作为这座城市的规划师，你的使命是改造危机四伏的建筑与设施，在有限的预算内，为穿越钢筋水泥丛林的生命开辟一条安全通道。
        </p>
        
        <button 
          onClick={onStart}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-12 rounded-full text-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95"
        >
          开始规划
        </button>

        <div className="mt-12 text-sm text-slate-400">
          2.5D 沉浸式生态治理模拟游戏
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
