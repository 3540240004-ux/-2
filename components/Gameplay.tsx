
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LevelId, LevelConfig, PlayerStats, GameState } from '../types';
import { Bird as BirdIcon, Eye, Info, CheckCircle2, AlertTriangle, XCircle, Undo2, TreeDeciduous, Heart, ShieldAlert, Sparkles, PartyPopper, CheckCircle } from 'lucide-react';

interface GameplayProps {
  level: LevelConfig;
  onComplete: (stats: Partial<PlayerStats>, newlyUnlockedBirds: string[]) => void;
  onBack: () => void;
}

const Gameplay: React.FC<GameplayProps> = ({ level, onComplete, onBack }) => {
  const [phase, setPhase] = useState<'INFO' | 'ACTION' | 'RESULT'>('INFO');
  const [birdsViewActive, setBirdsViewActive] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [solutionResult, setSolutionResult] = useState<{
    success: boolean;
    satisfactionChange: number;
    birdsSaved: number;
    message: string;
    fact: string;
    cost: number;
  } | null>(null);

  const getAffectedStatus = () => {
    switch (level.id) {
      case LevelId.GLASS_MAZE:
        return { label: '常见 (Common)', color: 'bg-sky-100 text-sky-600 border-sky-200' };
      case LevelId.LIGHT_TRAP:
        return { label: '易危 (Vulnerable)', color: 'bg-amber-100 text-amber-600 border-amber-200' };
      case LevelId.AERIAL_SNARE:
        return { label: '濒危 (Endangered)', color: 'bg-rose-100 text-rose-600 border-rose-200' };
      default:
        return { label: '未知', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const status = getAffectedStatus();

  const getSolutions = () => {
    switch (level.id) {
      case LevelId.GLASS_MAZE:
        return [
          { id: 'A', label: '设置稻草人和风铃', cost: 50, satisfaction: -5, birds: 10, total: 100, success: false, message: '失败。高空鸟类根本看不见这些小物件，且它们很快就会习惯这种固定威胁。', fact: '鸟类对静态物体的识别能力有限。' },
          { id: 'B', label: '将玻璃幕墙换成水泥墙', cost: 400, satisfaction: -50, birds: 95, total: 100, success: false, message: '失败。虽然解决了鸟撞，但市民满意度降至冰点，办公采光极差。', fact: '生态保护不应以牺牲人类宜居度为代价。' },
          { id: 'C', label: '贴上“5x10”防鸟撞贴纸', cost: 150, satisfaction: 10, birds: 92, total: 100, success: true, message: '大获成功！点阵打破了玻璃的反射，鸟儿识别出了障碍物，优雅地飞走了。', fact: '遵循“5x10”规则（间隙不大于手掌）能防止鸟类尝试钻过缝隙。' }
        ];
      case LevelId.LIGHT_TRAP:
        return [
          { id: 'A', label: '增加更多照明，照亮航道', cost: 100, satisfaction: 5, birds: 5, total: 120, success: false, message: '惨败。更多鸟类被强光吸引，导致了更大规模的群体撞击。', fact: '候鸟利用星光导航，强光会让它们像飞蛾扑火般迷失。' },
          { id: 'B', label: '拉响防空警报驱赶鸟类', cost: 20, satisfaction: -40, birds: 30, total: 120, success: false, message: '失败。严重的噪音污染让市民抗议，且受惊的鸟类乱飞引发了更多悲剧。', fact: '恐吓手段无法引导鸟类走上正确的迁徙航线。' },
          { id: 'C', label: '实施“熄灯计划”与路灯改造', cost: 120, satisfaction: 15, birds: 110, total: 120, success: true, message: '完美解决。关闭景观灯，改用暖黄光向下投射灯具，鸟群重新找到了星光。', fact: '纽约、上海等全球大都市都在迁徙季节推行熄灯计划。' }
        ];
      case LevelId.AERIAL_SNARE:
        return [
          { id: 'A', label: '派人用网兜在空中拦截', cost: 50, satisfaction: 0, birds: 2, total: 80, success: false, message: '滑稽的失败。人力根本无法应对成千上万的高空候鸟。', fact: '末端治理往往效率低下。' },
          { id: 'B', label: '彻底禁止人类进入湿地', cost: 0, satisfaction: -30, birds: 70, total: 80, success: false, message: '部分有效，但不可持续。缺乏监管的空域依然存在隐患，且剥夺了市民的绿色空间。', fact: '可持续的治理需要人与自然的良性互动。' },
          { id: 'C', label: '安装驱鸟彩球与禁飞区', cost: 80, satisfaction: 5, birds: 76, total: 80, success: true, message: '成功！彩球增加了电线的可见度，无人机禁飞区让低空变得安全。', fact: '仅仅让障碍物“被看见”，就能避免大部分空中悲剧。' }
        ];
      default: return [];
    }
  };

  const handleApplySolution = (sol: any) => {
    setSelectedSolution(sol.id);
    setSolutionResult({
      success: sol.success,
      satisfactionChange: sol.satisfaction,
      birdsSaved: sol.birds,
      message: sol.message,
      fact: sol.fact,
      cost: sol.cost
    });
    setPhase('RESULT');
  };

  const finishLevel = () => {
    if (solutionResult) {
      const birdIds = level.id === LevelId.GLASS_MAZE ? ['bird3'] : level.id === LevelId.LIGHT_TRAP ? ['bird2'] : ['bird1'];
      onComplete({
        budget: solutionResult.cost,
        satisfaction: solutionResult.satisfactionChange,
        birdsSaved: solutionResult.birdsSaved,
        totalBirds: getSolutions()[0].total
      }, solutionResult.success ? birdIds : []);
    }
  };

  const renderVisuals = () => {
    const isNight = level.id === LevelId.LIGHT_TRAP;
    const isNature = level.id === LevelId.AERIAL_SNARE;
    const isGlass = level.id === LevelId.GLASS_MAZE;
    const isSuccess = solutionResult?.success;
    const isDizzy = birdsViewActive && isNight && !isSuccess;
    const isSnared = birdsViewActive && isNature && !isSuccess;

    return (
      <div className={`relative w-full h-[250px] sm:h-[350px] md:h-[500px] rounded-3xl overflow-hidden shadow-inner flex items-center justify-center ${isNight ? 'bg-slate-900' : isNature ? 'bg-emerald-100' : 'bg-blue-50'} transition-all duration-700 ${birdsViewActive ? (isSuccess ? 'brightness-110 saturate-150' : 'grayscale brightness-150 blur-[2px]') : ''} ${isDizzy ? 'animate-dizzy-sway' : ''}`}>
        {isDizzy && <div className="absolute inset-0 bg-white/40 animate-blinded-pulse mix-blend-overlay z-10 pointer-events-none" />}
        {isSnared && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden animate-grid-shake">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] bg-[size:25px_25px] sm:bg-[size:30px_30px] opacity-30 animate-grid-closing"></div>
          </div>
        )}

        <div className={`relative transform rotate-x-[30deg] rotate-z-[45deg] scale-[1.2] sm:scale-[1.5] transition-transform duration-500 ${isDizzy ? 'blur-[4px]' : ''} ${isSnared ? 'scale-[1.3] sm:scale-[1.7]' : ''}`}>
          {isGlass && (
             <div className="flex gap-2 sm:gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-12 h-32 sm:w-16 sm:h-40 border border-white/50 relative ${birdsViewActive ? (isSuccess ? 'bg-emerald-400/20' : 'bg-sky-200 animate-pulse') : 'bg-sky-400/30 backdrop-blur-sm'}`}>
                    {((!birdsViewActive && selectedSolution === 'C') || (birdsViewActive && isSuccess)) && (
                      <div className={`absolute inset-0 grid grid-cols-4 gap-1 p-2 ${birdsViewActive ? 'opacity-100 scale-110' : 'opacity-60'}`}>
                        {Array.from({length: 12}).map((_, j) => <div key={j} className={`w-1 h-1 rounded-full ${birdsViewActive ? 'bg-emerald-600' : 'bg-white'}`}></div>)}
                      </div>
                    )}
                  </div>
                ))}
             </div>
          )}
          {isNight && (
            <div className="relative">
               <div className="w-32 h-32 sm:w-40 sm:h-40 bg-slate-800 border-2 border-slate-700"></div>
               {(!selectedSolution || selectedSolution !== 'C') && <div className="absolute -top-10 left-8 sm:left-10 w-2 h-32 sm:h-40 bg-yellow-400/40 blur-xl animate-pulse"></div>}
               {selectedSolution === 'C' && <div className="absolute -top-10 left-8 sm:left-10 w-2 h-32 sm:h-40 bg-orange-400/10 blur-md"></div>}
            </div>
          )}
          {isNature && (
            <div className="flex flex-col gap-6 sm:gap-8">
               <div className="h-0.5 w-48 sm:w-60 bg-slate-400 relative">
                 {selectedSolution === 'C' && <div className="absolute top-0 left-8 sm:left-10 w-4 h-4 -mt-2 bg-orange-500 rounded-full shadow-lg border-2 border-white"></div>}
               </div>
               <div className="flex gap-4"><TreeDeciduous className="text-emerald-600" /><TreeDeciduous className="text-emerald-700" /></div>
            </div>
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className={`absolute ${isGlass && selectedSolution === 'C' ? 'animate-dodge-fly' : isGlass && selectedSolution ? 'animate-hit-fly' : 'animate-infinite-fly'}`} style={{
              top: `${15 + i * 10}%`, left: '-50px', animationDelay: `${i * 0.8}s`,
              animationDuration: isGlass && selectedSolution === 'C' ? '4s' : isGlass && selectedSolution ? '2.5s' : '6s'
            }}>
              <div className="relative">
                <BirdIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${isNight ? 'text-white' : 'text-slate-600'}`} />
                {isGlass && selectedSolution && selectedSolution !== 'C' && <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-0 animate-impact-glow-pulse" />}
              </div>
            </div>
          ))}
        </div>

        {birdsViewActive && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4">
            <div className={`bg-${isSuccess ? 'emerald' : 'red'}-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce text-sm sm:text-base shadow-xl`}>
              {isSuccess ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              {isSuccess ? '通过路径已识别' : '环境感知受阻！'}
            </div>
          </div>
        )}

        <button 
          onMouseDown={() => setBirdsViewActive(true)}
          onMouseUp={() => setBirdsViewActive(false)}
          onMouseLeave={() => setBirdsViewActive(false)}
          onTouchStart={(e) => { e.preventDefault(); setBirdsViewActive(true); }}
          onTouchEnd={() => setBirdsViewActive(false)}
          className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/90 p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-2 md:gap-3 hover:bg-white transition-all group z-30 active:scale-90"
        >
          <div className={`p-1.5 md:p-2 rounded-xl transition-colors ${birdsViewActive ? 'bg-emerald-100' : 'bg-sky-100'}`}>
             <Eye className={`w-5 h-5 md:w-6 md:h-6 ${birdsViewActive ? 'text-emerald-600' : 'text-sky-600'}`} />
          </div>
          <div className="text-left hidden sm:block">
            <div className="font-bold text-slate-800 text-xs md:text-sm">鸟类视角</div>
            <div className="text-[10px] text-slate-500">按住体验感知</div>
          </div>
          <div className="text-xs font-bold sm:hidden">长按视角</div>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-8 bg-emerald-50/30 overflow-y-auto pt-20 md:pt-8">
      <div className="max-w-5xl w-full bg-white rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full lg:max-h-[850px]">
        
        <div className="flex-[3] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 overflow-y-auto lg:overflow-visible">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{level.title}</h2>
              <p className="text-emerald-600 font-medium text-sm sm:text-base">{level.subtitle}</p>
            </div>
          </div>

          {renderVisuals()}

          <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-100">
             <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0">
                  <Info className="text-sky-500 w-5 h-5" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 mb-1 text-sm sm:text-base">规划师简报</h4>
                   <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                     {phase === 'INFO' ? level.description : solutionResult?.message}
                   </p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex-[2] bg-slate-50/50 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-slate-100 overflow-y-auto">
          {phase === 'INFO' && (
            <div className="flex flex-col h-full">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6">任务概况</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5 sm:mb-1">预算</div>
                   <div className="text-lg sm:text-2xl font-bold text-emerald-600">${level.budget}</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5 sm:mb-1">最高满意度</div>
                   <div className="text-lg sm:text-2xl font-bold text-sky-600">+{level.maxSatisfaction}%</div>
                </div>
              </div>
              <button onClick={() => setPhase('ACTION')} className="mt-auto w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 sm:py-4 rounded-2xl shadow-lg transition-all active:scale-95">开始改造</button>
            </div>
          )}

          {phase === 'ACTION' && (
            <div className="flex flex-col h-full">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6">方案选择</h3>
              <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl border-2 flex items-center gap-2 sm:gap-3 ${status.color}`}>
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <div className="text-[10px] sm:text-xs leading-tight">
                  <span className="block font-bold opacity-80 uppercase tracking-tighter mb-0.5">此区域保护目标</span>
                  <span className="block font-black">{status.label}</span>
                </div>
              </div>
              <div className="space-y-3 sm:gap-4">
                {getSolutions().map(sol => (
                  <button key={sol.id} onClick={() => handleApplySolution(sol)} className="w-full bg-white hover:bg-emerald-50 p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-sm group active:scale-[0.98]">
                    <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-700 group-hover:text-emerald-700">方案 {sol.id}</span>
                      <span className="text-emerald-600 font-bold font-mono text-xs sm:text-sm">${sol.cost}</span>
                    </div>
                    <div className="text-slate-800 font-medium mb-2 sm:mb-3 leading-snug text-xs sm:text-sm">{sol.label}</div>
                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      <span className="flex items-center gap-1"><Heart className="w-2.5 h-2.5" /> {sol.satisfaction > 0 ? '+' : ''}{sol.satisfaction}</span>
                      <span className="flex items-center gap-1"><BirdIcon className="w-2.5 h-2.5" /> {sol.birds} 救助</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'RESULT' && solutionResult && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4">
              <div className="mt-4 sm:mt-8 mb-6 sm:mb-8 text-center">
                 {solutionResult.success ? <CheckCircle2 className="w-16 h-16 sm:w-24 sm:h-24 text-emerald-500 mx-auto mb-3 sm:mb-4 animate-success-pop" /> : <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-rose-500 mx-auto mb-3 sm:mb-4" />}
                 <h3 className={`text-2xl sm:text-3xl font-black ${solutionResult.success ? 'text-emerald-600' : 'text-slate-800'}`}>{solutionResult.success ? '治理成功!' : '治理未达标'}</h3>
              </div>
              <div className={`p-4 sm:p-6 rounded-3xl border bg-white mb-6 shadow-sm ${solutionResult.success ? 'border-emerald-100 ring-2 ring-emerald-50' : 'border-slate-100'}`}>
                <div className="flex justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-50 text-center">
                   <div><div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-widest">救助</div><div className={`text-xl sm:text-2xl font-black ${solutionResult.success ? 'text-sky-600' : 'text-slate-400'}`}>{solutionResult.birdsSaved}</div></div>
                   <div><div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-widest">满足感</div><div className={`text-xl sm:text-2xl font-black ${solutionResult.satisfactionChange > 0 ? 'text-rose-500' : 'text-slate-400'}`}>{solutionResult.satisfactionChange > 0 ? '+' : ''}{solutionResult.satisfactionChange}%</div></div>
                   <div><div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-widest">支出</div><div className="text-xl sm:text-2xl font-black text-slate-800">${solutionResult.cost}</div></div>
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium italic text-center px-2 leading-relaxed">“{solutionResult.fact}”</div>
              </div>
              <button onClick={finishLevel} className={`mt-auto w-full font-bold py-4 sm:py-5 rounded-2xl shadow-xl transition-all active:scale-95 ${solutionResult.success ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}>
                {solutionResult.success ? '前往下一区域' : '返回规划'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes infinite-fly { 0% { transform: translate(-50px, 0) rotate(5deg); opacity: 0; } 10% { opacity: 1; } 50% { transform: translate(500px, -20px) rotate(-5deg); } 90% { opacity: 1; } 100% { transform: translate(1200px, 10px) rotate(5deg); opacity: 0; } }
        @keyframes hit-fly { 0% { transform: translate(-50px, 0) rotate(5deg); opacity: 0; } 10% { opacity: 1; } 38% { transform: translate(245px, -8px) rotate(-2deg); } 40% { transform: translate(250px, -10px) rotate(0deg) scale(1.1); filter: drop-shadow(0 0 10px #ff0000); } 42% { transform: translate(252px, -8px) scale(1.3) rotate(15deg); } 50% { transform: translate(240px, 60px) rotate(90deg); opacity: 0.8; } 100% { transform: translate(230px, 600px) rotate(180deg); opacity: 0; } }
        @keyframes dodge-fly { 0% { transform: translate(-50px, 0) rotate(5deg); opacity: 0; } 10% { opacity: 1; } 40% { transform: translate(200px, -5px) rotate(-5deg); } 50% { transform: translate(250px, -60px) rotate(-30deg) scale(0.9); } 70% { transform: translate(400px, -20px) rotate(10deg); } 100% { transform: translate(1000px, 10px) rotate(5deg); opacity: 0; } }
        .animate-infinite-fly { animation: infinite-fly linear infinite; }
        .animate-hit-fly { animation: hit-fly ease-in infinite; }
        .animate-dodge-fly { animation: dodge-fly ease-out infinite; }
        @keyframes dizzy-sway { 0% { transform: rotate(0deg) translate(0, 0); } 25% { transform: rotate(1.5deg) translate(8px, -8px); } 50% { transform: rotate(-1.5deg) translate(-8px, 8px); } 75% { transform: rotate(1deg) translate(5px, 5px); } 100% { transform: rotate(0deg) translate(0, 0); } }
        .animate-dizzy-sway { animation: dizzy-sway 3s ease-in-out infinite; }
        @keyframes blinded-pulse { 0% { opacity: 0.15; } 50% { opacity: 0.55; } 100% { opacity: 0.15; } }
        .animate-blinded-pulse { animation: blinded-pulse 2.5s ease-in-out infinite; }
        @keyframes grid-closing { 0% { transform: scale(1.2); opacity: 0.1; } 50% { transform: scale(0.9); opacity: 0.4; } 100% { transform: scale(1.1); opacity: 0.1; } }
        @keyframes grid-shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-2px, 2px); } 50% { transform: translate(2px, -2px); } }
        .animate-grid-closing { animation: grid-closing 4s ease-in-out infinite; }
        .animate-grid-shake { animation: grid-shake 0.2s linear infinite; }
        .animate-success-pop { animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Gameplay;
