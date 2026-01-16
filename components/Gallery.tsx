
import React from 'react';
import { EndingType } from '../types';
import { ENDING_REGISTRY } from '../data/endings';
import { ArrowLeft, Lock } from 'lucide-react';

interface Props {
  unlockedEndings: EndingType[];
  onBack: () => void;
}

const Gallery: React.FC<Props> = ({ unlockedEndings, onBack }) => {
  const allEndings = Object.keys(ENDING_REGISTRY) as EndingType[];

  return (
    <div className="h-screen flex flex-col items-center p-4 bg-stone-100 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-5xl pb-10">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 font-black uppercase text-xl hover:text-amber-600 transition-colors"
        >
          <ArrowLeft size={24} strokeWidth={3} /> 返回
        </button>

        <h1 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">猫生成就 (LEGENDS)</h1>
        <p className="text-stone-500 font-bold mb-8 uppercase text-xs tracking-widest">收集所有可能的猫生结局 ({unlockedEndings.length}/{allEndings.length})</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {allEndings.map((type) => {
            const isUnlocked = unlockedEndings.includes(type);
            const config = ENDING_REGISTRY[type];
            const Icon = config.icon;

            return (
              <div 
                key={type}
                className={`
                  relative border-[3px] p-3 md:p-4 min-h-[120px] flex flex-col items-center justify-center text-center transition-all overflow-hidden group
                  ${isUnlocked 
                    ? `bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${config.isGood ? 'hover:bg-amber-50' : 'hover:bg-rose-50'}` 
                    : 'bg-stone-200 border-stone-400 text-stone-400 border-dashed'}
                `}
              >
                {isUnlocked ? (
                  <>
                    <Icon size={28} className={`mb-2 ${config.color}`} strokeWidth={2.5} />
                    <h3 className="text-xs md:text-sm font-black uppercase mb-1 leading-tight">{config.title}</h3>
                    <p className="text-[0.6rem] font-bold text-stone-500 leading-tight line-clamp-3">{config.description}</p>
                  </>
                ) : (
                  <>
                     <Lock size={20} className="mb-2 opacity-50" />
                     <p className="font-black text-[0.6rem] uppercase tracking-tighter">LOCKED</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
