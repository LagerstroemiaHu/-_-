
import React, { useState, useEffect } from 'react';
import { GameStats, GamePhase, GameEvent, Choice, LogEntry, GameStage, EndingType, Character, NightThought } from './types';
import { RANDOM_EVENTS, RANDOM_EVENTS_EXTRA, DAILY_ACTIONS, STORY_QUESTS, CHARACTERS, SUDDEN_EVENTS, SIDE_STORIES, NIGHT_THOUGHTS } from './data/events';
import Gallery from './components/Gallery';
import { TitleScreen } from './components/phases/TitleScreen';
import { Prologue } from './components/phases/Prologue';
import { Rebirth } from './components/phases/Rebirth';
import { CharacterSelect } from './components/phases/CharacterSelect';
import { MainGame } from './components/phases/MainGame';
import { EndGame } from './components/phases/EndGame';
import { pick } from './data/utils';
import { audioManager } from './utils/audio';
import { X, Menu, FileDown, FileUp, Play, Trophy, Home, RefreshCw, Clock, Trash2, Type } from 'lucide-react';

const MAX_DAYS = 15;

const STAT_LABELS: Record<string, string> = {
  health: '健康', satiety: '饱腹', hissing: '哈气', smarts: '智力'
};

// --- Save System Interfaces ---
interface SaveData {
  day: number;
  stats: GameStats;
  stage: GameStage;
  completedEventIds: string[];
  completedAt: Record<string, number>;
  history: string[];
  currentQuestIndex: number;
  actionPoints: number;
  dailyActionsTaken: string[];
  logs: LogEntry[];
  lastRandomEventId: string | null;
  character: Character | null; 
  seenNightThoughtIds: string[];
  timestamp: number;
  version: string;
}

