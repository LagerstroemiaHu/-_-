
import React from 'react';
import { Trophy } from 'lucide-react';
import { audioManager } from '../../utils/audio';

interface Props {
  onStart: () => void;
  onContinue: () => void;
  onGallery: () => void;
}

export const TitleScreen: React.FC<Props> = ({ onStart, onContinue, onGallery }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-400 p-4 text-center animate-in">
      <div className="bg-white p-8 border-[6px] border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full mb-8">
        <h1 className="text-4xl md:text-7xl font-black mb-2 uppercase tracking-tighter">圆头耄耋</h1>
        <p className="text-sm md:text-xl font-bold mb-8 text-stone-500 italic">十五日流浪传说</p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => { audioManager.playClick(); onStart(); }} 
            onMouseEnter={() => audioManager.playHover()}
            className="px-8 py-4 bg-amber-400 border-[6px] border-black font-black text-xl md:text-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all"
          >
            开启冒险
          </button>
          <button 
              onClick={() => { audioManager.playClick(); onContinue(); }} 
              onMouseEnter={() => audioManager.playHover()}
              className="px-8 py-2 bg-white border-[4px] border-black font-black text-sm md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all"
          >
              继续旅程
          </button>
        </div>
      </div>
      <button 
        onClick={() => { audioManager.playClick(); onGallery(); }} 
        onMouseEnter={() => audioManager.playHover()}
        className="font-black text-white hover:text-amber-300 flex items-center gap-2 underline uppercase tracking-widest"
      >
        <Trophy size={20}/> 结局图鉴
      </button>
    </div>
  );
};
