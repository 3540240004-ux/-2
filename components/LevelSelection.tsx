
import React from 'react';
import { LevelId } from '../types';
import { LEVELS } from '../constants';
import { Building2, Moon, TreeDeciduous, ChevronRight } from 'lucide-react';

interface LevelSelectionProps {
  onSelect: (id: LevelId) => void;
  onFinish: () => void;
}

const LevelSelection: React.FC<LevelSelectionProps> = ({ onSelect, onFinish }) => {
  const getIcon = (id: LevelId) => {
    switch (id) {
      case LevelId.GLASS_MAZE: return <Building2 className="w-12 h-12 text-blue-500" />;
      case LevelId.LIGHT_TRAP: return <Moon className="w-12 h-12 text-amber-500" />;
      case LevelId.AERIAL_SNARE: return <TreeDeciduous className="w-12 h-12 text-emerald-500" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-emerald-50/50">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">迁徙行动区域</h2>
        <p className="text-slate-500">选择一个高风险区域进行生态改造</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {Object.values(LEVELS).map((level) => (
          <div 
            key={level.id}
            onClick={() => onSelect(level.id)}
            className="group cursor-pointer bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white hover:border-emerald-200 transition-all hover:-translate-y-2 flex flex-col items-center text-center"
          >
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 group-hover:bg-emerald-50 transition-colors">
              {getIcon(level.id)}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{level.title}</h3>
            <p className="text-emerald-600 font-medium mb-4">{level.subtitle}</p>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {level.description}
            </p>
            <div className="mt-auto w-full flex items-center justify-between pt-6 border-t border-slate-100">
              <span className="text-slate-400 text-sm">预算: ${level.budget}</span>
              <div className="flex items-center gap-1 text-emerald-500 font-bold">
                进入 <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onFinish}
        className="mt-16 text-slate-500 hover:text-emerald-600 font-medium flex items-center gap-2 underline underline-offset-4"
      >
        完成所有任务，查看本季报告
      </button>
    </div>
  );
};

export default LevelSelection;
