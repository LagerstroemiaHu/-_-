
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
    // 属性获取倍率 (例如: hissing: 1.5 表示获取哈气值时 x1.5)
    statMultipliers: {
        health: number;
        satiety: number;
        hissing: number;
        smarts: number;
    };
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
    sound?: string; 
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
  unlockCondition?: (
      day: number, 
      stats: GameStats, 
      completed: string[], 
      history: string[], 
      completedAt: Record<string, number>,
      failedAt: Record<string, number> // New parameter
  ) => { unlocked: boolean; reason?: string };
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

// 30+ Endings / Achievements
export type EndingType = 
  // --- DEATH / FAILURE (12) ---
  | 'STRAY_STARVED' | 'STRAY_FROZEN' | 'STRAY_DOMESTICATED'
  | 'LORD_DEPOSED' | 'LORD_KILLED' | 'LORD_SOFT'
  | 'MANSION_THROWN_OUT' | 'MANSION_OBESITY' | 'MANSION_DOLL'
  | 'CELEB_EXHAUSTED' | 'CELEB_FORGOTTEN' | 'CELEB_FAKE'
  
  // --- SPECIAL DEATHS (2) ---
  | 'STUPID_DEATH' | 'PHILOSOPHY_DEATH'

  // --- SURVIVAL / STAGE COMPLETION (4) ---
  | 'SURVIVOR_STRAY' | 'LEGEND_LORD' | 'LEGEND_COMFORT' | 'LEGEND_SUPERSTAR'

  // --- STORY CHAINS (7) ---
  | 'ACH_APPRENTICE_MASTER' | 'ACH_APPRENTICE_RIVAL' | 'ACH_APPRENTICE_TRAITOR'
  | 'ACH_LOVE_TRUE' | 'ACH_LOVE_REGRET' | 'ACH_LOVE_PLATONIC' | 'ACH_LOVE_FAMILY'
  | 'ACH_DIVORCE' 
  | 'ACH_EGG_DEFENDER' 

  // --- PHILOSOPHY (6) ---
  | 'ACH_PHILO_UTOPIA' | 'ACH_PHILO_NIHILISM' | 'ACH_PHILO_DICTATOR'
  | 'ACH_PHILO_THREE_FACED' | 'ACH_PHILO_TWO_FACED' | 'ACH_PHILO_APOLITICAL'

  // --- SPECIAL STAGE SALES ENDINGS (2) ---
  | 'ACH_RETURN_WILD' | 'ACH_CAGE_CAT'

  // --- SPECIAL ISOLATION (1) ---
  | 'ACH_LONE_WOLF'

  // --- TRAITS / STATS (6) ---
  | 'TRAIT_SAINT' | 'TRAIT_DEVIL' | 'TRAIT_COWARD'
  | 'STAT_MAX_SMARTS' | 'STAT_MAX_HISSING' | 'STAT_BALANCED';

export interface EndingConfig {
    id: EndingType;
    title: string;
    description: string;
    icon: any; // Lucide Icon component
    color: string;
    image?: string;
    isGood: boolean; // Is this considered a "Success" or at least a notable achievement?
}

export interface LogEntry {
  day: number;
  message: string;
  type: 'info' | 'success' | 'danger' | 'warning';
}
