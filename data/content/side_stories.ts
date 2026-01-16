
import { GameEvent } from '../../types';
import { PHILOSOPHY_QUESTS } from './story_chains/philosophy';
import { LOVE_QUESTS } from './story_chains/love';
import { APPRENTICE_QUESTS } from './story_chains/apprentice';
import { roll, pick, getImg } from '../utils';

// 其他独立的支线剧情
const MISC_QUESTS: GameEvent[] = [
    {
        id: 'side_egg_crisis',
        chainId: 'eggs',
        title: '支线：蛋蛋的忧伤',
        description: '豪宅的主人在谈论“拆弹计划”。他们看你的眼神充满了某种危险的关爱。',
        image: getImg('绝育危机', 'ef4444'),
        type: 'SIDE_QUEST',
        allowedStages: ['MANSION'],
        unlockCondition: (day) => ({ unlocked: day >= 7, reason: '需在豪宅待一段时日' }),
        choices: [
            {
                id: 'choice_egg_surrender',
                text: '顺从命运 (永久失去蛋蛋)',
                calculateChance: (stats) => 100,
                effect: (stats) => ({
                    changes: { health: 25, hissing: -30, satiety: 15 },
                    message: '手术很成功。你感觉身体轻盈了，对世俗的纷争也失去了兴趣，健康大幅回升。',
                    success: true,
                    effectType: 'heal'
                })
            },
            {
                id: 'choice_egg_resist',
                text: '誓死捍卫！',
                calculateChance: (stats) => Math.min(95, 30 + stats.hissing * 0.6),
                effect: (stats) => {
                    if (roll(30 + stats.hissing * 0.6)) {
                        return { 
                            changes: { hissing: 10, smarts: 5, health: -5 }, 
                            message: '你把航空箱抓烂了，并躲在吊顶里三天没出来。他们暂时放弃了念头。', 
                            success: true,
                            effectType: 'neutral'
                        };
                    }
                    return { 
                        changes: { health: 5, hissing: -20, satiety: 5 }, 
                        message: '反抗失败，你还是被带去了诊所。你失去了蛋蛋，还被扣了几天罐头。', 
                        success: false, 
                        effectType: 'damage' 
                    };
                }
            }
        ]
    },
    {
        id: 'side_hater_war',
        chainId: 'internet',
        title: '支线：键盘侠反击',
        description: '网上有人公开diss你，说你这只圆头猫全是摆拍，其实性格极其恶劣。',
        image: getImg('网络战争', '3b82f6'),
        type: 'SIDE_QUEST',
        allowedStages: ['CELEBRITY'],
        unlockCondition: (day, stats, completed) => ({ unlocked: day >= 10, reason: '需成名后' }), // Added day check
        choices: [
            {
                id: 'choice_hater_ignore',
                text: '不予理睬',
                calculateChance: (stats) => 90,
                effect: (stats) => ({
                    changes: { smarts: 5, hissing: -5 },
                    message: '智者不入爱河，强者不理键盘。你的大度反而引来了更多路人粉，智商上线。',
                    success: true,
                    effectType: 'neutral'
                })
            },
            {
                id: 'choice_hater_attack',
                text: '直播对线',
                calculateChance: (stats) => 50,
                effect: (stats) => {
                    if (roll(50)) {
                        return {
                            changes: { hissing: 10, smarts: -2, satiety: 5 },
                            message: '你对着镜头哈了十分钟气，反向带货。流量爆炸了，但你的猫设变得暴力。',
                            success: true,
                            effectType: 'damage'
                        }
                    }
                    return {
                        changes: { hissing: 5, smarts: -5, health: -5 },
                        message: '对线失败，你被网友挖出了以前偷吃狗粮的黑料，气得肝疼。',
                        success: false,
                        effectType: 'damage'
                    }
                }
            }
        ]
    }
];

// 合并所有支线
export const SIDE_STORIES: GameEvent[] = [
    ...PHILOSOPHY_QUESTS,
    ...LOVE_QUESTS,
    ...APPRENTICE_QUESTS,
    ...MISC_QUESTS
];
