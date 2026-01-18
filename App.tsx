
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GameStats, GamePhase, GameEvent, Choice, LogEntry, GameStage, EndingType, Character, NightThought } from './types';
import { RANDOM_EVENTS, RANDOM_EVENTS_EXTRA, DAILY_ACTIONS, STORY_QUESTS, CHARACTERS, SUDDEN_EVENTS, SIDE_STORIES, NIGHT_THOUGHTS } from './data/events';
import Gallery from './components/Gallery';
import { TitleScreen } from './components/phases/TitleScreen';
import { Prologue } from './components/phases/Prologue';
import { Rebirth } from './components/phases/Rebirth';
import { CharacterSelect } from './components/phases/CharacterSelect';
import { MainGame, getStageAvatar } from './components/phases/MainGame';
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
  failedAt: Record<string, number>; // New: Track failure dates
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

export type TextScale = 'small' | 'normal' | 'large';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('START');
  const [day, setDay] = useState(1);
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<GameStats>(CHARACTERS[0].initialStats);
  const [stage, setStage] = useState<GameStage>('STRAY');
  const [completedEventIds, setCompletedEventIds] = useState<string[]>([]);
  const [completedAt, setCompletedAt] = useState<Record<string, number>>({}); 
  const [failedAt, setFailedAt] = useState<Record<string, number>>({}); // State for failures
  const [history, setHistory] = useState<string[]>([]);
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0); 
  const [actionPoints, setActionPoints] = useState(3);
  const [dailyActionsTaken, setDailyActionsTaken] = useState<string[]>([]);
  
  // Revised Ending State
  const [primaryEnding, setPrimaryEnding] = useState<EndingType | null>(null);
  const [earnedAchievements, setEarnedAchievements] = useState<EndingType[]>([]);

  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [lastRandomEventId, setLastRandomEventId] = useState<string | null>(null);
  const [eventResult, setEventResult] = useState<{message: string, success: boolean, changes?: Partial<GameStats>} | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeEffect, setActiveEffect] = useState<any>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isImpactShaking, setIsImpactShaking] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);
  
  const [textScale, setTextScale] = useState<TextScale>(() => {
    const saved = localStorage.getItem('cat_text_scale');
    return (saved as TextScale) || 'normal';
  });

  const [currentNightThought, setCurrentNightThought] = useState<NightThought | null>(null);
  const [seenNightThoughtIds, setSeenNightThoughtIds] = useState<string[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<'main' | 'save' | 'load'>('main');
  
  const [isStageTransitioning, setIsStageTransitioning] = useState(false);
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [isGameOverTransitioning, setIsGameOverTransitioning] = useState(false);
  const [gameOverText, setGameOverText] = useState("GAME OVER");

  const [unlockedEndings, setUnlockedEndings] = useState<EndingType[]>(() => {
    const saved = localStorage.getItem('cat_endings');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewGallery, setViewGallery] = useState(false);

  useEffect(() => {
    localStorage.setItem('cat_text_scale', textScale);
  }, [textScale]);

  useEffect(() => {
    if (phase === 'START') {
        audioManager.playBgm('title');
    } else if (phase === 'PROLOGUE') {
        audioManager.playBgm('prologue');
    } else if (phase === 'GAME_OVER' || phase === 'VICTORY') {
        audioManager.playBgm('ending');
    } else if (phase === 'REBIRTH' || phase === 'CHARACTER_SELECT') {
         audioManager.playBgm('title');
    } else {
        if (stage === 'STRAY' || stage === 'CAT_LORD') {
             audioManager.playBgm('stray');
        } else if (stage === 'MANSION' || stage === 'CELEBRITY') {
             audioManager.playBgm('mansion');
        }
    }
  }, [phase, stage]);

  useEffect(() => {
    if (phase !== 'START' && phase !== 'PROLOGUE' && phase !== 'REBIRTH' && phase !== 'CHARACTER_SELECT' && phase !== 'GAME_OVER' && phase !== 'VICTORY' && character && !isGameOverTransitioning) {
        const saveData: SaveData = {
            day, stats, stage, completedEventIds, completedAt, failedAt, history, 
            currentQuestIndex, actionPoints, dailyActionsTaken, logs, lastRandomEventId, character,
            seenNightThoughtIds,
            timestamp: Date.now(),
            version: '1.0.5'
        };
        localStorage.setItem('cat_adventure_autosave', JSON.stringify(saveData));
    }
  }, [day, stats, stage, completedEventIds, completedAt, failedAt, history, currentQuestIndex, actionPoints, dailyActionsTaken, logs, lastRandomEventId, character, seenNightThoughtIds, phase, isGameOverTransitioning]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [{ day, message, type }, ...prev].slice(0, 30));
  };

  // Helper to calculate multipliers BEFORE applying stats, so UI shows real values
  const applyCharacterMultipliers = (changes: Partial<GameStats>): Partial<GameStats> => {
      const multipliers = character?.statMultipliers || { health: 1, satiety: 1, hissing: 1, smarts: 1 };
      const calculatedChanges: Partial<GameStats> = {};

      (Object.keys(changes) as Array<keyof GameStats>).forEach(key => {
          if (changes[key] !== undefined) {
              let changeVal = changes[key]!;
              // Only multiply positive gains
              if (changeVal > 0) {
                  const multiplier = multipliers[key];
                  if (multiplier) {
                      changeVal = Math.round(changeVal * multiplier);
                  }
              }
              calculatedChanges[key] = changeVal;
          }
      });
      return calculatedChanges;
  };

  const updateStats = (finalChanges: Partial<GameStats>) => {
    setStats(prev => {
      const next = { ...prev };
      (Object.keys(finalChanges) as Array<keyof GameStats>).forEach(key => {
        if (finalChanges[key] !== undefined) {
          next[key] = Math.max(0, Math.min(100, next[key] + finalChanges[key]!));
        }
      });
      return next;
    });
  };

  // --- Checking Immediate Failures Based on Stage ---
  const checkImmediateEndings = (currentStats: GameStats) => {
    if (currentStats.health <= 0) {
        if (stage === 'STRAY') finishGame('STRAY_FROZEN');
        else if (stage === 'CAT_LORD') finishGame('LORD_KILLED');
        else if (stage === 'MANSION') finishGame('MANSION_OBESITY');
        else finishGame('CELEB_EXHAUSTED');
        return true;
    }
    if (currentStats.satiety <= 0) {
        if (stage === 'STRAY') finishGame('STRAY_STARVED');
        else if (stage === 'CAT_LORD') finishGame('LORD_DEPOSED');
        else if (stage === 'MANSION') finishGame('MANSION_THROWN_OUT');
        else finishGame('CELEB_FORGOTTEN');
        return true;
    }
    if (currentStats.hissing <= 0) {
        if (stage === 'STRAY') finishGame('STRAY_DOMESTICATED');
        else if (stage === 'CAT_LORD') finishGame('LORD_SOFT');
        else if (stage === 'MANSION') finishGame('MANSION_DOLL');
        else finishGame('CELEB_FAKE');
        return true;
    }
    return false;
  };

  // --- Calculate All Achievements ---
  const calculateAchievements = (mainEnding: EndingType): EndingType[] => {
      const badges: EndingType[] = [mainEnding];

      // Traits
      if (stats.smarts >= 100) badges.push('STAT_MAX_SMARTS');
      if (stats.hissing >= 100) badges.push('STAT_MAX_HISSING');
      if (stats.health >= 60 && stats.satiety >= 60 && stats.smarts >= 60 && stats.hissing >= 60) badges.push('STAT_BALANCED');

      // Story Chains
      if (completedEventIds.includes('side_apprentice_celeb_good')) badges.push('ACH_APPRENTICE_MASTER');
      if (completedEventIds.includes('side_apprentice_celeb_evil')) badges.push('ACH_APPRENTICE_RIVAL');
      
      // Love Chain
      const hasBalls = !history.includes('choice_egg_surrender') && !failedAt['side_egg_crisis'];
      if (completedEventIds.includes('side_hakimi_3') && history.includes('love_choice_open_window') && hasBalls) badges.push('ACH_LOVE_TRUE');
      if (completedEventIds.includes('side_hakimi_3') && history.includes('love_choice_open_window') && hasBalls) badges.push('ACH_LOVE_FAMILY'); // 成功且有蛋蛋 -> 儿孙满堂
      if (completedEventIds.includes('side_hakimi_3') && history.includes('love_choice_watch')) badges.push('ACH_LOVE_REGRET');
      if (completedEventIds.includes('side_hakimi_3_neutered') && history.includes('love_choice_show_scar')) badges.push('ACH_LOVE_PLATONIC');

      // Egg Crisis
      // 孤睾战士：被绝育 (主动顺从 OR 抵抗失败)
      if (history.includes('choice_egg_surrender') || failedAt['side_egg_crisis']) {
          badges.push('ACH_EGG_DEFENDER');
      }

      if (history.includes('phil_choice_revolution')) badges.push('ACH_PHILO_UTOPIA');
      if (history.includes('phil_choice_simulation')) badges.push('ACH_PHILO_NIHILISM');
      if (history.includes('phil_choice_divine_right') && history.includes('phil_choice_oligarch')) badges.push('ACH_PHILO_DICTATOR');

      // Live Sales Endings
      if (history.includes('run') && completedEventIds.includes('stage_sales')) badges.push('ACH_RETURN_WILD');
      if (history.includes('run') && !completedEventIds.includes('stage_sales')) badges.push('ACH_CAGE_CAT');

      return badges;
  };

  const finishGame = (type: EndingType) => {
    // 1. Determine Win/Loss for Curtain
    const isVictory = type.startsWith('LEGEND_') || type.startsWith('SURVIVOR_');
    setGameOverText(isVictory ? "传奇达成" : "GAME OVER");

    // 2. Trigger Transition Animation Immediately
    setIsGameOverTransitioning(true);
    
    // 3. Remove Autosave IMMEDIATELY to prevent resuming dead game
    localStorage.removeItem('cat_adventure_autosave');
    
    // 4. Determine Primary Ending and Achievements
    setPrimaryEnding(type);
    const allEarned = calculateAchievements(type);
    setEarnedAchievements(allEarned);

    // 5. Unlock in Storage
    setUnlockedEndings(prev => {
      const next = Array.from(new Set([...prev, ...allEarned]));
      localStorage.setItem('cat_endings', JSON.stringify(next));
      return next;
    });

    // 6. Delay Phase Change to allow curtain animation to finish
    setTimeout(() => {
        setPhase(isVictory ? 'VICTORY' : 'GAME_OVER'); // Use VICTORY phase if win, though they map to same component
        setIsGameOverTransitioning(false);
    }, 1500); 
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
      day, stats, stage, completedEventIds, completedAt, failedAt, history, 
      currentQuestIndex, actionPoints, dailyActionsTaken, logs, lastRandomEventId, character,
      seenNightThoughtIds,
      timestamp: Date.now(),
      version: '1.0.5'
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
      setFailedAt(data.failedAt || {});
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
        if (isStatsDead(data.stats)) {
            alert('该存档已结束（猫猫已回喵星），无法读取。');
            return;
        }
        loadGameData(data);
        addLog(`已读取存档 ${slotId}`, 'success');
    } catch (e) {
        alert('存档损坏，无法读取');
    }
  };

  const isStatsDead = (s: GameStats) => s.health <= 0 || s.satiety <= 0 || s.hissing <= 0 || s.smarts <= 0;

  const continueLatestGame = () => {
       audioManager.init();
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
           if (isStatsDead(latestSave.data.stats)) {
               alert('最近的存档记录显示游戏已结束。请开始新游戏。');
               // Optionally clear bad autosave
               localStorage.removeItem('cat_adventure_autosave');
               return;
           }
           loadGameData(latestSave.data);
           addLog('已恢复至最近进度', 'success');
       } else {
           alert('暂无存档记录');
       }
  };

  const returnToTitle = () => {
      audioManager.playClick();
      if (character && !isGameOverTransitioning && !isStatsDead(stats)) {
          const saveData: SaveData = {
              day, stats, stage, completedEventIds, completedAt, failedAt, history, 
              currentQuestIndex, actionPoints, dailyActionsTaken, logs, lastRandomEventId, character,
              seenNightThoughtIds,
              timestamp: Date.now(),
              version: '1.0.5'
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

  const handleStartGame = () => {
      audioManager.init();
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
      // Assume character was selected in CharacterSelect phase
      startDay(1);
  };

  const startDay = (currentDay: number) => {
    if (stats.smarts <= 0) { finishGame('STUPID_DEATH'); return; }
    
    setDay(currentDay);
    setActionPoints(3);
    setDailyActionsTaken([]); 
    setCurrentNightThought(null);
    
    const allRandomEvents = [...RANDOM_EVENTS, ...RANDOM_EVENTS_EXTRA];

    // 修改筛选逻辑：允许同一事件最多出现 2 次
    const validRandomEvents = allRandomEvents.filter(e => {
        const occurrenceCount = completedEventIds.filter(id => id === e.id).length;
        const isAllowed = !e.allowedStages || e.allowedStages.includes(stage);
        
        return occurrenceCount < 2 && e.id !== lastRandomEventId && isAllowed;
    });
    
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
      // 将支线任务、主线任务也加入已执行列表，防止每日无限刷
      setDailyActionsTaken(prev => [...prev, currentEvent.id]);
    }

    const { changes, message, success, effectType, stageUnlock, retry, sound } = choice.effect(stats);
    
    // IMPORTANT: Calculate ACTUAL changes using character multipliers HERE
    // so that the result modal, logs, and state update all share the same calculated values.
    const actualChanges = applyCharacterMultipliers(changes);

    updateStats(actualChanges);
    
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
        } else {
            // New: Track Failure Time
            setFailedAt(prev => ({ ...prev, [currentEvent.id]: day }));
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

    // Pass the multiplied changes to event result so the modal shows correct numbers
    setEventResult({ message, success, changes: actualChanges });
    addLog(message, success ? 'success' : 'danger');
    
    if (actualChanges.health && actualChanges.health < 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 250);
      setActiveEffect({ type: 'damage', color: 'red' });
    } else if (effectType === 'heal' || (actualChanges.health && actualChanges.health > 0)) {
      setActiveEffect({ type: 'heal', color: 'green' });
    } else if (actualChanges.satiety && actualChanges.satiety > 0) {
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
      // 保持当前选择的角色重新开始
      setStats(character ? character.initialStats : CHARACTERS[0].initialStats);
      setStage('STRAY');
      setCompletedEventIds([]);
      setCompletedAt({});
      setFailedAt({});
      setHistory([]);
      setCurrentQuestIndex(0);
      setPrimaryEnding(null);
      setEarnedAchievements([]);
      setLogs([]);
      setLastRandomEventId(null);
      setIsMenuOpen(false);
      setCurrentNightThought(null);
      setSeenNightThoughtIds([]);
      setIsGameOverTransitioning(false);
  };

  // Determine survival endings
  const getSurvivalEnding = (): EndingType => {
      if (stage === 'STRAY') return 'SURVIVOR_STRAY';
      if (stage === 'CAT_LORD') return 'LEGEND_LORD';
      if (stage === 'MANSION') return 'LEGEND_COMFORT';
      return 'LEGEND_SUPERSTAR';
  }

  const allPotentialActions = [
      ...STORY_QUESTS.filter((q, i) => i === currentQuestIndex && !completedEventIds.includes(q.id)),
      // Side Stories: 过滤条件增加 !dailyActionsTaken.includes(s.id)，保证当天执行过(无论成败)不再显示
      ...SIDE_STORIES.filter(s => !completedEventIds.includes(s.id) && !dailyActionsTaken.includes(s.id) && (!s.allowedStages || s.allowedStages.includes(stage))),
      ...DAILY_ACTIONS.filter(a => (!a.allowedStages || a.allowedStages.includes(stage)) && (!a.excludedStages || !a.excludedStages.includes(stage)))
  ];

  // Modified to pass failedAt
  const unlockedActionsRaw = allPotentialActions.filter(a => !a.unlockCondition || a.unlockCondition(day, stats, completedEventIds, history, completedAt, failedAt).unlocked);
  const unlockedActions = [...unlockedActionsRaw].sort((a, b) => a.type === 'STAGE' ? -1 : 1);

  const lockedActions = allPotentialActions.filter(a => {
      if (!a.unlockCondition) return false;
      const res = a.unlockCondition(day, stats, completedEventIds, history, completedAt, failedAt);
      if (res.unlocked) return false;
      // Filter out logic-hidden locks (like prerequisites) but keep stat/time/cooldown locks visible
      if (res.reason && (res.reason.includes('前置') || res.reason.includes('完成'))) return false;
      return true;
  });

  if (viewGallery) {
    return <Gallery unlockedEndings={unlockedEndings} onBack={() => { audioManager.playClick(); setViewGallery(false); }} />;
  }

  // --- MENU MODAL (Reuse from before, no changes needed) ---
  const MenuModal = () => {
      const settingScales = {
          label: { small: 'text-xs', normal: 'text-sm', large: 'text-base' },
          btn: { small: 'text-[0.65rem]', normal: 'text-xs', large: 'text-sm' },
          menuBtn: { small: 'text-lg', normal: 'text-xl', large: 'text-2xl' }
      };
      
      const labelClass = settingScales.label[textScale];
      const btnClass = settingScales.btn[textScale];
      const menuBtnClass = settingScales.menuBtn[textScale];

      return isMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-[6px] border-black p-0 w-full max-w-lg shadow-[10px_10px_0px_0px_black] animate-in flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center px-4 py-3 border-b-4 border-black bg-stone-100">
              <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                {menuTab === 'main' ? 'PAUSED' : menuTab === 'save' ? '保存进度' : '读取进度'}
              </h2>
              <button onClick={() => { audioManager.playClick(); setIsMenuOpen(false); }} onMouseEnter={() => audioManager.playHover()}><X size={24} strokeWidth={3}/></button>
            </div>

            <div className="flex border-b-4 border-black bg-white">
                <button onClick={() => { audioManager.playClick(); setMenuTab('main'); }} onMouseEnter={() => audioManager.playHover()} className={`flex-1 py-3 font-black uppercase text-sm md:text-base flex items-center justify-center gap-2 ${menuTab === 'main' ? 'bg-amber-400' : 'bg-stone-200 text-stone-500 hover:bg-stone-300'}`}><Menu size={16}/> 菜单</button>
                <button onClick={() => { audioManager.playClick(); setMenuTab('save'); }} onMouseEnter={() => audioManager.playHover()} className={`flex-1 py-3 font-black uppercase text-sm md:text-base flex items-center justify-center gap-2 ${menuTab === 'save' ? 'bg-emerald-400' : 'bg-stone-200 text-stone-500 hover:bg-stone-300'}`}><FileDown size={16}/> 存档</button>
                <button onClick={() => { audioManager.playClick(); setMenuTab('load'); }} onMouseEnter={() => audioManager.playHover()} className={`flex-1 py-3 font-black uppercase text-sm md:text-base flex items-center justify-center gap-2 ${menuTab === 'load' ? 'bg-blue-400' : 'bg-stone-200 text-stone-500 hover:bg-stone-300'}`}><FileUp size={16}/> 读档</button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar bg-white">
              {menuTab === 'main' && (
                <div className="space-y-3">
                  <div className="text-center mb-6">
                      <div className="inline-block border-4 border-black p-2 bg-stone-100 mb-2">
                          <img src={getStageAvatar(character, stage)} className="w-16 h-16 object-cover grayscale" />
                      </div>
                      <p className="font-black text-lg">第 {day} 天</p>
                      <p className="text-xs font-bold text-stone-500 uppercase">{stage}</p>
                  </div>
                  
                  <div className="bg-stone-100 border-2 border-black p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Type size={16} />
                        <span className={`font-black uppercase ${labelClass}`}>文本大小</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { audioManager.playClick(); setTextScale('small'); }} className={`flex-1 py-2 font-bold border-2 border-black ${btnClass} ${textScale === 'small' ? 'bg-black text-white' : 'bg-white hover:bg-stone-200'}`}>
                            小
                        </button>
                        <button onClick={() => { audioManager.playClick(); setTextScale('normal'); }} className={`flex-1 py-2 font-bold border-2 border-black ${btnClass} ${textScale === 'normal' ? 'bg-black text-white' : 'bg-white hover:bg-stone-200'}`}>
                            中
                        </button>
                        <button onClick={() => { audioManager.playClick(); setTextScale('large'); }} className={`flex-1 py-2 font-bold border-2 border-black ${btnClass} ${textScale === 'large' ? 'bg-black text-white' : 'bg-white hover:bg-stone-200'}`}>
                            大
                        </button>
                      </div>
                  </div>

                  <button onClick={() => { audioManager.playClick(); setIsMenuOpen(false); }} onMouseEnter={() => audioManager.playHover()} className={`w-full py-4 bg-black text-white font-black border-4 border-transparent hover:border-black hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest active:translate-y-1 transition-all ${menuBtnClass}`}>
                    <Play size={20} fill="currentColor" /> 继续游戏
                  </button>
                  <button onClick={() => { audioManager.playClick(); setIsMenuOpen(false); setViewGallery(true); }} onMouseEnter={() => audioManager.playHover()} className="w-full py-3 bg-amber-400 border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 active:translate-y-1">
                    <Trophy size={20}/> 成就图鉴
                  </button>
                  <button onClick={returnToTitle} onMouseEnter={() => audioManager.playHover()} className="w-full py-3 bg-stone-100 border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 active:translate-y-1 mt-4 hover:bg-stone-200">
                    <Home size={20}/> 返回标题
                  </button>
                  <button onClick={() => { if(confirm('确定要重置当前进度吗？未保存的进度将会丢失。')) resetGame(); }} onMouseEnter={() => audioManager.playHover()} className="w-full py-3 bg-rose-50 border-4 border-rose-200 text-rose-600 font-black text-lg shadow-[4px_4px_0px_0px_rgba(255,0,0,0.1)] flex items-center justify-center gap-2 active:translate-y-1 hover:bg-rose-100 hover:border-rose-400 mt-2">
                    <RefreshCw size={20}/> 重置游戏
                  </button>
                </div>
              )}

              {(menuTab === 'save' || menuTab === 'load') && (
                <div className="space-y-3">
                   {getSaveSlotsMetadata().map((slot, idx) => (
                       <div key={slot.id} className="border-4 border-black bg-stone-50 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] relative group">
                           <div className="flex justify-between items-start mb-2">
                               <span className="font-black bg-black text-white px-2 py-0.5 text-xs">SLOT {idx + 1}</span>
                               {!slot.isEmpty && menuTab === 'save' && (
                                   <button onClick={(e) => { e.stopPropagation(); deleteSaveSlot(idx + 1); }} className="text-stone-400 hover:text-rose-500"><Trash2 size={16}/></button>
                               )}
                           </div>
                           
                           {slot.isEmpty ? (
                               <div className="text-center py-4 text-stone-400 font-bold italic">-- 空存档 --</div>
                           ) : (
                               <div className="mb-2">
                                   <div className="flex justify-between font-bold text-sm">
                                       <span>第 {slot.day} 天</span>
                                       <span className="uppercase text-amber-600">{slot.stage}</span>
                                   </div>
                                   <div className="text-[10px] text-stone-400 font-mono mt-1">{slot.date}</div>
                               </div>
                           )}

                           <button 
                                onClick={() => { if(menuTab === 'save') saveToSlot(idx + 1); else loadFromSlot(idx + 1); }}
                                className={`w-full py-2 font-black border-2 border-black text-sm uppercase flex items-center justify-center gap-1 active:translate-y-0.5 transition-colors ${menuTab === 'save' ? 'bg-emerald-200 hover:bg-emerald-300' : (slot.isEmpty ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-blue-200 hover:bg-blue-300')}`}
                                disabled={menuTab === 'load' && slot.isEmpty}
                           >
                               {menuTab === 'save' ? (slot.isEmpty ? '写入存档' : '覆盖存档') : '读取进度'}
                           </button>
                       </div>
                   ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )
  };

  return (
    <div className="w-full h-screen bg-stone-900 overflow-hidden font-sans text-stone-900 select-none">
      {phase === 'START' && <TitleScreen onStart={handleStartGame} onContinue={continueLatestGame} onGallery={() => setViewGallery(true)} />}
      
      {phase === 'PROLOGUE' && <Prologue 
        onBack={() => {
            audioManager.playClick();
            setPhase('START');
        }}
        onComplete={() => {
           localStorage.setItem('cat_prologue_seen', 'true');
           setPhase('CHARACTER_SELECT');
      }} />}

      {phase === 'CHARACTER_SELECT' && (
          <CharacterSelect 
            characters={CHARACTERS} 
            onSelect={(char) => {
              setCharacter(char);
              setStats(char.initialStats);
              setPhase('REBIRTH');
            }} 
            onBack={() => {
                audioManager.playClick();
                setPhase('START');
            }}
          />
      )}

      {phase === 'REBIRTH' && character && (
          <Rebirth 
            character={character} 
            onSign={handleRebirthSign} 
            onBack={() => { 
                audioManager.playClick(); 
                setPhase('CHARACTER_SELECT'); 
            }}
          />
      )}

      {(phase === 'MORNING_EVENT' || phase === 'ACTION_SELECTION' || phase === 'EVENT_RESOLUTION' || phase === 'NIGHT_SUMMARY') && (
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
            textScale={textScale}
            isGameOverTransitioning={isGameOverTransitioning}
            gameOverText={gameOverText}
            
            onMenuOpen={() => setIsMenuOpen(true)}
            onChoice={handleChoice}
            onResolutionComplete={handleResolutionComplete}
            onStartDay={startDay}
            onFinishGame={() => finishGame(getSurvivalEnding())}
            onSetEvent={setCurrentEvent}
            onSetEventResult={setEventResult}
            onUpdateStats={updateStats}
            onSetDay={setDay}
            onSetPhase={setPhase}
        />
      )}

      {(phase === 'GAME_OVER' || phase === 'VICTORY') && (
        <EndGame 
            ending={primaryEnding}
            achievements={earnedAchievements}
            isVictory={primaryEnding?.startsWith('LEGEND_') || primaryEnding?.startsWith('SURVIVOR_')} 
            onReset={resetGame} 
            onGallery={() => setViewGallery(true)}
        />
      )}

      <MenuModal />
    </div>
  );
}
