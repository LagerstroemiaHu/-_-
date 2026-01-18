
import React, { useState, useEffect } from 'react';
import { EndingType } from '../../types';
import { ENDING_REGISTRY } from '../../data/endings';
import { audioManager } from '../../utils/audio';
import { Trophy, RefreshCw, MousePointerClick, Share2, Sparkles, CloudRain } from 'lucide-react';

interface Props {
    ending: EndingType | null; 
    achievements: EndingType[]; 
    isVictory: boolean;
    onReset: () => void;
    onGallery: () => void;
}

export const EndGame: React.FC<Props> = ({ ending, achievements, isVictory, onReset, onGallery }) => {
    const [selectedId, setSelectedId] = useState<EndingType | null>(ending || (achievements.length > 0 ? achievements[0] : null));
    
    // Add a small initial delay before showing content to let curtain fall fully
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Wait 1.5s for curtain, then show content
        const timer = setTimeout(() => setShowContent(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const selectedConfig = selectedId ? ENDING_REGISTRY[selectedId] : null;
    const isMainEnding = selectedId === ending;
    const listItems = achievements;

    const handleShare = () => {
        audioManager.playSfx('shutter');
        alert("📸 请自行截屏分享哦 (我才不会要你的相册权限呢)");
    };

    if (!showContent) return <div className="fixed inset-0 z-[100]" />; // Placeholder while curtain falls

    // Dynamic Theme based on Victory/Defeat
    const containerClass = isVictory 
        ? "bg-amber-50" 
        : "bg-stone-900";
    
    const patternClass = isVictory
        ? "opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]"
        : "opacity-10 bg-[linear-gradient(45deg,#292524_25%,transparent_25%,transparent_75%,#292524_75%,#292524),linear-gradient(45deg,#292524_25%,transparent_25%,transparent_75%,#292524_75%,#292524)] [background-size:20px_20px] [background-position:0_0,10px_10px]";

    const textClass = isVictory ? "text-stone-900" : "text-stone-200";
    const subTextClass = isVictory ? "text-stone-600" : "text-stone-400";

    return (
        <div className={`fixed inset-0 z-[120] overflow-y-auto custom-scrollbar flex flex-col ${containerClass}`}>
            {/* Background Pattern */}
            <div className={`fixed inset-0 pointer-events-none ${patternClass}`} />
            
            {/* Particle Effects */}
            {isVictory ? (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute animate-float-up text-amber-400 opacity-50" 
                             style={{
                                 left: `${Math.random() * 100}%`,
                                 bottom: '-20px',
                                 animationDelay: `${Math.random() * 2}s`,
                                 fontSize: `${Math.random() * 20 + 10}px`
                             }}>
                            <Sparkles />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                     {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute animate-rain text-stone-600 opacity-30" 
                             style={{
                                 left: `${Math.random() * 100}%`,
                                 top: '-20px',
                                 animationDelay: `${Math.random() * 1}s`,
                                 animationDuration: `${0.5 + Math.random()}s`
                             }}>
                            <div className="w-[1px] h-[20px] bg-stone-500"></div>
                        </div>
                    ))}
                </div>
            )}

            <div className="min-h-full flex items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-2xl flex flex-col gap-6 relative">
                    
                    {/* Share Button (Floating) - Delay 1 */}
                    <button 
                        onClick={handleShare}
                        className="absolute top-0 right-0 z-50 bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all text-black hover:bg-amber-400 animate-fade-in-up"
                        style={{ animationDelay: '0.2s' }}
                        title="分享结局"
                    >
                        <Share2 size={24} strokeWidth={3} />
                    </button>

                    {/* Main Display Card - Delay 2 */}
                    {selectedConfig && (
                        <div 
                            className={`
                                border-[8px] border-black p-6 shadow-[15px_15px_0px_0px_rgba(0,0,0,0.8)] relative transform rotate-1 transition-all duration-300 animate-fade-in-up
                                ${isVictory ? 'bg-white' : 'bg-stone-800 text-stone-100'}
                            `}
                            style={{ animationDelay: '0.4s' }}
                        >
                            {/* Ribbon Label */}
                            <div className={`absolute -top-5 -left-5 px-4 py-1 font-black text-xl uppercase tracking-widest transform -rotate-3 border-4 border-black text-white shadow-md ${isMainEnding ? (isVictory ? 'bg-amber-500' : 'bg-rose-600') : 'bg-blue-500'}`}>
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
                                    <p className={`font-bold text-sm md:text-lg leading-snug ${isVictory ? 'text-stone-600' : 'text-stone-400'}`}>
                                        {selectedConfig.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Clickable Achievement List - Delay 3 */}
                    {listItems.length > 0 && (
                        <div className="flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className={`flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest ${isVictory ? 'text-black/50' : 'text-white/50'}`}>
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
                                                    ? 'bg-amber-100 border-amber-500 ring-2 ring-black scale-[1.02] z-10' 
                                                    : 'bg-white border-stone-300 hover:border-black hover:bg-stone-50 opacity-90 hover:opacity-100'}
                                            `}
                                        >
                                            <div className={`p-2 bg-stone-100 rounded-full border-2 border-black ${config.color} group-hover:scale-110 transition-transform`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <div className={`font-black text-xs uppercase tracking-wider ${isMainForList ? 'text-amber-600' : 'text-stone-400 group-hover:text-black'}`}>
                                                    {isMainForList ? 'MAIN ENDING' : 'ACHIEVEMENT'}
                                                </div>
                                                <div className={`font-bold text-sm text-black`}>{config.title}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions - Delay 4 */}
                    <div className="flex flex-col gap-3 mt-4 pb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                        <button 
                            onClick={() => { audioManager.playClick(); onReset(); }}
                            className="w-full py-4 bg-amber-400 text-black font-black text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 uppercase"
                        >
                            <RefreshCw size={24} strokeWidth={3} /> 再次轮回
                        </button>
                        <button 
                            onClick={() => { audioManager.playClick(); onGallery(); }}
                            className={`w-full py-3 bg-transparent border-4 font-black text-sm uppercase flex items-center justify-center gap-2 hover:bg-white/10 ${isVictory ? 'border-black text-black' : 'border-stone-500 text-stone-400 hover:text-white hover:border-white'}`}
                        >
                            <Trophy size={18} /> 查看图鉴
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes float-up {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 3s linear infinite;
                }
                @keyframes rain {
                    0% { transform: translateY(0); opacity: 0; }
                    20% { opacity: 0.5; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                .animate-rain {
                    animation: rain 1s linear infinite;
                }
            `}</style>
        </div>
    );
};
