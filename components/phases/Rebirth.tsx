
import React from 'react';
import { Feather, Fingerprint } from 'lucide-react';
import { Character } from '../../types';
import { audioManager } from '../../utils/audio';

interface Props {
    character: Character;
    onSign: () => void;
}

export const Rebirth: React.FC<Props> = ({ character, onSign }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-200 p-4">
            <div className="bg-amber-50 border-[8px] border-double border-stone-800 p-6 md:p-10 max-w-lg w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,0.8)] relative animate-in">
                <div className="absolute -top-6 -left-6 bg-rose-600 text-white px-4 py-2 font-black border-4 border-black rotate-[-5deg] shadow-lg">
                    REBIRTH CONTRACT
                </div>
                
                <div className="text-center mb-6 border-b-2 border-stone-800 pb-4">
                    <h2 className="text-4xl font-black uppercase mb-1">重生契约书</h2>
                    <p className="font-serif italic text-stone-600">签订此契约，赋予你第二次猫生。</p>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="w-24 h-24 border-4 border-black shrink-0">
                        <img src={character.avatar} className="w-full h-full object-cover" alt={character.name} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">{character.name}</h3>
                        <p className="text-xs font-bold text-stone-500 mb-2 uppercase">Subject ID: #001</p>
                        <p className="text-sm font-bold leading-tight">{character.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8 bg-white border-2 border-stone-300 p-3">
                    {Object.entries(character.initialStats).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1 last:border-0">
                            <span className="font-bold text-stone-500 uppercase text-xs">
                                {k === 'health' ? '健康' : k === 'satiety' ? '饱腹' : k === 'hissing' ? '哈气' : '智力'}
                            </span>
                            <span className="font-black font-mono">{v}</span>
                        </div>
                    ))}
                </div>

                <div className="mb-8">
                    <p className="text-center font-serif font-bold text-lg mb-2">生存目标</p>
                    <div className="bg-stone-800 text-amber-50 p-3 text-center text-sm font-mono">
                        存活 15 天 或 达成传奇结局
                    </div>
                </div>

                <button 
                    onClick={() => { audioManager.playClick(); onSign(); }}
                    className="w-full py-4 bg-rose-600 text-white font-black text-xl border-4 border-black hover:bg-rose-500 shadow-[4px_4px_0px_0px_black] active:translate-y-1 flex items-center justify-center gap-2"
                >
                    <Feather size={20} /> 签字并重生
                </button>
                
                <div className="text-center mt-2">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest flex items-center justify-center gap-1">
                        <Fingerprint size={10} /> Soul Bound
                    </span>
                </div>
            </div>
        </div>
    );
};
