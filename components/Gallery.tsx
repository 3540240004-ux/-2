
import React, { useState } from 'react';
import { Bird } from '../types';
import { ChevronLeft, Lock } from 'lucide-react';

interface GalleryProps {
  birds: Bird[];
  onBack: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ birds, onBack }) => {
  const [selectedBird, setSelectedBird] = useState<Bird | null>(null);

  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-8 bg-slate-50 overflow-y-auto pt-24 md:pt-8">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <button 
            onClick={onBack}
            className="p-2 sm:p-3 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200 active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-800">城市候鸟图鉴</h2>
            <p className="text-xs sm:text-base text-slate-500">已救助并观测到的鸟类成员</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-12">
          {birds.map(bird => (
            <div 
              key={bird.id}
              onClick={() => bird.unlocked && setSelectedBird(bird)}
              className={`relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-lg transition-all active:scale-95 ${bird.unlocked ? 'bg-white cursor-pointer md:hover:-translate-y-2' : 'bg-slate-200 grayscale'}`}
            >
              <div className="aspect-[4/3] bg-slate-100 relative">
                {bird.unlocked ? (
                  <img src={bird.image} alt={bird.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400" />
                  </div>
                )}
                {bird.unlocked && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-emerald-500 text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest">
                    已收录
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-0.5 sm:mb-1">
                  {bird.unlocked ? bird.name : '未知生物'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-serif italic mb-3 sm:mb-4">
                  {bird.unlocked ? bird.scientificName : '????'}
                </p>
                <div className={`text-[10px] sm:text-xs px-2 py-1 rounded inline-block font-bold mb-3 sm:mb-4 ${
                  bird.status === 'endangered' ? 'bg-rose-100 text-rose-600' : 
                  bird.status === 'vulnerable' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'
                }`}>
                  {bird.status === 'endangered' ? '濒危' : bird.status === 'vulnerable' ? '易危' : '常见'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBird && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedBird(null)}>
           <div className="bg-white rounded-[30px] sm:rounded-[40px] max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <img src={selectedBird.image} className="w-full h-48 sm:h-72 object-cover" />
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh]">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{selectedBird.name}</h2>
                    <p className="text-xs sm:text-base text-slate-400 italic">{selectedBird.scientificName}</p>
                  </div>
                  <button onClick={() => setSelectedBird(null)} className="p-2 text-slate-400 hover:text-slate-600 font-bold">关闭</button>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                  {selectedBird.description}
                </p>
                <div className="bg-emerald-50 p-4 sm:p-6 rounded-3xl border border-emerald-100">
                   <h4 className="font-bold text-emerald-800 mb-2 text-sm sm:text-base">迁徙知识点</h4>
                   <ul className="text-xs sm:text-sm text-emerald-700 space-y-1 sm:space-y-2">
                     <li>• 它们在迁徙季需要跨越数千公里的危险航路。</li>
                     <li>• 城市的人造光源和透明玻璃是它们主要的天敌。</li>
                     <li>• 保护一种鸟类，也是在保护一整条生态链的完整。</li>
                   </ul>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
