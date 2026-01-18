
import { GameEvent } from '../../../types';
import { roll, pick, getImg } from '../../utils';

// 恋爱线：哈基米 (Hakimi) 的多阶段爱情故事
export const LOVE_QUESTS: GameEvent[] = [
    // 阶段一：初遇 (Day 1+)
    {
        id: 'side_hakimi_1',
        chainId: 'hakimi_love',
        title: '情缘：哈基米之舞',
        description: '一只三花猫正在踩节奏。',
        image: getImg('哈基米', 'f472b6'),
        type: 'SIDE_QUEST',
        allowedStages: ['STRAY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_hakimi_1'] && day <= failedAt['side_hakimi_1'] + 1) {
                return { unlocked: false, reason: '需冷却' };
            }
            return { unlocked: day >= 1, reason: '需第1天' };
        },
        choices: [
            {
                id: 'love_choice_dance',
                text: '加入节奏',
                calculateChance: (stats) => Math.min(90, 10 + stats.smarts * 0.5 + stats.health * 0.3),
                effect: (stats) => {
                    if (roll(10 + stats.smarts * 0.5 + stats.health * 0.3)) {
                        return {
                            changes: { hissing: -5, satiety: -2, smarts: -2 }, // Stage 1: minor stats
                            message: '你跟上了她的节拍！她眼神拉丝：“舞跳得不错嘛，老头。”',
                            success: true,
                            effectType: 'heal'
                        };
                    }
                    return {
                        changes: { hissing: 2 },
                        message: '你踩到了她的脚。她嫌弃地看着你：“下头猫。” (过两天再试试？)',
                        success: false, // Allows retry
                        effectType: 'damage'
                    };
                }
            },
            {
                id: 'love_choice_ignore',
                text: '高冷拒绝',
                effect: (stats) => ({
                    changes: { hissing: 5 },
                    message: '你冷酷地走开了。心中无女人，拔刀自然神。',
                    success: true, // Ends quest chain
                    effectType: 'neutral'
                })
            }
        ]
    },
    // 阶段二：约会 (Day 7+)
    {
        id: 'side_hakimi_2',
        chainId: 'hakimi_love',
        title: '情缘：垃圾桶晚餐',
        description: '哈基米约你在秘密基地见面。',
        image: getImg('甜蜜约会', 'f472b6'),
        type: 'SIDE_QUEST',
        allowedStages: ['STRAY', 'CAT_LORD'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_hakimi_2'] && day <= failedAt['side_hakimi_2'] + 1) {
                return { unlocked: false, reason: '需等待机会' };
            }
            return {
                unlocked: completed.includes('side_hakimi_1') && history.includes('love_choice_dance') && day >= 7,
                reason: '需第7天且前缘已结'
            };
        },
        choices: [
            {
                id: 'love_choice_eat_cake',
                text: '一起吃蛋糕',
                calculateChance: (stats) => 100,
                effect: (stats) => ({
                    changes: { satiety: 20, health: 5, hissing: -5 },
                    message: '奶油沾在胡子上。难得的甜蜜时刻。',
                    success: true,
                    effectType: 'heal'
                })
            },
            {
                id: 'love_choice_give_all',
                text: '全让给她吃',
                calculateChance: (stats) => 80, // 修改：从100%降为90%
                effect: (stats) => {
                    if (roll(80)) {
                        return {
                            changes: { satiety: -5, hissing: -5, smarts: 5 },
                            message: '你看着她吃完了。她感动地蹭了蹭你：“你比隔壁那只渣橘强多了。”',
                            success: true,
                            effectType: 'heal'
                        };
                    }
                    return {
                        changes: { satiety: -5, hissing: 2 },
                        message: '她以为你不爱吃这个，觉得你很挑剔，生气地走了。(过两天再试试？)',
                        success: false, // Retry
                        effectType: 'neutral'
                    };
                }
            }
        ]
    },
    // 阶段三：阶级阻隔 (Day 11+)
    {
        id: 'side_hakimi_3',
        chainId: 'hakimi_love',
        title: '情缘：玻璃之隔',
        description: '暴雨夜，哈基米出现在窗外。',
        image: getImg('咫尺天涯', '1e3a8a'),
        type: 'SIDE_QUEST',
        allowedStages: ['MANSION', 'CELEBRITY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_hakimi_3'] && day <= failedAt['side_hakimi_3'] + 1) {
                return { unlocked: false, reason: '需等待雨停' };
            }
            return {
                unlocked: completed.includes('side_hakimi_2') && day >= 11 && !history.includes('choice_egg_surrender'),
                reason: '需第11天且旧情未了'
            };
        },
        choices: [
            {
                id: 'love_choice_open_window',
                text: '为她开窗 ',
                calculateChance: (stats) => Math.min(90, 30 + stats.smarts * 0.6),
                effect: (stats) => {
                    if (roll(30 + stats.smarts * 0.6)) {
                        return {
                            changes: { health: 5, hissing: 10, smarts: 5 }, // Rebellious act increases Hissing
                            message: '你拨开了锁扣！哈基米跳了进来。在你的坚持下，铲屎官不得不收留了她。',
                            success: true,
                            effectType: 'heal'
                        };
                    }
                    return {
                        changes: { hissing: 5, health: -5 },
                        message: '窗户锁死了！你拼命挠玻璃。她失望地消失在雨夜中。(过两天再试试)',
                        success: false,
                        effectType: 'damage'
                    };
                }
            },
            {
                id: 'love_choice_watch',
                text: '隔窗相望',
                calculateChance: (stats) => 100,
                effect: (stats) => ({
                    changes: { hissing: -10, smarts: 5 }, // Giving up reduces wildness
                    message: '你没有动。两个世界的猫没有未来。她在雨中转身离去。',
                    success: true, // End quest
                    effectType: 'neutral'
                })
            }
        ]
    },
    // 阶段三分支：已绝育 (Day 11+)
    {
        id: 'side_hakimi_3_neutered',
        chainId: 'hakimi_love',
        title: '情缘：无言的结局',
        description: '哈基米在呼唤你，但你看了看自己残缺的身体。',
        image: getImg('淡淡的忧伤', '1e3a8a'),
        type: 'SIDE_QUEST',
        allowedStages: ['MANSION', 'CELEBRITY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_hakimi_3_neutered'] && day <= failedAt['side_hakimi_3_neutered'] + 1) {
                return { unlocked: false, reason: '需平复心情' };
            }
            return {
                unlocked: completed.includes('side_hakimi_2') && day >= 11 && history.includes('choice_egg_surrender'),
                reason: '需第11天但身已残'
            };
        },
        choices: [
            {
                id: 'love_choice_show_scar',
                text: '展示伤口 (做姐妹)',
                // 30% 左右的概率: 10 + 智力*0.2 + 哈气*0.2
                calculateChance: (stats) => Math.min(80, 10 + stats.smarts * 0.2 + stats.hissing * 0.2),
                effect: (stats) => {
                    if (roll(10 + stats.smarts * 0.2 + stats.hissing * 0.2)) {
                        return {
                            changes: { hissing: -10, smarts: 10 },
                            message: '你展示了那个部位。她露出了同情的眼神，隔着玻璃贴了贴你的脸：“做姐妹也挺好。”(达成：柏拉图之恋)',
                            success: true,
                            effectType: 'neutral'
                        };
                    }
                    return {
                        changes: { hissing: 5, health: -2 },
                        message: '她没看懂你的意思，以为你在展示新造型，一脸困惑地走了。（过两天再试试）',
                        success: false, // Retry
                        effectType: 'neutral'
                    };
                }
            },
            {
                id: 'love_choice_hide',
                text: '躲起来 (自卑)',
                calculateChance: (stats) => 100,
                effect: (stats) => ({
                    changes: { health: -5, hissing: -5 },
                    message: '你躲到了沙发底下。这是一个悲伤的故事，结束了。',
                    success: true, // End quest explicitly
                    effectType: 'damage'
                })
            }
        ]
    }
];
