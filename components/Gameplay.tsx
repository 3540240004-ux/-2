
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LevelId, LevelConfig, PlayerStats, GameState } from '../types';
// Added ShieldAlert, Sparkles, and CircleDollarSign for enhanced visual feedback
import { Bird as BirdIcon, Eye, Info, CheckCircle2, AlertTriangle, XCircle, Undo2, TreeDeciduous, Heart, ShieldAlert, Sparkles, CircleDollarSign, PartyPopper, CheckCircle } from 'lucide-react';

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

  // Helper to get status info for the current level
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
          { 
            id: 'A', 
            label: '设置稻草人和风铃', 
            cost: 50, 
            satisfaction: -5,
            birds: 10,
            total: 100,
            success: false, 
            message: '失败。高空鸟类根本看不见这些小物件，且它们很快就会习惯这种固定威胁。',
            fact: '鸟类对静态物体的识别能力有限。' 
          },
          { 
            id: 'B', 
            label: '将玻璃幕墙换成水泥墙', 
            cost: 400, 
            satisfaction: -50,
            birds: 95,
            total: 100,
            success: false, 
            message: '失败。虽然解决了鸟撞，但市民满意度降至冰点，办公采光极差。',
            fact: '生态保护不应以牺牲人类宜居度为代价。' 
          },
          { 
            id: 'C', 
            label: '贴上“5x10”防鸟撞贴纸', 
            cost: 150, 
            satisfaction: 10,
            birds: 92,
            total: 100,
            success: true, 
            message: '大获成功！点阵打破了玻璃的反射，鸟儿识别出了障碍物，优雅地飞走了。',
            fact: '遵循“5x10”规则（间隙不大于手掌）能防止鸟类尝试钻过缝隙。' 
          }
        ];
      case LevelId.LIGHT_TRAP:
        return [
          { 
            id: 'A', 
            label: '增加更多照明，照亮航道', 
            cost: 100, 
            satisfaction: 5,
            birds: 5,
            total: 120,
            success: false, 
            message: '惨败。更多鸟类被强光吸引，导致了更大规模的群体撞击。',
            fact: '候鸟利用星光导航，强光会让它们像飞蛾扑火般迷失。' 
          },
          { 
            id: 'B', 
            label: '拉响防空警报驱赶鸟类', 
            cost: 20, 
            satisfaction: -40,
            birds: 30,
            total: 120,
            success: false, 
            message: '失败。严重的噪音污染让市民抗议，且受惊的鸟类乱飞引发了更多悲剧。',
            fact: '恐吓手段无法引导鸟类走上正确的迁徙航线。' 
          },
          { 
            id: 'C', 
            label: '实施“熄灯计划”与路灯改造', 
            cost: 120, 
            satisfaction: 15,
            birds: 110,
            total: 120,
            success: true, 
            message: '完美解决。关闭景观灯，改用暖黄光向下投射灯具，鸟群重新找到了星光。',
            fact: '纽约、上海等全球大都市都在迁徙季节推行熄灯计划。' 
          }
        ];
      case LevelId.AERIAL_SNARE:
        return [
          { 
            id: 'A', 
            label: '派人用网兜在空中拦截', 
            cost: 50, 
            satisfaction: 0,
            birds: 2,
            total: 80,
            success: false, 
            message: '滑稽的失败。人力根本无法应对成千上万的高空候鸟。',
            fact: '末端治理往往效率低下。' 
          },
          { 
            id: 'B', 
            label: '彻底禁止人类进入湿地', 
            cost: 0, 
            satisfaction: -30,
            birds: 70,
            total: 80,
            success: false, 
            message: '部分有效，但不可持续。缺乏监管的空域依然存在隐患，且剥夺了市民的绿色空间。',
            fact: '可持续的治理需要人与自然的良性互动。' 
          },
          { 
            id: 'C', 
            label: '安装驱鸟彩球与禁飞区', 
            cost: 80, 
            satisfaction: 5,
            birds: 76,
            total: 80,
            success: true, 
            message: '成功！彩球增加了电线的可见度，无人机禁飞区让低空变得安全。',
            fact: '仅仅让障碍物“被看见”，就能避免大部分空中悲剧。' 
          }
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

    return (
      <div className={`relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-inner flex items-center justify-center ${isNight ? 'bg-slate-900' : isNature ? 'bg-emerald-100' : 'bg-blue-50'} transition-all duration-700 ${birdsViewActive ? (isSuccess ? 'brightness-110 saturate-150' : 'grayscale brightness-150 blur-[2px]') : ''} ${isDizzy ? 'animate-dizzy-sway' : ''}`}>
        
        {/* Blinding effect overlay for Light Trap dizziness */}
        {isDizzy && (
          <div className="absolute inset-0 bg-white/40 animate-blinded-pulse mix-blend-overlay z-10 pointer-events-none" />
        )}

        {/* Isometric representation */}
        <div className={`relative transform rotate-x-[30deg] rotate-z-[45deg] scale-[1.5] transition-transform duration-500 ${isDizzy ? 'blur-[4px]' : ''}`}>
          {isGlass && (
             <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-16 h-40 border border-white/50 relative ${birdsViewActive ? (isSuccess ? 'bg-emerald-400/20' : 'bg-sky-200 animate-pulse') : 'bg-sky-400/30 backdrop-blur-sm'}`}>
                    {/* Stickers/Grid - visible in normal view and specifically highlighted in successful bird view */}
                    {((!birdsViewActive && selectedSolution === 'C') || (birdsViewActive && isSuccess)) && (
                      <div className={`absolute inset-0 grid grid-cols-4 gap-1 p-2 ${birdsViewActive ? 'opacity-100 scale-110 transition-transform duration-500' : 'opacity-60'}`}>
                        {Array.from({length: 12}).map((_, j) => <div key={j} className={`w-1 h-1 rounded-full ${birdsViewActive ? 'bg-emerald-600 shadow-sm' : 'bg-white'}`}></div>)}
                      </div>
                    )}
                  </div>
                ))}
             </div>
          )}
          {level.id === LevelId.LIGHT_TRAP && (
            <div className="relative">
               <div className="w-40 h-40 bg-slate-800 border-2 border-slate-700"></div>
               {(!selectedSolution || selectedSolution !== 'C') && (
                 <div className="absolute -top-10 left-10 w-2 h-40 bg-yellow-400/40 blur-xl animate-pulse"></div>
               )}
               {selectedSolution === 'C' && (
                 <div className="absolute -top-10 left-10 w-2 h-40 bg-orange-400/10 blur-md"></div>
               )}
            </div>
          )}
          {level.id === LevelId.AERIAL_SNARE && (
            <div className="flex flex-col gap-8">
               <div className="h-0.5 w-60 bg-slate-400 relative">
                 {selectedSolution === 'C' && (
                   <div className="absolute top-0 left-10 w-4 h-4 -mt-2 bg-orange-500 rounded-full shadow-lg border-2 border-white"></div>
                 )}
               </div>
               <div className="flex gap-4">
                 <TreeDeciduous className="text-emerald-600" />
                 <TreeDeciduous className="text-emerald-700" />
               </div>
            </div>
          )}
        </div>

        {/* Birds animation overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({length: 8}).map((_, i) => {
            let animationClass = 'animate-infinite-fly';
            let birdIcon = <BirdIcon className={`w-8 h-8 ${isNight ? 'text-white' : 'text-slate-600'}`} />;
            
            if (isGlass) {
              if (selectedSolution === 'C') {
                animationClass = 'animate-dodge-fly';
              } else if (selectedSolution) {
                // If wrong solution selected, show collision
                animationClass = 'animate-hit-fly';
              }
            }

            return (
              <div key={i} className={`absolute ${animationClass}`} style={{
                top: `${15 + i * 10}%`,
                left: isGlass && selectedSolution ? '0%' : '-50px',
                animationDelay: `${i * 0.8}s`,
                animationDuration: isGlass && selectedSolution === 'C' ? '4s' : isGlass && selectedSolution ? '2.5s' : '6s'
              }}>
                <div className="relative">
                  {birdIcon}
                  {/* Red glow pulse on impact for failure state */}
                  {isGlass && selectedSolution && selectedSolution !== 'C' && (
                    <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-0 animate-impact-glow-pulse" />
                  )}
                </div>
                {isGlass && selectedSolution && selectedSolution !== 'C' && (
                   <div className="absolute -top-4 -right-4 text-rose-500 font-black animate-ping opacity-0 group-hit-active">BOOM!</div>
                )}
                {isGlass && selectedSolution === 'C' && (
                   <div className="absolute -top-6 -right-6 text-emerald-500 animate-bounce">
                     <Sparkles className="w-4 h-4" />
                   </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Warning/Success messages overlay */}
        {birdsViewActive && (
          <div className={`absolute inset-0 flex items-center justify-center ${isSuccess ? 'bg-emerald-500/10' : 'bg-red-500/10'} z-20 pointer-events-none transition-colors duration-500`}>
            {isSuccess ? (
              <div className="bg-emerald-600 text-white px-8 py-3 rounded-full font-black flex items-center gap-3 animate-in slide-in-from-bottom-4 shadow-xl shadow-emerald-900/20">
                <CheckCircle className="w-6 h-6" /> 
                {level.id === LevelId.GLASS_MAZE ? '障碍物已识别！前方安全飞越' : level.id === LevelId.LIGHT_TRAP ? '星光航道已开启，重新导航中' : '识别空中标示，提升飞行高度'}
              </div>
            ) : (
              <div className="bg-red-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 animate-bounce">
                <AlertTriangle /> {level.id === LevelId.GLASS_MAZE ? '检测到前方有森林！(其实是玻璃反射)' : level.id === LevelId.LIGHT_TRAP ? '迷失在眩光中，无法导航...' : '前方空域不详'}
              </div>
            )}
          </div>
        )}

        <button 
          onMouseDown={() => setBirdsViewActive(true)}
          onMouseUp={() => setBirdsViewActive(false)}
          onMouseLeave={() => setBirdsViewActive(false)}
          className="absolute bottom-6 left-6 bg-white/90 p-4 rounded-2xl shadow-xl flex items-center gap-3 hover:bg-white transition-all group z-30"
        >
          <div className={`p-2 rounded-xl transition-colors ${birdsViewActive ? 'bg-emerald-100 scale-110' : 'bg-sky-100'}`}>
             <Eye className={birdsViewActive ? 'text-emerald-600' : 'text-sky-600'} />
          </div>
          <div className="text-left">
            <div className="font-bold text-slate-800">鸟类视角</div>
            <div className="text-xs text-slate-500">按住体验{isSuccess ? '成功通过' : '感官障碍'}</div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-8 bg-emerald-50/30">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl shadow-slate-300/50 overflow-hidden flex flex-col md:flex-row h-full max-h-[850px]">
        
        {/* Left: Viewport */}
        <div className="flex-[3] p-6 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{level.title}</h2>
              <p className="text-emerald-600 font-medium">{level.subtitle}</p>
            </div>
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Undo2 className="text-slate-400" />
            </button>
          </div>

          {renderVisuals()}

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
             <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <Info className="text-sky-500" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 mb-1">规划师简报</h4>
                   <p className="text-sm text-slate-600 leading-relaxed">
                     {phase === 'INFO' ? level.description : solutionResult?.message}
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex-[2] bg-slate-50/50 p-6 border-l border-slate-100 overflow-y-auto relative">
          {phase === 'INFO' && (
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-bold text-slate-800 mb-6 mt-4">任务概况</h3>
              <div className="space-y-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">可用预算</div>
                   <div className="text-2xl font-bold text-emerald-600">${level.budget}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">预估满足感影响</div>
                   <div className="text-2xl font-bold text-sky-600">最高 +{level.maxSatisfaction}%</div>
                </div>
              </div>

              <div className="mt-auto">
                 <button 
                  onClick={() => setPhase('ACTION')}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-lg transition-all"
                >
                  开始改造
                </button>
              </div>
            </div>
          )}

          {phase === 'ACTION' && (
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-bold text-slate-800 mb-6 mt-4">方案选择</h3>
              
              {/* Added Level Status Banner */}
              <div className={`mb-6 p-4 rounded-2xl border-2 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.color}`}>
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div className="text-xs leading-tight">
                  <span className="block font-bold opacity-80 uppercase tracking-tighter mb-0.5">此区域保护目标</span>
                  <span className="block text-sm font-black">{status.label} 鸟类</span>
                </div>
              </div>

              <div className="space-y-4">
                {getSolutions().map(sol => {
                  const isHighCost = sol.cost > level.budget * 0.5;
                  return (
                    <button
                      key={sol.id}
                      onClick={() => handleApplySolution(sol)}
                      className="w-full bg-white hover:bg-emerald-50 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all shadow-sm group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-700 group-hover:text-emerald-700">方案 {sol.id}</span>
                        <div className="flex items-center gap-2">
                          {isHighCost && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-black animate-pulse bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <AlertTriangle className="w-2.5 h-2.5" /> 高成本
                            </span>
                          )}
                          <span className="text-emerald-600 font-bold font-mono">${sol.cost}</span>
                        </div>
                      </div>
                      <div className="text-slate-800 font-medium mb-3 leading-snug">{sol.label}</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <Heart className="w-3 h-3" /> {sol.satisfaction > 0 ? '+' : ''}{sol.satisfaction} 满足感
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <BirdIcon className="w-3 h-3" /> {sol.birds} 预计救助
                        </div>
                        <div className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase border tracking-tighter ${status.color}`}>
                          {status.label.split(' ')[0]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-6 italic">
                * 仔细观察“鸟类视角”来做出最合理的决定。
              </p>
            </div>
          )}

          {phase === 'RESULT' && solutionResult && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 relative">
              {/* Success Flourish Background */}
              {solutionResult.success && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-40">
                   <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-300 blur-[80px] rounded-full animate-pulse"></div>
                   <div className="absolute top-10 left-10 animate-celebrate-sparkle opacity-0" style={{ animationDelay: '0.2s' }}>
                      <Sparkles className="text-amber-400 w-6 h-6" />
                   </div>
                   <div className="absolute top-20 right-10 animate-celebrate-sparkle opacity-0" style={{ animationDelay: '0.5s' }}>
                      <Sparkles className="text-amber-500 w-8 h-8" />
                   </div>
                   <div className="absolute bottom-40 left-20 animate-celebrate-sparkle opacity-0" style={{ animationDelay: '0.8s' }}>
                      <Sparkles className="text-emerald-400 w-5 h-5" />
                   </div>
                   <div className="absolute top-1/2 right-1/4 animate-celebrate-sparkle opacity-0" style={{ animationDelay: '0.1s' }}>
                      <PartyPopper className="text-emerald-500 w-10 h-10 opacity-20" />
                   </div>
                </div>
              )}

              <div className="mt-8 mb-8 text-center relative z-10">
                 {solutionResult.success ? (
                   <div className="relative inline-block">
                     <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-4 animate-success-pop" />
                     <div className="absolute -top-2 -right-2 bg-amber-100 p-2 rounded-full border-2 border-amber-300 animate-bounce">
                        <Sparkles className="w-6 h-6 text-amber-500" />
                     </div>
                   </div>
                 ) : (
                   <XCircle className="w-20 h-20 text-rose-500 mx-auto mb-4" />
                 )}
                 <h3 className={`text-3xl font-black ${solutionResult.success ? 'text-emerald-600' : 'text-slate-800'}`}>
                   {solutionResult.success ? '治理大获成功!' : '治理未达预期'}
                 </h3>
                 {solutionResult.success && (
                   <div className="text-xs font-bold text-emerald-500 mt-1 flex items-center justify-center gap-1 uppercase tracking-widest">
                     <Sparkles className="w-3 h-3" /> Excellent Work <Sparkles className="w-3 h-3" />
                   </div>
                 )}
              </div>

              <div className={`p-6 rounded-3xl border shadow-sm mb-6 relative z-10 transition-all ${solutionResult.success ? 'bg-white border-emerald-100 ring-2 ring-emerald-50 ring-offset-2' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between mb-4 pb-4 border-b border-slate-50">
                   <div className="text-center">
                     <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-tighter">救助鸟类</div>
                     <div className={`text-2xl font-black ${solutionResult.success ? 'text-sky-600' : 'text-slate-500'}`}>{solutionResult.birdsSaved}</div>
                   </div>
                   <div className="text-center">
                     <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-tighter">满足感</div>
                     <div className={`text-2xl font-black ${solutionResult.satisfactionChange > 0 ? 'text-rose-500' : 'text-slate-500'}`}>{solutionResult.satisfactionChange > 0 ? '+' : ''}{solutionResult.satisfactionChange}%</div>
                   </div>
                   <div className="text-center">
                     <div className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-tighter">花费</div>
                     <div className="text-2xl font-black text-slate-800">${solutionResult.cost}</div>
                   </div>
                </div>
                <div className="text-sm text-slate-600 font-medium italic leading-relaxed text-center px-2">
                  “{solutionResult.fact}”
                </div>
              </div>

              <div className="mt-auto relative z-10">
                <button 
                  onClick={finishLevel}
                  className={`w-full font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95 ${solutionResult.success ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
                >
                  {solutionResult.success ? '进入下一个规划区' : '我知道了'}
                </button>
                <button 
                  onClick={() => setPhase('ACTION')}
                  className="w-full mt-3 text-slate-400 py-2 text-sm hover:text-slate-600 font-bold"
                >
                  重新规划方案
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes infinite-fly {
          0% { transform: translate(-50px, 0) rotate(5deg); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(500px, -20px) rotate(-5deg); }
          90% { opacity: 1; }
          100% { transform: translate(1200px, 10px) rotate(5deg); opacity: 0; }
        }
        @keyframes hit-fly {
          0% { transform: translate(-50px, 0) rotate(5deg); opacity: 0; }
          10% { opacity: 1; }
          /* Impact point at 40% */
          38% { transform: translate(245px, -8px) rotate(-2deg); filter: none; }
          40% { transform: translate(250px, -10px) rotate(0deg) scale(1.1); filter: drop-shadow(0 0 10px #ff0000); }
          42% { transform: translate(252px, -8px) scale(1.3) rotate(15deg); filter: drop-shadow(0 0 25px #ff0000) brightness(1.5); }
          50% { transform: translate(240px, 60px) rotate(90deg); opacity: 0.8; }
          100% { transform: translate(230px, 600px) rotate(180deg); opacity: 0; }
        }
        @keyframes impact-glow-pulse {
          0%, 39% { opacity: 0; transform: scale(0); }
          40% { opacity: 1; transform: scale(1.5); background-color: rgba(255, 0, 0, 0.6); }
          45% { opacity: 1; transform: scale(3); background-color: rgba(255, 0, 0, 0.4); }
          60% { opacity: 0; transform: scale(4); }
          100% { opacity: 0; }
        }
        .animate-impact-glow-pulse {
          animation: impact-glow-pulse 2.5s ease-out infinite;
        }
        @keyframes dodge-fly {
          0% { transform: translate(-50px, 0) rotate(5deg); opacity: 0; }
          10% { opacity: 1; }
          40% { transform: translate(200px, -5px) rotate(-5deg); }
          50% { transform: translate(250px, -60px) rotate(-30deg) scale(0.9); }
          70% { transform: translate(400px, -20px) rotate(10deg); }
          100% { transform: translate(1000px, 10px) rotate(5deg); opacity: 0; }
        }
        .animate-infinite-fly {
          animation: infinite-fly linear infinite;
        }
        .animate-hit-fly {
          animation: hit-fly ease-in infinite;
        }
        .animate-dodge-fly {
          animation: dodge-fly ease-out infinite;
        }
        .group-hit-active {
          animation: boom-text 2s infinite;
        }
        @keyframes boom-text {
          0%, 39% { opacity: 0; transform: scale(0.5); }
          40% { opacity: 1; transform: scale(2); color: #ff0000; text-shadow: 0 0 10px rgba(255,0,0,0.5); }
          60% { opacity: 0; transform: scale(3); }
          100% { opacity: 0; }
        }

        @keyframes success-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-success-pop {
          animation: success-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes celebrate-sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        .animate-celebrate-sparkle {
          animation: celebrate-sparkle 1.5s ease-in-out infinite;
        }

        /* Dizzying sway animation for light pollution disorientation */
        @keyframes dizzy-sway {
          0% { transform: rotate(0deg) translate(0, 0); filter: hue-rotate(0deg); }
          25% { transform: rotate(1.5deg) translate(8px, -8px); filter: hue-rotate(15deg); }
          50% { transform: rotate(-1.5deg) translate(-8px, 8px); filter: hue-rotate(-15deg); }
          75% { transform: rotate(1deg) translate(5px, 5px); filter: hue-rotate(10deg); }
          100% { transform: rotate(0deg) translate(0, 0); filter: hue-rotate(0deg); }
        }
        .animate-dizzy-sway {
          animation: dizzy-sway 3s ease-in-out infinite;
        }

        /* Blinding pulse animation for white-out effect */
        @keyframes blinded-pulse {
          0% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.05); }
          100% { opacity: 0.15; transform: scale(1); }
        }
        .animate-blinded-pulse {
          animation: blinded-pulse 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Gameplay;
