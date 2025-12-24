
import React, { useEffect, useState } from 'react';
import { PlayerStats } from '../types';
import { getFinalImpactReport } from '../services/geminiService';
import { Trophy, Share2, RotateCcw, Bird, Heart, Wallet, Loader2, PartyPopper, Sparkles } from 'lucide-react';

interface SummaryProps {
  stats: PlayerStats;
  onRestart: () => void;
}

const Summary: React.FC<SummaryProps> = ({ stats, onRestart }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const text = await getFinalImpactReport({
        birdsSaved: stats.birdsSaved,
        totalBirds: stats.totalBirds || 1, // Avoid div by zero
        budgetLeft: stats.budget,
        satisfaction: stats.satisfaction
      });
      setReport(text);
      setLoading(false);
    };
    fetchReport();
  }, [stats]);

  const successRate = stats.totalBirds > 0 ? (stats.birdsSaved / stats.totalBirds) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-sky-50 overflow-y-auto">
      <div className="max-w-3xl w-full bg-white rounded-[48px] shadow-2xl p-10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 right-0 h-4 bg-emerald-500"></div>
        
        {/* Confetti-like decoration for high performance */}
        {successRate > 70 && (
          <div className="absolute top-8 right-8 rotate-12 opacity-20">
            <PartyPopper className="w-24 h-24 text-emerald-500" />
          </div>
        )}

        {/* 1. Header Section */}
        <div className="flex flex-col items-center text-center mb-10 relative z-10">
           <div className="bg-emerald-100 p-6 rounded-full mb-6 ring-8 ring-emerald-50">
             <Trophy className="w-16 h-16 text-emerald-600" />
           </div>
           <h2 className="text-4xl font-bold text-slate-800 mb-2">年度生态报告</h2>
           <p className="text-slate-500">本迁徙季节，您的城市规划成效如下</p>
        </div>

        {/* 2. AI Ecological Assessment (Moved to the center/halfway point) */}
        <div className="bg-emerald-50/50 p-8 rounded-[40px] border border-emerald-100/50 mb-10 relative min-h-[140px] z-10 shadow-sm">
          <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            AI 生态规划评估
            {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />}
          </h4>
          <div className="text-slate-700 leading-relaxed italic text-sm md:text-base">
            {loading ? (
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
              </div>
            ) : `“${report}”`}
          </div>
        </div>

        {/* 3. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
          <div className="bg-sky-50 p-6 rounded-[32px] text-center border border-sky-100 shadow-sm transition-transform hover:scale-105">
            <Bird className="w-8 h-8 text-sky-500 mx-auto mb-2" />
            <div className="text-2xl font-black text-sky-800">{successRate.toFixed(1)}%</div>
            <div className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">生存率</div>
          </div>
          <div className="bg-rose-50 p-6 rounded-[32px] text-center border border-rose-100 shadow-sm transition-transform hover:scale-105">
            <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <div className="text-2xl font-black text-rose-800">{stats.satisfaction}%</div>
            <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">市民满意度</div>
          </div>
          <div className="bg-emerald-50 p-6 rounded-[32px] text-center border border-emerald-100 shadow-sm transition-transform hover:scale-105">
            <Wallet className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-black text-emerald-800">${stats.budget}</div>
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">剩余预算</div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
           <button 
             onClick={onRestart}
             className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-5 px-8 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-slate-200"
           >
             <RotateCcw className="w-6 h-6" /> 重新开始
           </button>
           <button 
             className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 px-8 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-200"
             onClick={() => alert("分享功能即将上线！将您的生态成绩单同步到市民广场吧。")}
           >
             <Share2 className="w-6 h-6" /> 分享成就
           </button>
        </div>

        {/* 5. Footer Footer */}
        <div className="mt-12 pt-8 border-t border-slate-100 text-center relative z-10">
           <p className="text-slate-400 text-xs font-medium">
             现实行动呼吁：检查你家的窗户，拉上不必要的窗帘。每一分努力都在拯救生命。
           </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
