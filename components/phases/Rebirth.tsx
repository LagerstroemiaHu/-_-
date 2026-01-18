
import React from 'react';
import { Feather, Fingerprint, Crown, TrendingUp, X } from 'lucide-react';
import { Character } from '../../types';
import { audioManager } from '../../utils/audio';

interface Props {
    character: Character;
    onSign: () => void;
    onBack: () => void;
}

export const Rebirth: React.FC<Props> = ({ character, onSign, onBack }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 stage-stray overflow-hidden select-none">
            <div className="bg-stone-100 border-[6px] md:border-[8px] border-black p-5 md:p-8 max-w-md w-full shadow-[12px_12px_0px_0px_#fbbf24] relative animate-in">
                {/* 胶带效果 */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-400/80 rotate-2 shadow-sm border border-amber-600 z-10"></div>
                
                {/* Top Left Badge */}
                <div className="absolute -top-4 -left-4 bg-black text-white px-3 py-1 font-black border-4 border-white rotate-[-5deg] shadow-lg flex items-center gap-1 z-20 text-xs md:text-sm">
                    <TrendingUp size={14} className="text-emerald-400" /> RISE UP
                </div>

                {/* Top Right Close Button */}
                <button 
                    onClick={onBack}
                    className="absolute -top-5 -right-5 bg-white text-black p-1.5 md:p-2 border-4 border-black hover:bg-rose-500 hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 z-50"
                    title="重选角色"
                >
                    <X size={20} strokeWidth={4} />
                </button>
                
                <div className="text-center mb-4 border-b-4 border-black pb-3 border-dashed mt-2">
                    <h2 className="text-3xl md:text-4xl font-black uppercase mb-1 tracking-tighter text-black">逆袭宣言</h2>
                    <p className="font-bold text-stone-600 italic text-xs md:text-sm leading-tight">
                        "既然跌落谷底，那就从垃圾桶开始，一步步爬回世界之巅。"
                    </p>
                </div>

                <div className="flex gap-3 mb-4 bg-white p-3 border-4 border-black transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-black shrink-0 bg-stone-100">
                        {/* Remove grayscale here to show original idle image */}
                        <img src={character.avatar} className="w-full h-full object-cover" alt={character.name} />
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-black uppercase">{character.name}</h3>
                        <div className="flex items-center gap-1 text-[10px] md:text-xs font-black text-amber-600 mb-1 uppercase">
                            <Crown size={12} /> 野心：夺回一切
                        </div>
                        <p className="text-xs font-bold leading-tight text-stone-800 line-clamp-3">{character.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.entries(character.initialStats).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center bg-stone-50 border-2 border-black p-1.5">
                            <span className="font-black text-stone-500 uppercase text-[10px]">
                                {k === 'health' ? '健康' : k === 'satiety' ? '饱腹' : k === 'hissing' ? '哈气' : '智力'}
                            </span>
                            <span className="font-black font-mono text-sm md:text-base">{v}</span>
                        </div>
                    ))}
                </div>

                <div className="mb-6 relative bg-black/5 p-3 border-l-4 border-black">
                    <p className="font-black text-sm md:text-base mb-1 uppercase italic flex gap-2 items-center">
                        当前身份: <span className="line-through text-stone-400 decoration-2">家猫</span> <span className="text-rose-600">流浪者</span>
                    </p>
                    <p className="text-[10px] md:text-xs font-bold text-stone-600 mt-1 leading-relaxed">
                        这是你猫生最落魄的时刻。但记住，真正的强者不是不流泪，而是含着泪也要把敌人的罐头抢过来。
                    </p>
                </div>

                <button 
                    onClick={() => { audioManager.playClick(); onSign(); }}
                    className="w-full py-3 md:py-4 bg-black text-white font-black text-lg md:text-xl border-4 border-transparent hover:bg-stone-800 hover:border-amber-400 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] active:translate-y-1 flex items-center justify-center gap-2 transition-all group"
                >
                    <Feather size={20} className="group-hover:rotate-12 transition-transform" /> 按爪画押 (开启传奇)
                </button>
                
                <div className="text-center mt-2">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest flex items-center justify-center gap-1 font-bold">
                        <Fingerprint size={12} /> The Legend Begins
                    </span>
                </div>
            </div>
        </div>
    );
};
