
import React, { useState, useEffect, useRef } from 'react';
import { GameStats, GamePhase, GameEvent, Choice, LogEntry, GameStage, Character, NightThought } from '../../types';
import StatsDisplay from '../StatsDisplay';
import GMPanel from '../GMPanel';
import EffectsLayer from '../EffectsLayer';
import { audioManager } from '../../utils/audio';
import { 
  Moon, ScrollText, Flag, Compass, Check,
  Sword, Coffee, Fish, Smartphone, Heart, Sparkles,
  Menu, Zap, Eye, AlertCircle, ArrowRight, Cat,
  MessageSquareQuote, Volume2, VolumeX
} from 'lucide-react';

// Theme maps copied from App.tsx
const STAT_THEME_MAP: Record<string, { gridBg: string, footerBg: string, border: string, btn: string }> = {
  '健康': { gridBg: 'bg-rose-500', footerBg: 'bg-rose-950', border: 'border-rose-500', btn: 'hover:bg-rose-500' },
  '饱腹': { gridBg: 'bg-amber-500', footerBg: 'bg-amber-950', border: 'border-amber-500', btn: 'hover:bg-amber-500' },
  '哈气': { gridBg: 'bg-purple-600', footerBg: 'bg-purple-950', border: 'border-purple-500', btn: 'hover:bg-purple-500' },
  '智力': { gridBg: 'bg-blue-500', footerBg: 'bg-blue-950', border: 'border-blue-500', btn: 'hover:bg-blue-500' },
  'neutral': { gridBg: 'bg-stone-400', footerBg: 'bg-stone-900', border: 'border-stone-700', btn: 'hover:bg-stone-100' }
};

const SPECIAL_THEME_MAP: Record<string, { gridBg: string, footerBg: string, border: string, btn: string }> = {
  'STAGE': { gridBg: 'bg-amber-500', footerBg: 'bg-amber-900', border: 'border-amber-600', btn: 'hover:bg-amber-400 text-black' },
  'SIDE_QUEST': { gridBg: 'bg-emerald-500', footerBg: 'bg-emerald-900', border: 'border-emerald-600', btn: 'hover:bg-emerald-400' }
};

const CHAIN_THEME_MAP: Record<string, { gridBg: string, footerBg: string, border: string, btn: string }> = {
  'apprentice': { gridBg: 'bg-emerald-500', footerBg: 'bg-emerald-950', border: 'border-emerald-500', btn: 'hover:bg-emerald-500' },
  'eggs': { gridBg: 'bg-orange-500', footerBg: 'bg-orange-950', border: 'border-orange-500', btn: 'hover:bg-orange-500' },
  'internet': { gridBg: 'bg-indigo-500', footerBg: 'bg-indigo-950', border: 'border-indigo-500', btn: 'hover:bg-indigo-500' }
};

const STAGE_BG_MAP: Record<GameStage, string> = {
  'STRAY': 'stage-stray',
  'CAT_LORD': 'stage-cat-lord',
  'MANSION': 'stage-mansion',
  'CELEBRITY': 'stage-celebrity'
};

const STAT_LABELS: Record<string, string> = {
  health: '健康', satiety: '饱腹', hissing: '哈气', smarts: '智力'
};

const getActionIcon = (id: string, type?: string) => {
  if (type === 'STAGE') return <Flag size={12} />;
  if (type === 'SIDE_QUEST') return <Compass size={12} />;
  switch(id) {
    case 'forage_trash': return <Coffee size={12} />;
    case 'hunt_mouse': return <Sword size={12} />; 
    case 'luxury_food': return <Fish size={12} />;
    case 'live_stream': return <Smartphone size={12} />;
    case 'groom': return <Sparkles size={12} />;
    case 'nap': return <Moon size={12} />;
    case 'act_cute': return <Heart size={12} />;
    case 'observe_human': return <Eye size={12} />;
    default: return <Zap size={12} />;
  }
};

const getChanceColor = (chance: number) => {
  if (chance >= 70) return 'text-emerald-400';
  if (chance >= 35) return 'text-amber-400';
  return 'text-rose-500';
};

