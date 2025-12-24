
import React from 'react';
import { Bird as BirdIcon, TreePine, Wind } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-emerald-50 relative overflow-hidden px-6">
      <div className="absolute top-10 left-10 md:top-20 md:left-20 animate-bounce opacity-30">
        <BirdIcon className="w-12 h-12 md:w-16 md:h-16 text-sky-400" />
      </div>
      <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 animate-pulse opacity-20">
        <TreePine className="w-24 h-24 md:w-32 md:h-32 text-emerald-400" />
      </div>

      <div className="z-10 text-center max-w-2xl">
        <div className="mb-6 flex justify-center">
          <div className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl shadow-emerald-200/50">
             <BirdIcon className="w-12 h-12 md:w-20 md:h-20 text-emerald-500" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4 tracking-tight">
          城市之翼
          <span className="block text-lg md:text-2xl font-medium text-emerald-600 mt-2">城市生态规划师</span>
        </h1>
        <p className="text-base md:text-xl text-slate-600 mb-10 md:leading-relaxed">
          候鸟迁徙季节已至。作为这座城市的规划师，你的使命是改造危机四伏的建筑与设施，在有限的预算内，为穿越钢筋水泥丛林的生命开辟一条安全通道。
        </p>
        
        <button 
          onClick={onStart}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 md:px-12 rounded-full text-xl md:text-2xl shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95"
        >
          开始规划
        </button>

        <div className="mt-12 text-xs md:text-sm text-slate-400">
          跨平台 沉浸式生态治理模拟游戏
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
