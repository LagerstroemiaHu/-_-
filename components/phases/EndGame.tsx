
import React from 'react';
import { EndingType } from '../../types';
import { audioManager } from '../../utils/audio';

interface Props {
    ending: EndingType | null;
    isVictory: boolean;
    onReset: () => void;
    onGallery: () => void;
}

export const EndGame: React.FC<Props> = ({ ending, isVictory, onReset, onGallery }) => {
    return (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 text-center backdrop-blur-md animate-in">
            <div className="bg-white border-[6px] md:border-[10px] border-black p-6 max-w-lg shadow-[10px_10px_0px_0px_black] transform rotate-1">
                <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter italic">
                    {isVictory ? '传奇永恒' : '喵生终结'}
                </h2>
                <p className="font-bold text-stone-600 mb-6 text-xs md:text-base leading-snug">
                    {ending === 'DOMESTICATED' ? '哈气值归零。你被人类彻底俘获，放弃了荒野的呼唤。其实，软饭也很香。' : 
                     ending === 'STARVED' ? '流浪生活 is 战斗。你在饥寒交迫中闭上了眼睛。' : 
                     ending === 'STUPID' ? '你的好奇心终于让你掉进了不可描述的深渊。' : 
                     ending === 'OLD_CAT' ? '十五日已过，你在这片土地上留下了不朽的传说。生存本身就是胜利！' :
                     '命运的轮盘停止了转动。'}
                </p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => { audioManager.playClick(); onReset(); }}
                        className="w-full py-4 bg-black text-white font-black text-lg md:text-2xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-amber-500 transition-colors uppercase"
                    >
                        再次轮回
                    </button>
                    <button 
                        onClick={() => { audioManager.playClick(); onGallery(); }}
                        className="w-full py-2 bg-white border-4 border-black font-black text-sm uppercase"
                    >
                        查看成就
                    </button>
                </div>
            </div>
        </div>
    );
};