const getEventTheme = (event: GameEvent | null) => {
    if (!event) return STAT_THEME_MAP['neutral'];
    if (event.type === 'STAGE') return SPECIAL_THEME_MAP['STAGE'];
    if (event.type === 'SIDE_QUEST') {
        if (event.chainId && CHAIN_THEME_MAP[event.chainId]) return CHAIN_THEME_MAP[event.chainId];
        return SPECIAL_THEME_MAP['SIDE_QUEST'];
    }
    if (event.hints && event.hints.length > 0) {
      return STAT_THEME_MAP[event.hints[0].stat] || STAT_THEME_MAP['neutral'];
    }
    return STAT_THEME_MAP['neutral'];
};

interface Props {
    phase: GamePhase;
    day: number;
    maxDays: number;
    stats: GameStats;
    character: Character | null;
    stage: GameStage;
    logs: LogEntry[];
    actionPoints: number;
    dailyActionsTaken: string[];
    currentEvent: GameEvent | null;
    eventResult: {message: string, success: boolean, changes?: Partial<GameStats>} | null;
    activeEffect: any;
    isShaking: boolean;
    isImpactShaking: boolean;
    isFlashActive: boolean;
    isStageTransitioning: boolean;
    isShutterActive: boolean;
    currentNightThought: NightThought | null;
    
    // Actions derived from parent
    unlockedActions: GameEvent[];
    lockedActions: GameEvent[];

    // Handlers
    onMenuOpen: () => void;
    onChoice: (choice: Choice) => void;
    onResolutionComplete: () => void;
    onStartDay: (day: number) => void;
    onFinishGame: () => void;
    onSetEvent: (event: GameEvent | null) => void;
    onSetEventResult: (res: any) => void;
    
    // GM Handlers
    onUpdateStats: (newStats: Partial<GameStats>) => void;
    onSetDay: (day: number) => void;
    onSetPhase: (phase: GamePhase) => void; 
}

