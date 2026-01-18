
import React, { useState } from 'react';
import { EndingType } from '../../types';
import { ENDING_REGISTRY } from '../../data/endings';
import { audioManager } from '../../utils/audio';
import { Trophy, RefreshCw, MousePointerClick, Share2 } from 'lucide-react';

interface Props {
    ending: EndingType | null; // 主结局
    achievements: EndingType[]; // 获得的所有成就（包括主结局）
    isVictory: boolean;
    onReset: () => void;
    onGallery: () => void;
}

export const EndGame: React.FC<Props> = ({ ending, achievements, isVictory, onReset, onGallery }) => {
    // 默认选中主结局，如果没有主结局（理论上不应该）则选中第一个成就
    const [selectedId, setSelectedId] = useState<EndingType | null>(ending || (achievements.length > 0 ? achievements[0] : null));

    const selectedConfig = selectedId ? ENDING_REGISTRY[selectedId] : null;
    
    // 判断当前选中的是否是本轮的主结局
    const isMainEnding = selectedId === ending;
    
    // 显示所有获得的成就，不进行过滤
    const listItems = achievements;

    const handleShare = () => {
        audioManager.playSfx('shutter');
        alert("📸 喵生回忆已保存到相册（模拟）");
    };

    return (
        <div className="fixed inset-0 z-[120] bg-stone-900/95 flex flex-col items-center justify-center p-4 overflow-y-auto animate-in custom-scrollbar">
            <div className="w-full max-w-2xl flex flex-col gap-6 my-auto py-10 relative">
                
                {/* Share Button (Floating) */}
                <button 
                    onClick={handleShare}
                    className="absolute top-4 right-0 z-50 bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_white] hover:scale-110 active:scale-95 transition-all text-black hover:bg-amber-400"
                    title="分享结局"
                >
                    <Share2 size={24} strokeWidth={3} />
                </button>

                {/* Main Display Card */}
                {selectedConfig && (
                    <div className="bg-white border-[8px] border-black p-6 shadow-[15px_15px_0px_0px_#fbbf24] relative transform rotate-1 transition-all duration-300">
                        {/* Ribbon Label */}
                        <div className={`absolute -top-5 -left-5 px-4 py-1 font-black text-xl uppercase tracking-widest transform -rotate-3 border-4 border-black text-white shadow-md ${isMainEnding ? (isVictory ? 'bg-amber-500' : 'bg-stone-800') : 'bg-blue-500'}`}>
                            {isMainEnding ? (isVictory ? 'LEGENDARY' : 'GAME OVER') : 'ACHIEVEMENT'}
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            {selectedConfig.image && (
                                <div className="w-32 h-32 md:w-48 md:h-48 border-4 border-black shrink-0 bg-stone-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    <img src={selectedConfig.image} className="w-full h-full object-cover grayscale contrast-125" alt={selectedConfig.title} />
                                </div>
                            )}
                            <div className="text-center md:text-left flex-1">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <selectedConfig.icon size={48} className={`${selectedConfig.color}`} strokeWidth={2.5}/>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black mb-2 uppercase tracking-tighter leading-none">
                                    {selectedConfig.title}
                                </h2>
                                <p className="font-bold text-stone-600 text-sm md:text-lg leading-snug">
                                    {selectedConfig.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Clickable Achievement List */}
                {listItems.length > 0 && (
                    <div className="flex flex-col gap-2 animate-in" style={{animationDelay: '0.2s'}}>
                        <div className="flex items-center justify-center gap-2 text-white/50 text-xs font-black uppercase tracking-widest">
                            <MousePointerClick size={14} /> 点击查看本局其他记录
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {listItems.map(achId => {
                                const config = ENDING_REGISTRY[achId];
                                const Icon = config.icon;
                                const isMainForList = achId === ending;
                                const isSelected = achId === selectedId;

                                return (
                                    <button 
                                        key={achId} 
                                        onClick={() => { audioManager.playClick(); setSelectedId(achId); }}
                                        className={`
                                            border-l-4 p-3 flex items-center gap-3 shadow-lg transition-all active:translate-x-1 text-left group w-full
                                            ${isSelected 
                                                ? 'bg-stone-700 border-amber-500 ring-2 ring-white/50 scale-[1.02] z-10' 
                                                : 'bg-stone-800 border-stone-600 hover:border-amber-400 hover:bg-stone-700 opacity-90 hover:opacity-100'}
                                        `}
                                    >
                                        <div className={`p-2 bg-stone-900 rounded-full ${config.color} group-hover:scale-110 transition-transform`}>
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <div className={`font-black text-xs uppercase tracking-wider ${isMainForList ? 'text-amber-500' : 'text-stone-500 group-hover:text-amber-200'}`}>
                                                {isMainForList ? 'MAIN ENDING' : 'ACHIEVEMENT'}
                                            </div>
                                            <div className={`font-bold text-sm ${isSelected ? 'text-amber-400' : 'text-white group-hover:text-amber-50'}`}>{config.title}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-col gap-3 mt-4">
                    <button 
                        onClick={() => { audioManager.playClick(); onReset(); }}
                        className="w-full py-4 bg-amber-400 text-black font-black text-xl border-4 border-black shadow-[6px_6px_0px_0px_white] hover:bg-amber-300 hover:shadow-[8px_8px_0px_0px_white] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase"
                    >
                        <RefreshCw size={24} strokeWidth={3} /> 再次轮回
                    </button>
                    <button 
                        onClick={() => { audioManager.playClick(); onGallery(); }}
                        className="w-full py-3 bg-transparent text-white border-4 border-stone-600 font-black text-sm uppercase hover:bg-white/10 flex items-center justify-center gap-2"
                    >
                        <Trophy size={18} /> 查看图鉴
                    </button>
                </div>
            </div>
        </div>
    );
};
