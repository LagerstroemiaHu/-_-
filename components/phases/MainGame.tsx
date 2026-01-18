
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
  MessageSquareQuote, Volume2, VolumeX, Battery, BatteryWarning, Share2, Skull, Trophy, Ghost, CloudRain
} from 'lucide-react';
import { TextScale } from '../../App';

// Theme maps copied from App.tsx
const STAT_THEME_MAP: Record<string, { gridBg: string, footerBg: string, border: string, btn: string }> = {
  '健康': { gridBg: 'bg-rose-500', footerBg: 'bg-rose-950', border: 'border-rose-500', btn: 'hover:bg-rose-500' },
  '饱腹': { gridBg: 'bg-amber-500', footerBg: 'bg-amber-950', border: 'border-amber-500', btn: 'hover:bg-amber-500' },
  '哈气': { gridBg: 'bg-purple-600', footerBg: 'bg-purple-950', border: 'border-purple-500', btn: 'hover:bg-purple-500' },
  '智力': { gridBg: 'bg-blue-500', footerBg: 'bg-blue-950', border: 'border-blue-500', btn: 'hover:bg-blue-500' },
  'neutral': { gridBg: 'bg-stone-400', footerBg: 'bg-stone-900', border: 'border-stone-700', btn: 'hover:bg-stone-100' }
};

