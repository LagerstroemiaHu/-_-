
import React, { useState, useEffect } from 'react';
import { ArrowRight, SkipForward, ArrowLeft, Heart, Brain, Fish, Zap } from 'lucide-react';
import { audioManager } from '../../utils/audio';
import { getImg } from '../../data/utils';

interface Props {
    onComplete: () => void;
    onBack: () => void;
}

const PrologueStatBar = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) => (
    <div className="w-full mb-2">
        <div className="flex justify-between items-end mb-0.5 px-0.5">
            <div className="flex items-center gap-1">
                <Icon size={12} className="text-black" strokeWidth={3} />
                <span className="text-[10px] font-black uppercase leading-none tracking-tighter">{label}</span>
            </div>
            <span className="text-[10px] font-black font-mono leading-none">{value}</span>
        </div>
        <div className="w-full h-2 border-2 border-black bg-stone-200">
            <div 
                className={`h-full ${color}`} 
                style={{ width: `${value}%` }} 
            />
        </div>
    </div>
);

export const Prologue: React.FC<Props> = ({ onComplete, onBack }) => {
    const [panelIndex, setPanelIndex] = useState(0);

    const panels = [
        {
            id: 1,
            image: getImg('爬上博古架', 'b91c1c'),
            caption: '那一刻，我只是想在狭小的空间里奔跑',
            stat: { icon: Heart, label: '健康', value: 60, color: 'bg-rose-500' },
            sub: (
                <>
                    哪怕四处碰壁，也要用 <span className="text-rose-500 font-black text-lg md:text-xl animate-pulse inline-block mx-1">健康</span> 证明我还活着。
                </>
            )
        },
        {
            id: 2,
            image: getImg('人类的愤怒', '4a044e'),
            caption: '那个白手套发不断拿发光方块向我靠近又远离',
            stat: { icon: Brain, label: '智力', value: 30, color: 'bg-blue-500' },
            sub: (
                <>
                    是戏弄还是陷阱？我需要更高的 <span className="text-blue-500 font-black text-lg md:text-xl animate-bounce inline-block mx-1">智力</span> 才能看穿。
                </>
            )
        },
        {
            id: 3,
            image: getImg('被驱逐', '171717'),
            caption: '大门重重关上。雪花落在我温热的鼻头上',
            stat: { icon: Fish, label: '饱腹', value: 60, color: 'bg-amber-500' },
            sub: (
                <>
                    寒风刺骨，从此以后，<span className="text-amber-500 font-black text-lg md:text-xl animate-wiggle inline-block mx-1">饱腹</span> 将是最大的奢望。
                </>
            )
        },
        {
            id: 4,
            image: getImg('凶狠凝视', 'f59e0b'),
            caption: '没有回头乞求。我舔了舔爪子，露出了獠牙',
            stat: { icon: Zap, label: '哈气', value: 40, color: 'bg-purple-600' },
            sub: (
                <>
                    面对残酷的世界，唯有 <span className="text-purple-600 font-black text-lg md:text-xl animate-vibrate inline-block mx-1">哈气</span> 能捍卫尊严。
                </>
            )
        }
    ];

    const nextPanel = () => {
        if (panelIndex < panels.length - 1) {
            audioManager.playSfx('page_flip');
            setPanelIndex(prev => prev + 1);
        } else {
            audioManager.playSfx('impact');
            onComplete();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                nextPanel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [panelIndex]);

    return (
        <div 
            className="fixed inset-0 bg-stone-900 flex flex-col items-center justify-center p-4 cursor-pointer select-none"
            onClick={nextPanel}
        >
            <div className="w-full max-w-lg h-full max-h-[90vh] flex flex-col gap-4 relative">
                {/* Controls Layer */}
                <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start pointer-events-none">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onBack(); }}
                        className="text-stone-500 hover:text-white flex items-center gap-1 text-xs uppercase font-black pointer-events-auto transition-colors"
                    >
                        <ArrowLeft size={14} /> 返回标题
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); onComplete(); }}
                        className="text-stone-500 hover:text-white flex items-center gap-1 text-xs uppercase font-black pointer-events-auto transition-colors"
                    >
                        <SkipForward size={14} /> 跳过剧情
                    </button>
                </div>

                <div className="flex-1 grid grid-rows-4 gap-4 h-full mt-6">
                    {panels.map((panel, idx) => {
                        // 漫画显示逻辑：当前格完全显示，之前的格变暗，之后的格隐藏
                        const isVisible = idx <= panelIndex;
                        const isCurrent = idx === panelIndex;
                        
                        return (
                            <div 
                                key={panel.id}
                                className={`
                                    relative border-[4px] border-white bg-black overflow-hidden transition-all duration-500 ease-out
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                                    ${!isCurrent && isVisible ? 'grayscale brightness-50' : 'grayscale-0'}
                                `}
                            >
                                {/* 图片层 */}
                                <div className="absolute inset-0">
                                    <img 
                                        src={panel.image} 
                                        alt={`Panel ${panel.id}`} 
                                        className="w-full h-full object-cover"
                                    />
                                    {/* 漫画速度线遮罩特效 */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] bg-[length:10px_10px] opacity-20 pointer-events-none" />
                                    )}
                                </div>

                                {/* 字幕层 - 漫画气泡风格 */}
                                {isVisible && (
                                    <div className={`
                                        absolute bottom-2 left-2 right-2 bg-white border-[3px] border-black p-2 shadow-[4px_4px_0px_0px_black]
                                        transition-all duration-300 delay-100
                                        ${isCurrent ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}
                                    `}>
                                        <PrologueStatBar {...panel.stat} />
                                        <p className="font-black text-sm md:text-base text-black leading-tight uppercase">
                                            {panel.caption}
                                        </p>
                                        <p className="font-bold text-xs md:text-sm text-stone-600 mt-1 italic flex items-center flex-wrap">
                                            {panel.sub}
                                        </p>
                                    </div>
                                )}

                                {/* 序号标记 */}
                                <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 font-black text-xs border-r-2 border-b-2 border-white">
                                    0{panel.id}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="h-12 flex items-center justify-center shrink-0">
                    <div className="text-white font-black uppercase tracking-widest animate-pulse flex items-center gap-2 text-sm">
                        {panelIndex < panels.length - 1 ? '点击屏幕继续' : '开启传说'} <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
};
