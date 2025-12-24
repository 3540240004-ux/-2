
import React, { useEffect, useState } from 'react';
import { PlayerStats } from '../types';
import { getFinalImpactReport } from '../services/geminiService';
import { Trophy, Share2, RotateCcw, Bird, Heart, Wallet, Loader2, PartyPopper, Sparkles } from 'lucide-react';

interface SummaryProps { stats: PlayerStats; onRestart: () => void; }

const Summary: React.FC<SummaryProps> = ({ stats, onRestart }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const text = await getFinalImpactReport({ birdsSaved: stats.birdsSaved, totalBirds: stats.totalBirds || 1, budgetLeft: stats.budget, satisfaction: stats.satisfaction });
      setReport(text);
      setLoading(false);
    };
    fetchReport();
  }, [stats]);

  const successRate = stats.totalBirds > 0 ? (stats.birdsSaved / stats.totalBirds) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8 bg-gradient-to-br from-emerald-50 to-sky-50 overflow-y-auto pt-20">
      <div className="max-w-3xl w-full bg-white rounded-[32px] sm:rounded-[48px] shadow-2xl p-6 sm:p-10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500 mb-8">
        <div className="absolute top-0 left-0 right-0 h-3 sm:h-4 bg-emerald-500"></div>
        
        {successRate > 70 && <div className="absolute top-6 right-6 rotate-12 opacity-10 sm:opacity-20 pointer-events-none"><PartyPopper className="w-16 h-16 sm:w-24 sm:h-24 text-emerald-500" /></div>}

        <div className="flex flex-col items-center text-center mb-8 sm:mb-10 relative z-10">
           <div className="bg-emerald-100 p-4 sm:p-6 rounded-full mb-4 sm:mb-6 ring-4 sm:ring-8 ring-emerald-50"><Trophy className="w-10 h-10 sm:w-16 sm:h-16 text-emerald-600" /></div>
           <h2 className="text-2xl sm:text-4xl font-bold text-slate-800 mb-1">本季生态评估报告</h2>
           <p className="text-xs sm:text-base text-slate-500 italic">您的每一项规划都在改写候鸟的命运</p>
        </div>

        <div className="bg-emerald-50/50 p-5 sm:p-8 rounded-[24px] sm:rounded-[40px] border border-emerald-100/50 mb-8 sm:mb-10 relative min-h-[100px] z-10 shadow-sm">
          <h4 className="font-bold text-emerald-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            AI 生态学家点评报告
            {loading && <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />}
          </h4>
          <div className="text-slate-700 leading-relaxed italic text-xs sm:text-base">
            {loading ? <div className="space-y-2"><div className="h-3 bg-slate-200 rounded animate-pulse w-full"></div><div className="h-3 bg-slate-200 rounded animate-pulse w-4/5"></div></div> : `“${report}”`}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12 relative z-10">
          <div className="bg-sky-50 p-3 sm:p-6 rounded-2xl sm:rounded-[32px] text-center border border-sky-100 transition-transform hover:scale-105 active:scale-95">
            <Bird className="w-5 h-5 sm:w-8 sm:h-8 text-sky-500 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-black text-sky-800">{successRate.toFixed(1)}%</div>
            <div className="text-[8px] sm:text-[10px] text-sky-600 font-bold uppercase tracking-widest">存活率</div>
          </div>
          <div className="bg-rose-50 p-3 sm:p-6 rounded-2xl sm:rounded-[32px] text-center border border-rose-100 transition-transform hover:scale-105 active:scale-95">
            <Heart className="w-5 h-5 sm:w-8 sm:h-8 text-rose-500 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-black text-rose-800">{stats.satisfaction}%</div>
            <div className="text-[8px] sm:text-[10px] text-rose-600 font-bold uppercase tracking-widest">满意度</div>
          </div>
          <div className="bg-emerald-50 p-3 sm:p-6 rounded-2xl sm:rounded-[32px] text-center border border-emerald-100 transition-transform hover:scale-105 active:scale-95">
            <Wallet className="w-5 h-5 sm:w-8 sm:h-8 text-emerald-500 mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-2xl font-black text-emerald-800">${stats.budget}</div>
            <div className="text-[8px] sm:text-[10px] text-emerald-600 font-bold uppercase tracking-widest">预算余量</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10">
           <button onClick={onRestart} className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95"><RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" /> 重新开始</button>
           <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 sm:py-5 px-6 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95" onClick={() => alert("分享功能即将上线！")}><Share2 className="w-5 h-5 sm:w-6 sm:h-6" /> 分享成就</button>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-100 text-center relative z-10">
           <p className="text-slate-400 text-[10px] sm:text-xs font-medium">现实行动呼吁：了解本地候鸟迁徙路径，从随手熄灯开始保护它们。</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
