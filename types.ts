
export type StatType = 'health' | 'satiety' | 'hissing' | 'smarts';

export type GameStage = 'STRAY' | 'CAT_LORD' | 'MANSION' | 'CELEBRITY';

export interface GameStats {
  health: number; // 0-100
  satiety: number; // 0-100
  hissing: number; // 0-100
  smarts: number; // 0-100
}

export interface Character {
    id: string;
    name: string;
    description: string;
    avatar: string;
    initialStats: GameStats;
    locked?: boolean;
}

export interface Choice {
  id: string;
  text: string;
  description?: string; 
  calculateChance?: (stats: GameStats) => number;
  effect: (currentStats: GameStats) => {
    changes: Partial<GameStats>;
    message: string;
    success: boolean;
    effectType?: 'damage' | 'heal' | 'sleep' | 'neutral'; 
    stageUnlock?: GameStage;
    retry?: boolean; 
    sound?: string; // 新增：指定该选项触发的特定音效 (对应 audio_assets 中的 key)
  };
  condition?: (stats: GameStats) => boolean; 
}

export interface GameEvent {
  id: string;
  chainId?: string; 
  title: string;
  description: string;
  image?: string;
  animation?: string; 
  choices: Choice[];
  type: 'RANDOM' | 'DAILY' | 'STAGE' | 'SPECIAL' | 'AUTO' | 'SIDE_QUEST';
  hints?: { stat: string; change: 'up' | 'down' }[];
  allowedStages?: GameStage[];
  excludedStages?: GameStage[];
  unlockCondition?: (day: number, stats: GameStats, completed: string[], history: string[], completedAt: Record<string, number>) => { unlocked: boolean; reason?: string };
  autoTriggerCondition?: (day: number, stats: GameStats, stage: GameStage) => boolean;
}

export interface NightThought {
    id: string;
    stage: GameStage;
    title: string;
    content: string;
    condition?: (stats: GameStats, history: string[], dailyActions: string[]) => boolean;
}

export type GamePhase = 
  | 'START' 
  | 'PROLOGUE'
  | 'REBIRTH'
  | 'CHARACTER_SELECT'
  | 'MORNING_EVENT' 
  | 'ACTION_SELECTION' 
  | 'EVENT_RESOLUTION' 
  | 'NIGHT_SUMMARY' 
  | 'GAME_OVER' 
  | 'VICTORY';

export type EndingType = 
  | 'DOMESTICATED' 
  | 'STARVED'      
  | 'STUPID'       
  | 'OLD_CAT'      
  | 'LORD_ONLY'    
  | 'SUPERSTAR'    
  | 'STRAY_HEALTH_0' | 'STRAY_SATIETY_0' | 'STRAY_HISSING_0'
  | 'LORD_HEALTH_0' | 'LORD_SATIETY_0' | 'LORD_HISSING_0'
  | 'MANSION_HEALTH_0' | 'MANSION_SATIETY_0' | 'MANSION_HISSING_0'
  | 'CELEBRITY_HEALTH_0' | 'CELEBRITY_SATIETY_0' | 'CELEBRITY_HISSING_0'
  | 'END_APPRENTICE_MASTER' | 'END_APPRENTICE_REVENGE' | 'END_EGG_FREEDOM';

export interface LogEntry {
  day: number;
  message: string;
  type: 'info' | 'success' | 'danger' | 'warning';
}
