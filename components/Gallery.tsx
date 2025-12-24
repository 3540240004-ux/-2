
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
    <div className="w-full h-full flex flex-col p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={onBack}
            className="p-3 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h2 className="text-4xl font-bold text-slate-800">城市候鸟图鉴</h2>
            <p className="text-slate-500">已救助并观测到的鸟类成员</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {birds.map(bird => (
            <div 
              key={bird.id}
              onClick={() => bird.unlocked && setSelectedBird(bird)}
              className={`relative rounded-[32px] overflow-hidden shadow-xl transition-all ${bird.unlocked ? 'bg-white cursor-pointer hover:-translate-y-2' : 'bg-slate-200 grayscale'}`}
            >
              <div className="aspect-[4/3] bg-slate-100 relative">
                {bird.unlocked ? (
                  <img src={bird.image} alt={bird.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Lock className="w-12 h-12 text-slate-400" />
                  </div>
                )}
                {bird.unlocked && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    已收录
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">
                  {bird.unlocked ? bird.name : '未知生物'}
                </h3>
                <p className="text-sm text-slate-400 font-serif italic mb-4">
                  {bird.unlocked ? bird.scientificName : '????'}
                </p>
                <div className={`text-xs px-2 py-1 rounded inline-block font-bold mb-4 ${
                  bird.status === 'endangered' ? 'bg-rose-100 text-rose-600' : 
                  bird.status === 'vulnerable' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'
                }`}>
                  {bird.status === 'endangered' ? '濒危' : bird.status === 'vulnerable' ? '易危' : '常见'}
                </div>
                {bird.unlocked && (
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {bird.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBird && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white rounded-[40px] max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <img src={selectedBird.image} className="w-full h-72 object-cover" />
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">{selectedBird.name}</h2>
                    <p className="text-slate-400 italic">{selectedBird.scientificName}</p>
                  </div>
                  <button onClick={() => setSelectedBird(null)} className="text-slate-400 hover:text-slate-600 font-bold">关闭</button>
                </div>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {selectedBird.description}
                </p>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                   <h4 className="font-bold text-emerald-800 mb-2">迁徙冷知识</h4>
                   <ul className="text-sm text-emerald-700 space-y-2">
                     <li>• 这种鸟在迁徙季需要跨越超过 3000 公里的距离。</li>
                     <li>• 它们能够感应地球磁场来确定方位。</li>
                     <li>• 城市中的透明玻璃是它们最大的空中威胁之一。</li>
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