const STAT_TEXT_COLORS: Record<string, string> = {
    '健康': 'text-rose-400',
    '饱腹': 'text-amber-400',
    '哈气': 'text-purple-400',
    '智力': 'text-blue-400',
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

// Map to predict the next stage for the flip animation "Back" face
const NEXT_STAGE_MAP: Record<GameStage, GameStage> = {
    'STRAY': 'CAT_LORD',
    'CAT_LORD': 'MANSION',
    'MANSION': 'CELEBRITY',
    'CELEBRITY': 'CELEBRITY' // End of line
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

const getTextClasses = (scale: TextScale, type: 'log' | 'desc' | 'choice' | 'title' | 'night_title' | 'night_desc' | 'action_title' | 'footer_text' | 'locked_title' | 'locked_reason') => {
    const scales = {
        log: { small: 'text-[0.5rem] md:text-[0.65rem]', normal: 'text-[0.6rem] md:text-[0.75rem]', large: 'text-[0.7rem] md:text-[0.85rem]' },
        desc: { small: 'text-[0.65rem] md:text-[0.9rem]', normal: 'text-[0.75rem] md:text-[1rem]', large: 'text-[0.85rem] md:text-[1.1rem]' },
        choice: { small: 'text-[0.6rem] md:text-sm', normal: 'text-[0.7rem] md:text-base', large: 'text-[0.8rem] md:text-lg' },
        title: { small: 'text-2xl md:text-4xl', normal: 'text-3xl md:text-5xl', large: 'text-4xl md:text-6xl' },
        night_title: { small: 'text-xs md:text-sm', normal: 'text-sm md:text-base', large: 'text-base md:text-lg' },
        night_desc: { small: 'text-xs md:text-base', normal: 'text-sm md:text-lg', large: 'text-base md:text-xl' },
        action_title: { small: 'text-[0.75rem] md:text-[0.95rem]', normal: 'text-[0.85rem] md:text-[1.05rem]', large: 'text-[0.95rem] md:text-[1.2rem]' },
        footer_text: { small: 'text-[0.8rem] md:text-[1rem]', normal: 'text-[0.95rem] md:text-[1.2rem]', large: 'text-[1.1rem] md:text-[1.4rem]' },
        locked_title: { small: 'text-[0.5rem] md:text-[0.6rem]', normal: 'text-[0.6rem] md:text-[0.7rem]', large: 'text-[0.7rem] md:text-[0.8rem]' },
        locked_reason: { small: 'text-[0.4rem] md:text-[0.55rem]', normal: 'text-[0.5rem] md:text-[0.65rem]', large: 'text-[0.6rem] md:text-[0.75rem]' }
    };
    return scales[type][scale];
};

// Dynamic Avatar Resolver
export const getStageAvatar = (char: Character | null, currentStage: GameStage) => {
    if (char?.id === 'senior_cat') {
        switch(currentStage) {
            case 'STRAY': return '/pics/idle/stray.jpg';
            case 'CAT_LORD': return '/pics/idle/cat_lord.jpg';
            case 'MANSION': return '/pics/idle/mansion.jpg';
            case 'CELEBRITY': return '/pics/idle/celebrity.jpg';
            default: return '/pics/idle/stray.jpg';
        }
    }
    return char?.avatar;
};

// Helper component to render choice text with colored stat hints
const ColoredChoiceText: React.FC<{ text: string }> = ({ text }) => {
    // Matches patterns like "Some Text (++Health)" or "Some Text (+健康)"
    // Captures: 1. Main text, 2. Full hint, 3. Sign (+/-), 4. Stat Name
    const match = text.match(/(.*?)\s*(\(([+-]+)\s*(健康|饱腹|哈气|智力)\))$/);
    
    if (match) {
        const [_, mainText, fullHint, sign, statName] = match;
        const colorClass = STAT_TEXT_COLORS[statName] || 'text-white';
        return (
            <span className="px-1 block">
                {mainText} <span className={`${colorClass} font-black text-[0.8em] inline-block group-hover:animate-bounce`}>{fullHint}</span>
            </span>
        );
    }
    return <span className="px-1">{text}</span>;
};

// Helper to extract stat name from text string for highlighting
const getStatFromText = (text: string): string | null => {
    const match = text.match(/\(([+-]+)\s*(健康|饱腹|哈气|智力)\)/);
    return match ? match[2] : null;
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
    isGameOverTransitioning: boolean;
    currentNightThought: NightThought | null;
    gameOverText: string;
    
    // Actions derived from parent
    unlockedActions: GameEvent[];
    lockedActions: GameEvent[];
    
    // Pass scale
    textScale: TextScale;

    // Handlers
    onMenuOpen: () => void;
    onChoice: (choice: Choice) => void;
    onResolutionComplete: () => void;
    onStartDay: (day: number) => void;
    onFinishGame: () => void;
    onProceedToEnding: () => void; // New handler for clicking curtain
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
    isShaking, isImpactShaking, isFlashActive, isStageTransitioning, isShutterActive, isGameOverTransitioning,
    currentNightThought, unlockedActions, lockedActions, textScale, gameOverText,
    onMenuOpen, onChoice, onResolutionComplete, onStartDay, onFinishGame, onProceedToEnding,
    onSetEvent, onSetEventResult, onUpdateStats, onSetDay, onSetPhase
}) => {
    
    const [displayStage, setDisplayStage] = useState<GameStage>(stage);
    const [muted, setMuted] = useState(audioManager.isMuted);
    const [isExiting, setIsExiting] = useState(false);
    const [hoveredStat, setHoveredStat] = useState<string | null>(null);
    
    // Action Point Consumption Animation State
    const [consumingIndex, setConsumingIndex] = useState<number | null>(null);
    const prevActionPoints = useRef(actionPoints);

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

    // Action Points Consumption Animation Effect
    useEffect(() => {
        // If points decreased
        if (actionPoints < prevActionPoints.current) {
            setConsumingIndex(actionPoints);
            const timer = setTimeout(() => {
                setConsumingIndex(null);
            }, 1000); 
            return () => clearTimeout(timer);
        }
        prevActionPoints.current = actionPoints;
    }, [actionPoints]);

    // Low stats warning sound loop
    useEffect(() => {
        if ((stats.health < 30 || stats.satiety < 20) && !muted && phase !== 'START' && phase !== 'PROLOGUE') {
            if (!heartbeatRef.current) {
                audioManager.playSfx('heartbeat');
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

    // --- Animation Wrappers for Handlers ---
    const handleSetEvent = (event: GameEvent) => {
        audioManager.playClick();
        setIsExiting(true);
        setTimeout(() => {
            onSetEvent(event);
            onSetEventResult(null);
            setIsExiting(false);
        }, 200);
    };

    const handleChoice = (choice: Choice) => {
        audioManager.playClick();
        setHoveredStat(null); // Reset hover state on click
        setIsExiting(true);
        setTimeout(() => {
            onChoice(choice);
            setIsExiting(false);
        }, 200);
    };

    const handleResolution = () => {
        audioManager.playClick();
        setIsExiting(true);
        setTimeout(() => {
            onResolutionComplete();
            setIsExiting(false);
        }, 200);
    };

    const handleShare = () => {
        audioManager.playSfx('shutter');
        alert("📸 请自行截屏分享哦 (我才不会要你的相册权限呢)");
    };

    const currentTheme = getEventTheme(currentEvent);
    const feedbackText = eventResult ? eventResult.message : currentEvent?.description || "";
    
    const logTextClass = getTextClasses(textScale, 'log');
    const descTextClass = getTextClasses(textScale, 'desc');
    const choiceTextClass = getTextClasses(textScale, 'choice');
    const titleTextClass = getTextClasses(textScale, 'title');
    const nightTitleClass = getTextClasses(textScale, 'night_title');
    const nightDescClass = getTextClasses(textScale, 'night_desc');
    const actionTitleClass = getTextClasses(textScale, 'action_title');
    const footerTextClass = getTextClasses(textScale, 'footer_text');
    const lockedTitleClass = getTextClasses(textScale, 'locked_title');
    const lockedReasonClass = getTextClasses(textScale, 'locked_reason');

    const isVictoryCurtain = gameOverText.includes('传奇') || gameOverText.includes('达成');

    // Dynamic curtain styling for "Cute" vibe
    const curtainClass = isVictoryCurtain
        ? "bg-amber-400 border-b-[8px] border-amber-600" // Happy Yellow/Orange
        : "bg-stone-300 border-b-[8px] border-stone-500"; // Sad Rainy Grey (Concrete/Street vibe)

    return (
        <div className={`fixed inset-0 flex flex-col ${STAGE_BG_MAP[displayStage]} font-sans overflow-hidden border-[4px] md:border-[6px] border-black select-none transition-all duration-1000 ${isShaking ? 'animate-shake' : ''} ${isImpactShaking ? 'animate-impact' : ''}`}>
            <div className={`impact-flash ${isFlashActive ? 'flash-active' : ''}`} />
            
            <GMPanel stats={stats} day={day} onUpdateStats={onUpdateStats} onSetDay={onSetDay} onTriggerEvent={(e) => { onSetEvent(e); onSetEventResult(null); }} />

            <EffectsLayer isLowHealth={stats.health < 30} isLowSatiety={stats.satiety < 20} isLowWildness={stats.hissing < 15} activeEffect={activeEffect} />

            {/* Game Over Curtain - Enhanced UI (Cute/Non-Scary Version) */}
            <div 
                className={`curtain-top ${isGameOverTransitioning ? 'active cursor-pointer pointer-events-auto' : 'pointer-events-none'} ${curtainClass}`}
                onClick={() => { if(isGameOverTransitioning) onProceedToEnding(); }}
            >
                <div className={`
                    flex flex-col items-center justify-center p-8 border-[6px] 
                    ${isVictoryCurtain ? 'bg-white border-black text-black' : 'bg-white border-stone-500 text-stone-500'}
                    shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]
                    transform -rotate-1 rounded-sm max-w-lg w-[90%]
                `}>
                    {isVictoryCurtain ? (
                        <>
                            <Trophy size={80} className="mb-4 text-amber-500 drop-shadow-sm animate-bounce" strokeWidth={2.5} />
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 text-black">{gameOverText}</h1>
                            <p className="text-lg md:text-xl font-bold italic tracking-widest text-amber-600 bg-amber-100 px-4 py-1 transform rotate-1">流芳百世</p>
                        </>
                    ) : (
                        <>
                            {/* Replaced Skull with CloudRain/Ghost for "Cute Sadness" */}
                            <Ghost size={80} className="mb-4 text-stone-400 drop-shadow-sm animate-pulse" strokeWidth={2.5} />
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 text-stone-600">{gameOverText}</h1>
                            <p className="text-lg md:text-xl font-bold italic tracking-widest text-stone-400 bg-stone-100 px-4 py-1 transform rotate-1">喵生重来</p>
                        </>
                    )}
                </div>
                {/* Click to continue hint */}
                {isGameOverTransitioning && (
                    <div className="absolute bottom-16 md:bottom-24 text-black/50 dark:text-white/50 font-black text-sm uppercase tracking-widest animate-pulse transition-opacity duration-1000 delay-[1500ms]" style={{ opacity: isGameOverTransitioning ? 1 : 0 }}>
                        [ 点击屏幕继续 ]
                    </div>
                )}
            </div>

            <header className={`h-14 md:h-16 shrink-0 bg-white border-b-[4px] md:border-b-[6px] border-black flex items-stretch z-30 shadow-md ${isImpactShaking ? 'animate-impact' : ''}`}>
                <div className="flex items-center gap-1 shrink-0 border-r-[2px] md:border-r-[4px] border-black px-2 md:px-4 bg-stone-100 font-black">
                    <span className="text-lg md:text-2xl uppercase italic tracking-tighter">D{day}</span>
                </div>
                <div className="flex-1">
                    <StatsDisplay stats={stats} highlightedLabel={hoveredStat} />
                </div>
                <div className="flex items-center px-2 md:px-4 bg-stone-100 border-l-[2px] md:border-l-[4px] border-black gap-2">
                    <button onClick={toggleMute} onMouseEnter={() => audioManager.playHover()} className="h-8 md:h-10 w-8 md:w-10 flex items-center justify-center border-2 md:border-4 border-black bg-stone-200 font-black shadow-[2px_2px_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5 hover:bg-stone-300 click-shrink hover-wiggle">
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <button onClick={() => { audioManager.playClick(); onMenuOpen(); }} onMouseEnter={() => audioManager.playHover()} className="h-8 md:h-10 px-2 md:px-3 border-2 md:border-4 border-black bg-white font-black shadow-[2px_2px_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5 hover:bg-amber-400 click-shrink hover-wiggle">
                        <Menu size={18}/>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-black/5 p-2 md:p-3 gap-2 md:gap-3">
                <section className="w-full md:w-64 h-36 md:h-full shrink-0 flex flex-row md:flex-col gap-2 md:gap-3 z-20 overflow-hidden">
                    <div className={`flex-1 md:flex-[2.5] bg-white border-[4px] border-black p-1 md:p-3 shadow-[4px_4px_0px_0px_black] flex flex-col items-center justify-center overflow-hidden ${isImpactShaking ? 'animate-impact' : ''}`}>
                        <div className={`w-full aspect-square md:aspect-[3/4] border-[2px] md:border-[3px] border-black bg-stone-100 relative shadow-inner flip-container ${isStageTransitioning ? 'flip-active' : ''}`}>
                            <div className="flip-inner">
                                <div className="flip-face flip-front bg-stone-200">
                                    <img 
                                        src={getStageAvatar(character, stage)} 
                                        className="w-full h-full object-cover" 
                                        alt="Current Stage Avatar"
                                    />
                                </div>
                                <div className="flip-face flip-back bg-amber-400">
                                    {/* Show the predicted NEXT stage avatar on the back face during transition */}
                                    <img 
                                        src={getStageAvatar(character, NEXT_STAGE_MAP[stage])} 
                                        className="w-full h-full object-cover" 
                                        alt="Next Stage Avatar"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-0.5 md:mt-2 px-1 md:px-2 py-0.5 bg-black text-white font-black text-[0.4rem] md:text-[0.6rem] text-center uppercase tracking-widest w-full truncate italic leading-none">{stage}</div>
                    </div>

                    <div className={`flex-1 md:flex-1 bg-white border-[4px] border-black flex flex-col overflow-hidden shadow-[4px_4px_0px_0px_black] ${isImpactShaking ? 'animate-impact' : ''}`}>
                        <div className="bg-amber-400 text-black px-1 md:px-2 py-0.5 flex items-center shrink-0 border-b-[2px] md:border-b-[3px] border-black">
                            <span className="font-black text-[0.65rem] md:text-[0.8rem] uppercase flex items-center gap-1 tracking-tighter"><Eye size={12} /> 待解锁</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-1 md:p-1.5 space-y-1 md:space-y-1.5 no-scrollbar bg-stone-50">
                            {lockedActions.length > 0 ? lockedActions.map(action => (
                                <div key={action.id} className="p-0.5 md:p-1 border-[1.5px] border-dashed border-stone-400 bg-white opacity-60">
                                    <div className={`font-black text-stone-600 truncate uppercase leading-none ${lockedTitleClass}`}>{action.title}</div>
                                    <div className={`font-bold text-rose-500 italic mt-0.5 leading-tight truncate ${lockedReasonClass}`}>
                                        锁: {action.unlockCondition?.(day, stats, [], [], {}, {}).reason || '未达要求'}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-[0.6rem] md:text-[0.7rem] text-stone-400 font-black italic text-center p-2 uppercase">无远大志向</div>
                            )}
                        </div>
                    </div>

                    <div className={`flex-1 md:flex-1 bg-white border-[4px] border-black flex flex-col overflow-hidden shadow-[4px_4px_0px_0px_black] ${isImpactShaking ? 'animate-impact' : ''}`}>
                        <div className="bg-stone-800 text-white px-1 md:px-2 py-0.5 flex items-center shrink-0 border-b-[2px] md:border-b-[3px] border-black">
                            <span className="font-black text-[0.65rem] md:text-[0.8rem] uppercase flex items-center gap-1 tracking-tighter"><ScrollText size={12} /> 日志</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0.5 md:p-1.5 space-y-1 bg-white custom-scrollbar">
                            {logs.map((log, i) => (
                                <div key={i} className={`p-0.5 md:p-1 border-[1.5px] border-black bg-white font-black shadow-[1px_1px_0px_0px_black] leading-tight ${log.type === 'success' ? 'bg-emerald-50 border-emerald-500' : log.type === 'danger' ? 'bg-rose-50 border-rose-500' : ''} ${logTextClass}`}>
                                    <span className="text-stone-400">[{log.day}D]</span> {log.message}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={`flex-1 flex flex-col overflow-hidden bg-white/90 border-[4px] md:border-[6px] border-black shadow-[6px_6px_0px_0px_black] md:shadow-[8px_8px_0px_0px_black] transition-all duration-700 relative ${isImpactShaking ? 'animate-impact' : ''}`}>
                    {/* 新的幕布效果 */}
                    <div className={`curtain-container ${isShutterActive ? 'curtain-active' : ''}`}>
                        <div className="curtain-panel curtain-left"></div>
                        <div className="curtain-panel curtain-right"></div>
                        <div className="curtain-text">STAGE REBOOTING...</div>
                    </div>

                    <div className={`bg-stone-200 text-black px-4 py-2 font-black text-[0.7rem] md:text-[0.9rem] uppercase flex justify-between items-center shrink-0 border-b-[4px] border-stone-400 z-10 relative ${phase === 'NIGHT_SUMMARY' ? 'grayscale opacity-60' : ''}`}>
                        <span className="flex items-center gap-2"><Zap size={14} className="text-amber-600" /> 立即可行 (AVAILABLE)</span>
                        
                        {/* 改进后的行动点展示 */}
                        <div className="flex items-center gap-1.5 md:gap-2">
                             <span className="text-[0.6rem] md:text-[0.7rem] font-bold text-stone-500 uppercase tracking-wider mr-1">Energy</span>
                             <div className="flex gap-1">
                                 {[0, 1, 2].map(index => {
                                     const isActive = index < actionPoints;
                                     const isConsuming = index === consumingIndex;

                                     return (
                                         <div key={index} className="relative w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                                             <Zap size={20} className="absolute text-stone-300 opacity-30 scale-90" strokeWidth={3} />
                                             
                                             <Zap 
                                                 size={20} 
                                                 className={`
                                                     absolute transition-all duration-300 ease-out
                                                     ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
                                                     ${isActive ? 'text-amber-500 fill-amber-500 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]' : ''}
                                                 `}
                                                 strokeWidth={2.5}
                                             />
                                             
                                             {isConsuming && (
                                                <Zap 
                                                    size={20}
                                                    className="absolute text-rose-500 fill-rose-500 animate-[pulse_1s_ease-out_infinite] scale-110 drop-shadow-[0_0_4px_rgba(244,63,94,0.8)]"
                                                    strokeWidth={2.5}
                                                />
                                             )}
                                         </div>
                                     );
                                 })}
                             </div>
                        </div>
                    </div>
                    
                    <div className={`flex-1 overflow-y-auto p-2 md:p-4 no-scrollbar bg-stone-50/50 ${phase === 'NIGHT_SUMMARY' ? 'grayscale opacity-60 pointer-events-none' : ''}`}>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 content-start pb-10">
                            {unlockedActions.map(action => {
                                const isTaken = dailyActionsTaken.includes(action.id);
                                const actionTheme = getEventTheme(action);
                                const isStageAction = action.type === 'STAGE';
                                const isDisabled = isTaken || phase !== 'ACTION_SELECTION' || actionPoints <= 0;
                                const isGrayedOut = isTaken || actionPoints <= 0;

                                return (
                                    <button
                                        key={action.id}
                                        disabled={isDisabled}
                                        onClick={() => handleSetEvent(action)}
                                        onMouseEnter={() => {
                                            if (!isDisabled) {
                                                audioManager.playHover();
                                            }
                                        }}
                                        className={`
                                            w-full p-2 border-[3px] md:border-4 flex flex-col justify-center gap-1 text-center transition-all min-h-[50px] md:min-h-[70px] relative group
                                            ${currentEvent?.id === action.id ? 'translate-x-1 translate-y-1 shadow-none border-black ring-2 ring-white bg-amber-50' : 'shadow-[3px_3px_0px_0px_black] md:shadow-[5px_5px_0px_0px_black] bg-white'}
                                            ${isGrayedOut ? 'bg-stone-200 border-stone-400 opacity-40 grayscale' : `${actionTheme.border} ${isStageAction ? 'animate-pulse border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)] z-10' : 'hover:scale-[1.02] active:scale-95'}`}
                                            poly-button
                                        `}
                                    >
                                        <div className="flex items-center justify-center gap-2 w-full">
                                            <div className={`p-1.5 border-2 border-black transition-colors ${isGrayedOut ? 'bg-stone-400' : actionTheme.gridBg}`}>
                                                {isTaken ? <Check size={12} className="text-white" /> : getActionIcon(action.id, action.type)}
                                            </div>
                                            <div className={`font-black leading-none uppercase truncate flex-1 ${isStageAction ? 'text-amber-700' : ''} ${actionTitleClass}`}>
                                            {action.title}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <footer className={`shrink-0 text-white border-t-[4px] md:border-t-[6px] border-black p-2 md:p-4 flex flex-col gap-2 z-[60] transition-all duration-500 overflow-hidden h-auto min-h-[8rem] md:min-h-[10rem] ${phase === 'NIGHT_SUMMARY' ? 'bg-stone-900 grayscale-0 opacity-100' : currentTheme.footerBg} ${isImpactShaking ? 'animate-impact' : ''}`}>
                        {/* Footer content omitted for brevity, no changes */}
                        {phase === 'NIGHT_SUMMARY' ? (
                            <div className="h-full flex flex-col justify-between animate-in p-1">
                                <div className="flex-1 flex flex-col justify-center items-center text-center mb-2 md:mb-4 relative">
                                        <div className="absolute top-0 right-0 opacity-20"><Moon size={64} className="text-stone-100"/></div>
                                        {currentNightThought ? (
                                            <div className="w-full max-w-2xl bg-stone-800 border-l-4 border-amber-500 p-3 md:p-4 shadow-lg text-left relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-10"><MessageSquareQuote size={40} className="text-white"/></div>
                                                <h3 className={`font-black text-amber-500 uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2 ${nightTitleClass}`}>
                                                    <Zap size={12}/> {currentNightThought.title}
                                                </h3>
                                                <p className={`font-bold text-stone-300 italic leading-relaxed md:leading-relaxed ${nightDescClass}`}>
                                                    "{currentNightThought.content}"
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-stone-500 italic">夜色温柔，无梦到天明...</p>
                                        )}
                                </div>

                                <div className="flex items-center justify-between gap-4 border-t border-stone-700 pt-2 md:pt-4">
                                    <div className="text-left">
                                        <p className="text-stone-400 font-bold text-[0.55rem] md:text-[0.7rem] flex items-center gap-1"><AlertCircle size={10}/> 基础消耗：饱腹-15</p>
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
                                            click-shrink
                                        "
                                    >
                                        <span className="relative z-10">迎接明日</span>
                                        <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ) : currentEvent && phase !== 'MORNING_EVENT' ? (
                            <div 
                                className={`flex-1 flex flex-col h-full overflow-hidden ${isExiting ? 'animate-slide-out-bottom' : 'animate-slide-in-bottom'}`}
                                key={eventResult ? `res-${day}-${currentEvent.id}` : `evt-${day}-${currentEvent.id}`}
                            >
                                <div className={`flex items-center justify-between gap-2 bg-black/50 border-2 p-1.5 md:p-2 rounded shrink-0 h-auto min-h-[3rem] ${currentTheme.border}`}>
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <p className={`flex-1 font-black italic text-white leading-tight ${footerTextClass} ${currentEvent.id === 'sudden_carrot_tissue' && !eventResult ? 'blur-[4px] hover:blur-none transition-all cursor-help' : ''}`}>
                                        {feedbackText}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 shrink-0 ml-2">
                                        {eventResult?.changes && Object.entries(eventResult.changes).map(([k, v], i) => (
                                        <span key={i} className={`text-[0.5rem] md:text-[0.65rem] font-black px-1.5 py-0.5 border-2 border-black bg-black shadow-[1px_1px_0px_0px_white] ${Number(v) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {STAT_LABELS[k] || k}{Number(v) > 0 ? '+' : ''}{v}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="mt-1 md:mt-2 flex gap-2 h-14 md:h-18 shrink-0">
                                    {eventResult ? (
                                        <button 
                                            onClick={handleResolution} 
                                            onMouseEnter={() => audioManager.playHover()}
                                            className="flex-1 bg-white text-black font-black text-sm md:text-xl border-2 border-black hover:bg-amber-400 active:translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] transition-transform hover:scale-[1.01] active:scale-95 click-shrink"
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
                                                    onClick={() => handleChoice(choice)}
                                                    onMouseEnter={() => {
                                                        if (choice.condition ? choice.condition(stats) : true) {
                                                            audioManager.playHover();
                                                            const s = getStatFromText(choice.text);
                                                            if(s) setHoveredStat(s);
                                                        }
                                                    }}
                                                    onMouseLeave={() => setHoveredStat(null)}
                                                    className={`flex-1 border-2 md:border-4 border-white bg-black/20 text-white font-black leading-none uppercase transition-all flex flex-col items-center justify-center disabled:opacity-30 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] ${currentTheme.btn} hover:text-black active:translate-y-0.5 active:scale-95 hover:scale-105 p-1 ${choiceTextClass} click-shrink group`}
                                                >
                                                    <ColoredChoiceText text={choice.text} />
                                                    {chance !== null && (
                                                        <span className={`text-[0.5rem] md:text-[0.6rem] font-black mt-1 ${getChanceColor(chance)}`}>
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
                            <div className={`h-full flex items-center justify-center text-white/20 italic font-black text-xs md:text-lg uppercase tracking-widest border-2 border-dashed border-white/5 rounded ${isExiting ? 'animate-slide-out-bottom' : 'animate-slide-in-bottom'}`}>
                                {actionPoints > 0 ? "点击卡片开启冒险..." : "今日力竭，请点击迎接明日"}
                            </div>
                        )}
                    </footer>
                </section>
            </main>

            {/* Morning Event Modal (omitted, no changes) */}
            {phase === 'MORNING_EVENT' && currentEvent && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white border-[6px] border-black p-0 max-w-lg w-full shadow-[15px_15px_0px_0px_black] animate-in overflow-hidden">
                    <div className="bg-black text-white p-3 flex justify-between items-center">
                    <span className="font-black italic uppercase tracking-widest text-xs flex items-center gap-2"><Sparkles size={14} className="text-amber-400"/> Morning Event</span>
                    <button 
                        onClick={handleShare}
                        className="p-1 hover:bg-stone-800 rounded transition-colors text-stone-300 hover:text-white"
                        title="分享事件"
                    >
                        <Share2 size={16} />
                    </button>
                    </div>
                    
                    <div className="p-6">
                    {!eventResult ? (
                        <>
                        <h2 className={`font-black mb-4 uppercase leading-none italic ${titleTextClass}`}>{currentEvent.title}</h2>
                        <p className={`font-bold text-stone-600 mb-8 border-l-4 border-stone-200 pl-4 py-2 bg-stone-50 leading-relaxed ${descTextClass}`}>{currentEvent.description}</p>
                        <div className="space-y-3">
                            {currentEvent.choices.map(choice => (
                            <button 
                                key={choice.id}
                                onClick={() => handleChoice(choice)}
                                onMouseEnter={() => audioManager.playHover()}
                                className={`w-full p-4 bg-white border-[4px] border-black text-left font-black hover:bg-amber-100 transition-all shadow-[4px_4px_0px_0px_black] active:translate-y-1 active:shadow-none hover:scale-[1.02] flex justify-between items-center group ${choiceTextClass} click-shrink`}
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
                            className="w-full py-4 bg-black text-white font-black text-xl border-4 border-black hover:bg-stone-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] active:translate-y-1 active:scale-95 transition-all uppercase tracking-widest click-shrink"
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