export const MainGame: React.FC<Props> = ({
    phase, day, maxDays, stats, character, stage, logs, actionPoints,
    dailyActionsTaken, currentEvent, eventResult, activeEffect,
    isShaking, isImpactShaking, isFlashActive, isStageTransitioning, isShutterActive,
    currentNightThought, unlockedActions, lockedActions,
    onMenuOpen, onChoice, onResolutionComplete, onStartDay, onFinishGame,
    onSetEvent, onSetEventResult, onUpdateStats, onSetDay, onSetPhase
}) => {
    
    const [displayStage, setDisplayStage] = useState<GameStage>(stage);
    const [muted, setMuted] = useState(audioManager.isMuted);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const toggleMute = () => {
        const isMuted = audioManager.toggleMute();
        setMuted(isMuted);
    };

    useEffect(() => {
        if (!isStageTransitioning) {
            setDisplayStage(stage);
        }
    }, [stage, isStageTransitioning]);

    // Low stats warning sound loop
    useEffect(() => {
        if ((stats.health < 30 || stats.satiety < 20) && !muted && phase !== 'START' && phase !== 'PROLOGUE') {
            if (!heartbeatRef.current) {
                // Initial play
                audioManager.playSfx('heartbeat');
                // Loop
                heartbeatRef.current = setInterval(() => {
                    audioManager.playSfx('heartbeat');
                }, 1500);
            }
        } else {
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
        }

        return () => {
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
        };
    }, [stats.health, stats.satiety, muted, phase]);

    const currentTheme = getEventTheme(currentEvent);
    const feedbackText = eventResult ? eventResult.message : currentEvent?.description || "";
    const feedbackFontSize = feedbackText.length > 50 ? 'text-[8px] md:text-xs' : 'text-[10px] md:text-sm';

    return (
        <div className={`fixed inset-0 flex flex-col ${STAGE_BG_MAP[displayStage]} font-sans overflow-hidden border-[4px] md:border-[6px] border-black select-none transition-all duration-1000 ${isShaking ? 'animate-shake' : ''} ${isImpactShaking ? 'animate-impact' : ''}`}>
            <div className={`impact-flash ${isFlashActive ? 'flash-active' : ''}`} />
            
            {/* GM控制面板 */}
            <GMPanel stats={stats} day={day} onUpdateStats={onUpdateStats} onSetDay={onSetDay} onTriggerEvent={(e) => { onSetEvent(e); onSetEventResult(null); }} />

            {/* 点击结果特效层 */}
            <EffectsLayer isLowHealth={stats.health < 30} isLowSatiety={stats.satiety < 20} activeEffect={activeEffect} />

            <header className={`h-14 md:h-16 shrink-0 bg-white border-b-[4px] md:border-b-[6px] border-black flex items-stretch z-30 shadow-md ${isImpactShaking ? 'animate-impact' : ''}`}>
                <div className="flex items-center gap-1 shrink-0 border-r-[2px] md:border-r-[4px] border-black px-2 md:px-4 bg-stone-100 font-black">
                    <span className="text-lg md:text-2xl uppercase italic tracking-tighter">D{day}</span>
                </div>
                <div className="flex-1">
                    <StatsDisplay stats={stats} />
                </div>
                <div className="flex items-center px-2 md:px-4 bg-stone-100 border-l-[2px] md:border-l-[4px] border-black gap-2">
                    <button onClick={toggleMute} onMouseEnter={() => audioManager.playHover()} className="h-8 md:h-10 w-8 md:w-10 flex items-center justify-center border-2 md:border-4 border-black bg-stone-200 font-black shadow-[2px_2px_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5 hover:bg-stone-300">
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <button onClick={() => { audioManager.playClick(); onMenuOpen(); }} onMouseEnter={() => audioManager.playHover()} className="h-8 md:h-10 px-2 md:px-3 border-2 md:border-4 border-black bg-white font-black shadow-[2px_2px_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5 hover:bg-amber-400">
                        <Menu size={18}/>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black/5 p-2 md:p-3 gap-2 md:gap-3">
                <section className="w-full md:w-64 h-36 md:h-full shrink-0 flex flex-row md:flex-col gap-2 md:gap-3 z-20 overflow-hidden">
                    <div className={`flex-1 md:flex-[2.5] bg-white border-[4px] border-black p-1 md:p-3 shadow-[4px_4px_0px_0px_black] flex flex-col items-center justify-center overflow-hidden ${isImpactShaking ? 'animate-impact' : ''}`}>
                        <div className={`w-full aspect-square md:aspect-[3/4] border-[2px] md:border-[3px] border-black bg-stone-100 relative shadow-inner flip-container ${isStageTransitioning ? 'flip-active' : ''}`}>
                            <div className="flip-inner">
                                <div className="flip-face flip-front">
                                    <img src={character?.avatar} className="w-full h-full object-cover" />
                                </div>
                                <div className="flip-face flip-back">
                                    <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_black]">
                                        <Cat size={32} className="text-amber-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-0.5 md:mt-2 px-1 md:px-2 py-0.5 bg-black text-white font-black text-[6px] md:text-[9px] text-center uppercase tracking-widest w-full truncate italic leading-none">{stage}</div>
                    </div>

                    <div className={`flex-1 md:flex-1 bg-white border-[4px] border-black flex flex-col overflow-hidden shadow-[4px_4px_0px_0px_black] ${isImpactShaking ? 'animate-impact' : ''}`}>
                        <div className="bg-amber-400 text-black px-1 md:px-2 py-0.5 flex items-center shrink-0 border-b-[2px] md:border-b-[3px] border-black">
                            <span className="font-black text-[10px] md:text-xs uppercase flex items-center gap-1 tracking-tighter"><Eye size={12} /> 待解锁</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-1 md:p-1.5 space-y-1 md:space-y-1.5 no-scrollbar bg-stone-50">
                            {lockedActions.length > 0 ? lockedActions.map(action => (
                                <div key={action.id} className="p-0.5 md:p-1 border-[1.5px] border-dashed border-stone-400 bg-white opacity-60">
                                    <div className="font-black text-[7px] md:text-[8px] text-stone-600 truncate uppercase leading-none">{action.title}</div>
                                    <div className="text-[6px] md:text-[8px] font-bold text-rose-500 italic mt-0.5 leading-tight truncate">
                                        锁: {action.unlockCondition?.(day, stats, [], [], {}).reason || '未达要求'}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-[9px] md:text-[10px] text-stone-400 font-black italic text-center p-2 uppercase">无远大志向</div>
                            )}
                        </div>
                    </div>

                    <div className={`flex-1 md:flex-1 bg-white border-[4px] border-black flex flex-col overflow-hidden shadow-[4px_4px_0px_0px_black] ${isImpactShaking ? 'animate-impact' : ''}`}>
                        <div className="bg-stone-800 text-white px-1 md:px-2 py-0.5 flex items-center shrink-0 border-b-[2px] md:border-b-[3px] border-black">
                            <span className="font-black text-[10px] md:text-xs uppercase flex items-center gap-1 tracking-tighter"><ScrollText size={12} /> 日志</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0.5 md:p-1.5 space-y-1 bg-white custom-scrollbar">
                            {logs.map((log, i) => (
                                <div key={i} className={`p-0.5 md:p-1 border-[1.5px] border-black bg-white text-[7px] md:text-[8px] font-black shadow-[1px_1px_0px_0px_black] leading-tight ${log.type === 'success' ? 'bg-emerald-50 border-emerald-500' : log.type === 'danger' ? 'bg-rose-50 border-rose-500' : ''}`}>
                                    <span className="text-stone-400">[{log.day}D]</span> {log.message}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={`flex-1 flex flex-col overflow-hidden bg-white/90 border-[4px] md:border-[6px] border-black shadow-[6px_6px_0px_0px_black] md:shadow-[8px_8px_0px_0px_black] transition-all duration-700 relative ${isImpactShaking ? 'animate-impact' : ''}`}>
                    <div className={`shutter-overlay ${isShutterActive ? 'shutter-active' : ''}`} />

                    <div className={`bg-stone-200 text-black px-4 py-2 font-black text-[10px] md:text-sm uppercase flex justify-between items-center shrink-0 border-b-[4px] border-stone-400 z-10 relative ${phase === 'NIGHT_SUMMARY' ? 'grayscale opacity-60' : ''}`}>
                        <span className="flex items-center gap-2"><Zap size={14} className="text-amber-600" /> 立即可行 (AVAILABLE)</span>
                        <span className="opacity-80 text-[8px] md:text-[10px] bg-white px-2 py-0.5 border border-black/10">行动力: {actionPoints}/3</span>
                    </div>
                    
                    <div className={`flex-1 overflow-y-auto p-2 md:p-4 no-scrollbar bg-stone-50/50 ${phase === 'NIGHT_SUMMARY' ? 'grayscale opacity-60 pointer-events-none' : ''}`}>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 content-start pb-10">
                            {unlockedActions.map(action => {
                                const isTaken = dailyActionsTaken.includes(action.id);
                                const actionTheme = getEventTheme(action);
                                const isStageAction = action.type === 'STAGE';

                                return (
                                    <button
                                        key={action.id}
                                        disabled={isTaken || phase !== 'ACTION_SELECTION' || actionPoints <= 0}
                                        onClick={() => { audioManager.playClick(); onSetEvent(action); onSetEventResult(null); }}
                                        onMouseEnter={() => !isTaken && phase === 'ACTION_SELECTION' && actionPoints > 0 && audioManager.playHover()}
                                        className={`
                                            w-full p-2 border-[3px] md:border-4 flex flex-col items-start gap-1 text-left transition-all min-h-[85px] md:min-h-[105px] relative group
                                            ${currentEvent?.id === action.id ? 'translate-x-1 translate-y-1 shadow-none border-black ring-2 ring-white bg-amber-50' : 'shadow-[3px_3px_0px_0px_black] md:shadow-[5px_5px_0px_0px_black] bg-white'}
                                            ${isTaken ? 'bg-stone-200 border-stone-400 opacity-40 grayscale' : `${actionTheme.border} ${isStageAction ? 'animate-bounce-subtle ring-4 ring-amber-400/30' : ''}`}
                                            poly-button
                                        `}
                                    >
                                        <div className="flex items-center gap-2 w-full mb-1">
                                            <div className={`p-1.5 border-2 border-black transition-colors ${isTaken ? 'bg-stone-400' : actionTheme.gridBg}`}>
                                                {isTaken ? <Check size={12} className="text-white" /> : getActionIcon(action.id, action.type)}
                                            </div>
                                            <div className={`font-black text-[9px] md:text-[12px] leading-none uppercase truncate flex-1 ${isStageAction ? 'text-amber-700' : ''}`}>
                                            {action.title}
                                            </div>
                                        </div>
                                        <div className="text-[7px] md:text-[9px] font-bold text-stone-500 leading-snug line-clamp-2 md:line-clamp-3 w-full border-t border-stone-100 pt-1">
                                            {action.description}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <footer className={`shrink-0 text-white border-t-[4px] md:border-t-[6px] border-black p-2 md:p-4 flex flex-col gap-2 z-[60] transition-all duration-500 overflow-hidden h-auto min-h-[8rem] md:min-h-[10rem] ${phase === 'NIGHT_SUMMARY' ? 'bg-stone-900 grayscale-0 opacity-100' : currentTheme.footerBg} ${isImpactShaking ? 'animate-impact' : ''}`}>
                        {phase === 'NIGHT_SUMMARY' ? (
                            <div className="h-full flex flex-col justify-between animate-in p-1">
                                {/* Night Thought Section */}
                                <div className="flex-1 flex flex-col justify-center items-center text-center mb-2 md:mb-4 relative">
                                        <div className="absolute top-0 right-0 opacity-20"><Moon size={64} className="text-stone-100"/></div>
                                        {currentNightThought ? (
                                            <div className="w-full max-w-2xl bg-stone-800 border-l-4 border-amber-500 p-3 md:p-4 shadow-lg text-left relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-10"><MessageSquareQuote size={40} className="text-white"/></div>
                                                <h3 className="text-xs md:text-sm font-black text-amber-500 uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                                                    <Zap size={12}/> {currentNightThought.title}
                                                </h3>
                                                <p className="text-xs md:text-base font-bold text-stone-300 italic leading-relaxed md:leading-relaxed">
                                                    "{currentNightThought.content}"
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-stone-500 italic">夜色温柔，无梦到天明...</p>
                                        )}
                                </div>

                                <div className="flex items-center justify-between gap-4 border-t border-stone-700 pt-2 md:pt-4">
                                    <div className="text-left">
                                        <p className="text-stone-400 font-bold text-[8px] md:text-[10px] flex items-center gap-1"><AlertCircle size={10}/> 基础消耗：饱腹-15</p>
                                    </div>
                                    <button 
                                        onClick={() => { audioManager.playClick(); if(day >= maxDays) onFinishGame(); else onStartDay(day + 1); }} 
                                        onMouseEnter={() => audioManager.playHover()}
                                        className="
                                            group relative px-6 py-2 md:px-8 md:py-3 
                                            bg-amber-400 text-black 
                                            font-black text-sm md:text-xl 
                                            border-[3px] border-black 
                                            shadow-[4px_4px_0px_0px_white] 
                                            hover:shadow-[6px_6px_0px_0px_white] 
                                            hover:bg-amber-300
                                            active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_white]
                                            transition-all duration-200 
                                            shrink-0 z-[100]
                                            flex items-center gap-2
                                            animate-pop
                                        "
                                    >
                                        <span className="relative z-10">迎接明日</span>
                                        <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ) : currentEvent && phase !== 'MORNING_EVENT' ? (
                            <div className="flex-1 flex flex-col h-full overflow-hidden">
                                <div className={`flex items-center justify-between gap-2 bg-black/50 border-2 p-1.5 md:p-2 rounded shrink-0 h-auto min-h-[3rem] ${currentTheme.border}`}>
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <p className={`flex-1 ${feedbackFontSize} font-black italic text-white leading-tight ${currentEvent.id === 'sudden_carrot_tissue' && !eventResult ? 'blur-[4px] hover:blur-none transition-all cursor-help' : ''}`}>
                                        {feedbackText}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 shrink-0 ml-2">
                                        {eventResult?.changes && Object.entries(eventResult.changes).map(([k, v], i) => (
                                        <span key={i} className={`text-[7px] md:text-[10px] font-black px-1.5 py-0.5 border-2 border-black bg-black shadow-[1px_1px_0px_0px_white] ${Number(v) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {STAT_LABELS[k] || k}{Number(v) > 0 ? '+' : ''}{v}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mt-1 md:mt-2 flex gap-2 h-14 md:h-18 shrink-0">
                                    {eventResult ? (
                                        <button 
                                            onClick={() => { audioManager.playClick(); onResolutionComplete(); }} 
                                            onMouseEnter={() => audioManager.playHover()}
                                            className="flex-1 bg-white text-black font-black text-sm md:text-xl border-2 border-black hover:bg-amber-400 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
                                        >
                                            我知道了，喵
                                        </button>
                                    ) : (
                                        currentEvent.choices.map(choice => {
                                            const chance = choice.calculateChance ? Math.floor(choice.calculateChance(stats)) : null;
                                            return (
                                                <button 
                                                    key={choice.id} 
                                                    disabled={choice.condition ? !choice.condition(stats) : false}
                                                    onClick={() => { audioManager.playClick(); onChoice(choice); }}
                                                    onMouseEnter={() => (choice.condition ? choice.condition(stats) : true) && audioManager.playHover()}
                                                    className={`flex-1 border-2 md:border-4 border-white bg-black/20 text-white font-black text-[10px] md:text-sm leading-none uppercase transition-all flex flex-col items-center justify-center disabled:opacity-30 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] ${currentTheme.btn} hover:text-black active:translate-y-0.5 p-1`}
                                                >
                                                    <span className="px-1">{choice.text}</span>
                                                    {chance !== null && (
                                                        <span className={`text-[8px] md:text-[10px] font-black mt-1 ${getChanceColor(chance)}`}>
                                                        胜算:{chance}%
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-white/20 italic font-black text-xs md:text-lg uppercase tracking-widest border-2 border-dashed border-white/5 rounded">
                                {actionPoints > 0 ? "点击卡片开启冒险..." : "今日力竭，请点击迎接明日"}
                            </div>
                        )}
                    </footer>
                </section>
            </main>

            {/* Morning Event Modal */}
            {phase === 'MORNING_EVENT' && currentEvent && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white border-[6px] border-black p-0 max-w-lg w-full shadow-[15px_15px_0px_0px_black] animate-in overflow-hidden">
                    <div className="bg-black text-white p-3 flex justify-between items-center">
                    <span className="font-black italic uppercase tracking-widest text-xs flex items-center gap-2"><Sparkles size={14} className="text-amber-400"/> Morning Event</span>
                    <div className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-black uppercase tracking-tighter">不计入行动点</div>
                    </div>
                    
                    <div className="p-6">
                    {!eventResult ? (
                        <>
                        <h2 className="text-2xl md:text-4xl font-black mb-4 uppercase leading-none italic">{currentEvent.title}</h2>
                        <p className="text-sm md:text-base font-bold text-stone-600 mb-8 border-l-4 border-stone-200 pl-4 py-2 bg-stone-50 leading-relaxed">{currentEvent.description}</p>
                        <div className="space-y-3">
                            {currentEvent.choices.map(choice => (
                            <button 
                                key={choice.id}
                                onClick={() => { audioManager.playClick(); onChoice(choice); }}
                                onMouseEnter={() => audioManager.playHover()}
                                className="w-full p-4 bg-white border-[4px] border-black text-left font-black text-sm md:text-lg hover:bg-amber-100 transition-colors shadow-[4px_4px_0px_0px_black] active:translate-y-1 flex justify-between items-center group"
                            >
                                {choice.text}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            ))}
                        </div>
                        </>
                    ) : (
                        <div className="text-center py-4 animate-in">
                        <div className={`mx-auto w-16 h-16 flex items-center justify-center mb-6 border-4 border-black shadow-[6px_6px_0px_0px_black] ${eventResult.success ? 'bg-emerald-400' : 'bg-rose-500 text-white'}`}>
                            {eventResult.success ? <Check size={32} strokeWidth={4} /> : <AlertCircle size={32} strokeWidth={4} />}
                        </div>
                        <p className="text-lg md:text-xl font-black mb-6 leading-tight">{eventResult.message}</p>
                        
                        {eventResult.changes && (
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {Object.entries(eventResult.changes).map(([k, v], i) => (
                                <span key={k} className={`px-2 py-1 border-2 border-black font-black text-xs md:text-sm ${Number(v) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {STAT_LABELS[k] || k}: {Number(v) > 0 ? '+' : ''}{v}
                                </span>
                            ))}
                            </div>
                        )}

                        <button 
                            onClick={() => { audioManager.playClick(); onSetPhase('ACTION_SELECTION'); onSetEventResult(null); onSetEvent(null); }}
                            onMouseEnter={() => audioManager.playHover()}
                            className="w-full py-4 bg-black text-white font-black text-xl border-4 border-black hover:bg-stone-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] active:translate-y-1 uppercase tracking-widest"
                        >
                            开始今日自由行动
                        </button>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            )}
        </div>
    );
};