interface SaveSlotMetadata {
  id: string;
  isEmpty: boolean;
  day?: number;
  stage?: GameStage;
  date?: string;
  stats?: GameStats;
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('START');
  const [day, setDay] = useState(1);
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<GameStats>(CHARACTERS[0].initialStats);
  const [stage, setStage] = useState<GameStage>('STRAY');
  const [completedEventIds, setCompletedEventIds] = useState<string[]>([]);
  const [completedAt, setCompletedAt] = useState<Record<string, number>>({}); 
  const [history, setHistory] = useState<string[]>([]);
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0); 
  const [actionPoints, setActionPoints] = useState(3);
  const [dailyActionsTaken, setDailyActionsTaken] = useState<string[]>([]);
  const [ending, setEnding] = useState<EndingType | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [lastRandomEventId, setLastRandomEventId] = useState<string | null>(null);
  const [eventResult, setEventResult] = useState<{message: string, success: boolean, changes?: Partial<GameStats>} | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeEffect, setActiveEffect] = useState<any>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isImpactShaking, setIsImpactShaking] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);
  
  // Font Size State (Percentage: 100 = default)
  const [fontScale, setFontScale] = useState(() => {
    const saved = localStorage.getItem('cat_font_scale');
    return saved ? parseInt(saved) : 100;
  });

  // Night Thought State
  const [currentNightThought, setCurrentNightThought] = useState<NightThought | null>(null);
  const [seenNightThoughtIds, setSeenNightThoughtIds] = useState<string[]>([]);

  // Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<'main' | 'save' | 'load'>('main');
  
  const [isStageTransitioning, setIsStageTransitioning] = useState(false);
  const [isShutterActive, setIsShutterActive] = useState(false);

  const [unlockedEndings, setUnlockedEndings] = useState<EndingType[]>(() => {
    const saved = localStorage.getItem('cat_endings');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewGallery, setViewGallery] = useState(false);

  // --- Font Scale Effect ---
  useEffect(() => {
    // Tailwind uses rems (relative to root font size).
    // Default browser font-size is usually 16px.
    // Setting percentage scales everything nicely.
    document.documentElement.style.fontSize = `${fontScale}%`;
    localStorage.setItem('cat_font_scale', fontScale.toString());
  }, [fontScale]);

  // --- Audio Management Effect ---
  useEffect(() => {
    if (phase === 'START') {
        audioManager.playBgm('title');
    } else if (phase === 'PROLOGUE') {
        audioManager.playBgm('prologue');
    } else if (phase === 'GAME_OVER' || phase === 'VICTORY') {
        audioManager.playBgm('ending');
    } else if (phase === 'REBIRTH' || phase === 'CHARACTER_SELECT') {
         // Keep previous or play title
         audioManager.playBgm('title');
    } else {
        // Main Game Loop: Grouped BGM Logic
        if (stage === 'STRAY' || stage === 'CAT_LORD') {
             audioManager.playBgm('stray');
        } else if (stage === 'MANSION' || stage === 'CELEBRITY') {
             audioManager.playBgm('mansion');
        }
    }
  }, [phase, stage]);

  // --- Auto Save Effect ---
  useEffect(() => {
    if (phase !== 'START' && phase !== 'PROLOGUE' && phase !== 'REBIRTH' && phase !== 'CHARACTER_SELECT' && phase !== 'GAME_OVER' && phase !== 'VICTORY' && character) {
        const saveData: SaveData = {
            day, stats, stage, completedEventIds, completedAt, history, 
            currentQuestIndex, actionPoints, dailyActionsTaken, logs, lastRandomEventId, character,
            seenNightThoughtIds,
            timestamp: Date.now(),
            version: '1.0.4'
        };
        localStorage.setItem('cat_adventure_autosave', JSON.stringify(saveData));
    }
  }, [day, stats, stage, completedEventIds, completedAt, history, currentQuestIndex, actionPoints, dailyActionsTaken, logs, lastRandomEventId, character, seenNightThoughtIds, phase]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [{ day, message, type }, ...prev].slice(0, 30));
  };

  const updateStats = (changes: Partial<GameStats>) => {
    setStats(prev => {
      const next = { ...prev };
      (Object.keys(changes) as Array<keyof GameStats>).forEach(key => {
        if (changes[key] !== undefined) {
          next[key] = Math.max(0, Math.min(100, next[key] + changes[key]!));
        }
      });
      return next;
    });
  };

  const checkImmediateEndings = (currentStats: GameStats) => {
    if (currentStats.health <= 0 || currentStats.satiety <= 0) { finishGame('STARVED'); return true; }
    if (currentStats.hissing <= 0) { finishGame('DOMESTICATED'); return true; }
    return false;
  };

  const finishGame = (type: EndingType) => {
    setEnding(type);
    setPhase('GAME_OVER');
    setUnlockedEndings(prev => {
      if (prev.includes(type)) return prev;
      const next = [...prev, type];
      localStorage.setItem('cat_endings', JSON.stringify(next));
      return next;
    });
  };

  // --- SAVE / LOAD SYSTEM ---
  const getSaveSlotKey = (slotId: number) => `cat_adventure_save_slot_${slotId}`;

  const getSaveSlotsMetadata = (): SaveSlotMetadata[] => {
      const slots: SaveSlotMetadata[] = [];
      for (let i = 1; i <= 3; i++) {
          const key = getSaveSlotKey(i);
          const raw = localStorage.getItem(key);
          if (raw) {
              try {
                  const data: SaveData = JSON.parse(raw);
                  slots.push({
                      id: key,
                      isEmpty: false,
                      day: data.day,
                      stage: data.stage,
                      date: new Date(data.timestamp).toLocaleString(),
                      stats: data.stats
                  });
              } catch (e) {
                  slots.push({ id: key, isEmpty: true });
              }
          } else {
              slots.push({ id: key, isEmpty: true });
          }
      }
      return slots;
  };

  const saveToSlot = (slotId: number) => {
    const saveData: SaveData = {
      day, stats, stage, completedEventIds, completedAt, history, 
      currentQuestIndex, actionPoints, dailyActionsTaken, logs, lastRandomEventId, character,
      seenNightThoughtIds,
      timestamp: Date.now(),
      version: '1.0.4'
    };
    localStorage.setItem(getSaveSlotKey(slotId), JSON.stringify(saveData));
    addLog(`游戏已保存至存档 ${slotId}`, 'success');
    audioManager.playSfx('success');
    setIsMenuOpen(false);
  };

  const loadGameData = (data: SaveData) => {
      setDay(data.day);
      setStats(data.stats);
      setStage(data.stage);
      setCompletedEventIds(data.completedEventIds);
      setCompletedAt(data.completedAt || {});
      setHistory(data.history);
      setCurrentQuestIndex(data.currentQuestIndex);
      setActionPoints(data.actionPoints);
      setDailyActionsTaken(data.dailyActionsTaken);
      setLogs(data.logs);
      setLastRandomEventId(data.lastRandomEventId || null);
      if (data.character) setCharacter(data.character);
      setSeenNightThoughtIds(data.seenNightThoughtIds || []);
      
      setPhase('ACTION_SELECTION');
      audioManager.playSfx('page_flip');
      setIsMenuOpen(false);
  };

  const loadFromSlot = (slotId: number) => {
    const saved = localStorage.getItem(getSaveSlotKey(slotId));
    if (!saved) return;
    try {
        const data: SaveData = JSON.parse(saved);
        loadGameData(data);
        addLog(`已读取存档 ${slotId}`, 'success');
    } catch (e) {
        alert('存档损坏，无法读取');
    }
  };

  const continueLatestGame = () => {
       audioManager.init(); // Initialize audio context
       audioManager.playClick();
       
       const slots = getSaveSlotsMetadata();
       const manualSaves = slots.filter(s => !s.isEmpty);
       let latestSave: { data: SaveData, timestamp: number } | null = null;

       manualSaves.forEach(s => {
           try {
               const raw = localStorage.getItem(s.id);
               if(raw) {
                   const d = JSON.parse(raw);
                   if (!latestSave || d.timestamp > latestSave.timestamp) {
                       latestSave = { data: d, timestamp: d.timestamp };
                   }
               }
           } catch(e) {}
       });

       const autoRaw = localStorage.getItem('cat_adventure_autosave');
       if (autoRaw) {
           try {
               const autoData = JSON.parse(autoRaw);
               if (!latestSave || autoData.timestamp > latestSave.timestamp) {
                   latestSave = { data: autoData, timestamp: autoData.timestamp };
               }
           } catch(e) {}
       }

       if (latestSave) {
           loadGameData(latestSave.data);
           addLog('已恢复至最近进度', 'success');
       } else {
           alert('暂无存档记录');
       }
  };

  const returnToTitle = () => {
      audioManager.playClick();
      if (character) {
          const saveData: SaveData = {
              day, stats, stage, completedEventIds, completedAt, history, 
              currentQuestIndex, actionPoints, dailyActionsTaken, logs, lastRandomEventId, character,
              seenNightThoughtIds,
              timestamp: Date.now(),
              version: '1.0.4'
          };
          localStorage.setItem('cat_adventure_autosave', JSON.stringify(saveData));
      }
      setPhase('START');
      setIsMenuOpen(false);
      setMenuTab('main');
  };

  const deleteSaveSlot = (slotId: number) => {
      if (confirm('确定要删除这个存档吗？此操作不可逆。')) {
          localStorage.removeItem(getSaveSlotKey(slotId));
          audioManager.playSfx('fail');
          setMenuTab('main'); 
          setTimeout(() => setMenuTab('save'), 0);
      }
  }

  // --- START GAME LOGIC ---
  const handleStartGame = () => {
      audioManager.init(); // Initialize audio context
      audioManager.playClick();
      
      const hasSeenPrologue = localStorage.getItem('cat_prologue_seen') === 'true';
      if (!hasSeenPrologue) {
          setPhase('PROLOGUE');
      } else {
          setPhase('CHARACTER_SELECT');
      }
  };
  
  const handleRebirthSign = () => {
      audioManager.playSfx('page_flip');
      setCharacter(CHARACTERS[0]); 
      startDay(1);
  };

  const startDay = (currentDay: number) => {
    if (stats.smarts <= 0) { finishGame('STUPID'); return; }
    setDay(currentDay);
    setActionPoints(3);
    setDailyActionsTaken([]); 
    setCurrentNightThought(null);
    
    const allRandomEvents = [...RANDOM_EVENTS, ...RANDOM_EVENTS_EXTRA];

    const validRandomEvents = allRandomEvents.filter(e => 
      !completedEventIds.includes(e.id) && 
      e.id !== lastRandomEventId && 
      (!e.allowedStages || e.allowedStages.includes(stage))
    );
    
    if (validRandomEvents.length > 0) {
      const randomEvt = validRandomEvents[Math.floor(Math.random() * validRandomEvents.length)];
      setCurrentEvent(randomEvt);
      setLastRandomEventId(randomEvt.id); 
      setEventResult(null);
      setPhase('MORNING_EVENT');
      addLog(`晨间际遇：${randomEvt.title}`, 'info');
      audioManager.playSfx('page_flip');
    } else {
      setPhase('ACTION_SELECTION');
      setCurrentEvent(null);
      setEventResult(null);
    }
  };

  const handleChoice = (choice: Choice) => {
    if (phase === 'ACTION_SELECTION' && currentEvent && (currentEvent.type === 'DAILY' || currentEvent.type === 'STAGE' || currentEvent.type === 'SIDE_QUEST')) {
      setActionPoints(prev => prev - 1);
      if (currentEvent.type === 'DAILY') setDailyActionsTaken(prev => [...prev, currentEvent.id]);
    }

    const { changes, message, success, effectType, stageUnlock, retry, sound } = choice.effect(stats);
    updateStats(changes);
    
    // Play sound based on result or custom sound
    if (sound) {
        audioManager.playSfx(sound as any);
    } else {
        if (success) {
            if (stageUnlock) audioManager.playSfx('shutter');
            else if (effectType === 'heal' || effectType === 'sleep') audioManager.playSfx('success');
            else audioManager.playSfx('click');
        } else {
            if (effectType === 'damage') audioManager.playSfx('fail');
            else audioManager.playSfx('click');
        }
    }
    
    if (retry && currentEvent) {
        setCurrentEvent(prev => prev ? ({
            ...prev,
            choices: prev.choices.filter(c => c.id !== choice.id)
        }) : null);
        addLog(message, 'warning');
        return; 
    }
    
    if (currentEvent) {
        if (success) {
            setCompletedEventIds(prev => [...prev, currentEvent.id]);
            setCompletedAt(prev => ({ ...prev, [currentEvent.id]: day })); 
        }
        setHistory(prev => [...prev, currentEvent.id, choice.id]);
    }

    if (success && stageUnlock) {
        setIsStageTransitioning(true);
        setIsShutterActive(true);

        setTimeout(() => {
            setStage(stageUnlock);
            setCurrentQuestIndex(prev => prev + 1);
            addLog(`阶段进阶：${stageUnlock}`, 'success');
        }, 850); 

        setTimeout(() => {
            setIsShutterActive(false);
        }, 1200);

        setTimeout(() => {
            setIsFlashActive(true);
            setIsImpactShaking(true);
            audioManager.playSfx('impact');
            setTimeout(() => {
                setIsFlashActive(false);
                setIsImpactShaking(false);
                setIsStageTransitioning(false);
            }, 500);
        }, 1150); 
    }

    setEventResult({ message, success, changes });
    addLog(message, success ? 'success' : 'danger');
    
    if (changes.health && changes.health < 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 250);
      setActiveEffect({ type: 'damage', color: 'red' });
    } else if (effectType === 'heal' || (changes.health && changes.health > 0)) {
      setActiveEffect({ type: 'heal', color: 'green' });
    } else if (changes.satiety && changes.satiety > 0) {
      setActiveEffect({ type: 'eat', color: 'amber' });
    } else if (effectType === 'sleep') {
      setActiveEffect({ type: 'sleep', color: 'indigo' });
    }
    
    setTimeout(() => setActiveEffect(null), 600);
  };

  const endDay = () => {
    if (checkImmediateEndings(stats)) return;
    
    const availableThoughts = NIGHT_THOUGHTS.filter(t => t.stage === stage && !seenNightThoughtIds.includes(t.id));
    const specificThoughts = availableThoughts.filter(t => t.condition && t.condition(stats, history, dailyActionsTaken));
    
    let selectedThought: NightThought | null = null;
    if (specificThoughts.length > 0) {
        selectedThought = pick(specificThoughts);
    } else if (availableThoughts.length > 0) {
        selectedThought = pick(availableThoughts.filter(t => !t.condition));
    }
    
    if (selectedThought) {
        setCurrentNightThought(selectedThought);
        setSeenNightThoughtIds(prev => [...prev, selectedThought!.id]);
    } else {
        setCurrentNightThought(null);
    }

    setPhase('NIGHT_SUMMARY');
    updateStats({ satiety: -15 });
  };

  const handleResolutionComplete = () => {
    if(checkImmediateEndings(stats)) return; 
    
    const sudden = SUDDEN_EVENTS.find(e => !completedEventIds.includes(e.id) && e.autoTriggerCondition?.(day, stats, stage));
    if (sudden) {
        setCurrentEvent(sudden);
        setEventResult(null);
        audioManager.playSfx('page_flip');
    } else {
        setCurrentEvent(null); 
        setEventResult(null);
        if (actionPoints === 0) endDay();
    }
  };

  const resetGame = () => {
      audioManager.playClick();
      setPhase('START');
      setDay(1);
      setStats(CHARACTERS[0].initialStats);
      setStage('STRAY');
      setCompletedEventIds([]);
      setCompletedAt({});
      setHistory([]);
      setCurrentQuestIndex(0);
      setEnding(null);
      setLogs([]);
      setLastRandomEventId(null);
      setIsMenuOpen(false);
      setCurrentNightThought(null);
      setSeenNightThoughtIds([]);
  };

  // Pre-calculate actions for MainGame
  const allPotentialActions = [
      ...STORY_QUESTS.filter((q, i) => i === currentQuestIndex && !completedEventIds.includes(q.id)),
      ...SIDE_STORIES.filter(s => !completedEventIds.includes(s.id) && (!s.allowedStages || s.allowedStages.includes(stage))),
      ...DAILY_ACTIONS.filter(a => (!a.allowedStages || a.allowedStages.includes(stage)) && (!a.excludedStages || !a.excludedStages.includes(stage)))
  ];

  const unlockedActionsRaw = allPotentialActions.filter(a => !a.unlockCondition || a.unlockCondition(day, stats, completedEventIds, history, completedAt).unlocked);
  // Simple sort to keep it consistent
  const unlockedActions = [...unlockedActionsRaw].sort((a, b) => a.type === 'STAGE' ? -1 : 1);

  const lockedActions = allPotentialActions.filter(a => {
      if (!a.unlockCondition) return false;
      const res = a.unlockCondition(day, stats, completedEventIds, history, completedAt);
      if (res.unlocked) return false;
      if (res.reason && (res.reason.includes('前置') || res.reason.includes('完成') || res.reason.includes('后置'))) return false;
      return true;
  });

  if (viewGallery) {
    return <Gallery unlockedEndings={unlockedEndings} onBack={() => { audioManager.playClick(); setViewGallery(false); }} />;
  }

  // --- MENU MODAL (Global) ---
  const MenuModal = () => (
      isMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-[6px] border-black p-0 w-full max-w-lg shadow-[10px_10px_0px_0px_black] animate-in flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center px-4 py-3 border-b-4 border-black bg-stone-100">
              <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                {menuTab === 'main' ? 'PAUSED' : menuTab === 'save' ? '保存进度 (SAVE)' : '读取进度 (LOAD)'}
              </h2>
              <button onClick={() => { audioManager.playClick(); setIsMenuOpen(false); }} onMouseEnter={() => audioManager.playHover()}><X size={24} strokeWidth={3}/></button>
            </div>

            <div className="flex border-b-4 border-black bg-white">
                <button onClick={() => { audioManager.playClick(); setMenuTab('main'); }} onMouseEnter={() => audioManager.playHover()} className={`flex-1 py-3 font-black uppercase text-sm md:text-base flex items-center justify-center gap-2 ${menuTab === 'main' ? 'bg-amber-400' : 'bg-stone-200 text-stone-500 hover:bg-stone-300'}`}><Menu size={16}/> 菜单</button>
                <button onClick={() => { audioManager.playClick(); setMenuTab('save'); }} onMouseEnter={() => audioManager.playHover()} className={`flex-1 py-3 font-black uppercase text-sm md:text-base flex items-center justify-center gap-2 ${menuTab === 'save' ? 'bg-emerald-400' : 'bg-stone-200 text-stone-500 hover:bg-stone-300'}`}><FileDown size={16}/> 存档</button>
                <button onClick={() => { audioManager.playClick(); setMenuTab('load'); }} onMouseEnter={() => audioManager.playHover()} className={`flex-1 py-3 font-black uppercase text-sm md:text-base flex items-center justify-center gap-2 ${menuTab === 'load' ? 'bg-blue-400' : 'bg-stone-200 text-stone-500 hover:bg-stone-300'}`}><FileUp size={16}/> 读档</button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto no-scrollbar bg-white">
              {menuTab === 'main' && (
                <div className="space-y-3">
                  <div className="text-center mb-6">
                      <div className="inline-block border-4 border-black p-2 bg-stone-100 mb-2">
                          <img src={character?.avatar} className="w-16 h-16 object-cover grayscale" />
                      </div>
                      <p className="font-black text-lg">第 {day} 天</p>
                      <p className="text-xs font-bold text-stone-500 uppercase">{stage}</p>
                  </div>
                  
                  {/* Font Size Settings */}
                  <div className="bg-stone-100 border-2 border-black p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Type size={16} />
                        <span className="font-black text-sm uppercase">字体大小 (Font Size)</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { audioManager.playClick(); setFontScale(100); }} className={`flex-1 py-1 font-bold border-2 border-black ${fontScale === 100 ? 'bg-black text-white' : 'bg-white hover:bg-stone-200'}`}>
                            默认
                        </button>
                        <button onClick={() => { audioManager.playClick(); setFontScale(115); }} className={`flex-1 py-1 font-bold border-2 border-black text-lg ${fontScale === 115 ? 'bg-black text-white' : 'bg-white hover:bg-stone-200'}`}>
                            中
                        </button>
                        <button onClick={() => { audioManager.playClick(); setFontScale(130); }} className={`flex-1 py-1 font-bold border-2 border-black text-xl ${fontScale === 130 ? 'bg-black text-white' : 'bg-white hover:bg-stone-200'}`}>
                            大
                        </button>
                      </div>
                  </div>

                  <button onClick={() => { audioManager.playClick(); setIsMenuOpen(false); }} onMouseEnter={() => audioManager.playHover()} className="w-full py-4 bg-black text-white font-black text-xl border-4 border-transparent hover:border-black hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest active:translate-y-1 transition-all">
                    <Play size={20} fill="currentColor" /> 继续游戏
                  </button>
                  <button onClick={() => { audioManager.playClick(); setIsMenuOpen(false); setViewGallery(true); }} onMouseEnter={() => audioManager.playHover()} className="w-full py-3 bg-amber-400 border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 active:translate-y-1">
                    <Trophy size={20}/> 成就图鉴
                  </button>
                  <button onClick={returnToTitle} onMouseEnter={() => audioManager.playHover()} className="w-full py-3 bg-stone-100 border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 active:translate-y-1 mt-4 hover:bg-stone-200">
                    <Home size={20}/> 返回标题 (保存退出)
                  </button>
                  <button onClick={() => { if(confirm('确定要重置当前进度吗？未保存的进度将丢失。')) resetGame(); }} onMouseEnter={() => audioManager.playHover()} className="w-full py-3 bg-rose-100 text-rose-600 border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 active:translate-y-1 mt-2">
                    <RefreshCw size={20}/> 放弃进度 (重开)
                  </button>
                </div>
              )}

              {(menuTab === 'save' || menuTab === 'load') && (
                  <div className="space-y-4">
                      {getSaveSlotsMetadata().map((slot, index) => (
                          <div key={slot.id} className={`border-4 border-black p-3 relative transition-all ${!slot.isEmpty ? 'bg-white' : 'bg-stone-100 opacity-80'} ${menuTab === 'load' && slot.isEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[4px_4px_0px_0px_black] active:translate-y-0.5'}`}>
                              <button 
                                  onClick={() => {
                                      audioManager.playClick();
                                      const slotNum = index + 1;
                                      if (menuTab === 'save') {
                                          if (slot.isEmpty || confirm(`确定要覆盖存档 ${slotNum} 吗？`)) {
                                              saveToSlot(slotNum);
                                          }
                                      } else {
                                          if (!slot.isEmpty) loadFromSlot(slotNum);
                                      }
                                  }}
                                  onMouseEnter={() => audioManager.playHover()}
                                  disabled={menuTab === 'load' && slot.isEmpty}
                                  className="w-full text-left"
                              >
                                  <div className="flex justify-between items-start mb-2">
                                      <span className="font-black text-xs bg-black text-white px-1.5 py-0.5 uppercase">SLOT {index + 1}</span>
                                      {!slot.isEmpty && <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1"><Clock size={10}/> {slot.date}</span>}
                                  </div>
                                  
                                  {slot.isEmpty ? (
                                      <div className="h-12 flex items-center justify-center text-stone-400 font-bold italic border-2 border-dashed border-stone-300">
                                          --- 空存档位 ---
                                      </div>
                                  ) : (
                                      <div className="flex gap-3">
                                          <div className="flex-1">
                                              <p className="font-black text-lg leading-none mb-1">第 {slot.day} 天</p>
                                              <p className="text-xs font-bold text-amber-600 uppercase mb-2">{slot.stage}</p>
                                              <div className="flex gap-1">
                                                  {slot.stats && Object.entries(slot.stats).map(([k, v]) => (
                                                      <span key={k} className="text-[8px] px-1 bg-stone-100 border border-stone-300 text-stone-600 rounded">
                                                          {STAT_LABELS[k]}:{v}
                                                      </span>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </button>
                              
                              {!slot.isEmpty && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); audioManager.playClick(); deleteSaveSlot(index + 1); }}
                                    onMouseEnter={() => audioManager.playHover()}
                                    className="absolute bottom-3 right-3 p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded border border-transparent hover:border-rose-200 transition-colors"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                              )}
                          </div>
                      ))}
                  </div>
              )}
            </div>
          </div>
        </div>
      )
  );

  return (
    <>
      {phase === 'START' && (
        <TitleScreen onStart={handleStartGame} onContinue={continueLatestGame} onGallery={() => { audioManager.playClick(); setViewGallery(true); }} />
      )}
      
      {phase === 'PROLOGUE' && (
        <Prologue onComplete={() => { localStorage.setItem('cat_prologue_seen', 'true'); setPhase('REBIRTH'); }} />
      )}
      
      {phase === 'REBIRTH' && (
        <Rebirth character={CHARACTERS[0]} onSign={handleRebirthSign} />
      )}
      
      {phase === 'CHARACTER_SELECT' && (
        <CharacterSelect characters={CHARACTERS} onSelect={(c) => { setCharacter(c); startDay(1); }} />
      )}
      
      {(phase === 'MORNING_EVENT' || phase === 'ACTION_SELECTION' || phase === 'NIGHT_SUMMARY') && (
        <MainGame 
            phase={phase}
            day={day}
            maxDays={MAX_DAYS}
            stats={stats}
            character={character}
            stage={stage}
            logs={logs}
            actionPoints={actionPoints}
            dailyActionsTaken={dailyActionsTaken}
            currentEvent={currentEvent}
            eventResult={eventResult}
            activeEffect={activeEffect}
            isShaking={isShaking}
            isImpactShaking={isImpactShaking}
            isFlashActive={isFlashActive}
            isStageTransitioning={isStageTransitioning}
            isShutterActive={isShutterActive}
            currentNightThought={currentNightThought}
            unlockedActions={unlockedActions}
            lockedActions={lockedActions}
            
            onMenuOpen={() => { audioManager.playClick(); setIsMenuOpen(true); setMenuTab('main'); }}
            onChoice={handleChoice}
            onResolutionComplete={handleResolutionComplete}
            onStartDay={(d) => startDay(d)}
            onFinishGame={() => finishGame('OLD_CAT')}
            onSetEvent={setCurrentEvent}
            onSetEventResult={setEventResult}
            onUpdateStats={updateStats}
            onSetDay={setDay}
            onSetPhase={setPhase}
        />
      )}
      
      {(phase === 'GAME_OVER' || phase === 'VICTORY') && (
        <EndGame 
            ending={ending} 
            isVictory={phase === 'VICTORY'} 
            onReset={resetGame} 
            onGallery={() => { audioManager.playClick(); setViewGallery(true); }} 
        />
      )}

      <MenuModal />
    </>
  );
}
