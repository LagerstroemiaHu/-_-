
import { GameEvent } from '../../../types';
import { roll, pick, getImg } from '../../utils';

// 徒弟线：传承与背叛
export const APPRENTICE_QUESTS: GameEvent[] = [
    // 阶段一：初遇 (Day 2+)
    {
        id: 'side_apprentice_1',
        chainId: 'apprentice',
        title: '师徒：初遇废柴',
        description: '一只被遗弃的长毛猫连抓老鼠都不会。',
        image: getImg('落魄猫咪', 'd97706'),
        type: 'SIDE_QUEST',
        allowedStages: ['STRAY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_apprentice_1'] && day <= failedAt['side_apprentice_1'] + 1) {
                return { unlocked: false, reason: '需冷却' };
            }
            return { unlocked: day >= 2, reason: '需第2天' };
        },
        choices: [
            {
                id: 'app_choice_teach',
                text: '教它生存之道',
                calculateChance: (stats) => Math.min(95, 30 + stats.smarts * 0.5 + stats.hissing * 0.2),
                effect: (stats) => {
                    if (roll(30 + stats.smarts * 0.5 + stats.hissing * 0.2)) {
                        return {
                            changes: { hissing: -2, smarts: 8, satiety: -5 },
                            message: '你分了它一点食物。它感激地叫你“师父”。',
                            success: true,
                            effectType: 'neutral'
                        };
                    }
                    return {
                        changes: { satiety: -5, smarts: 2 },
                        message: '它太笨了，学不会。但它记住了你的恩情。（过两天再教教看？）',
                        success: false, // Changed to false for retry
                        effectType: 'neutral'
                    };
                }
            },
            {
                id: 'app_choice_rob',
                text: '抢走它的铃铛',
                calculateChance: (stats) => Math.min(95, 40 + stats.hissing * 0.6),
                effect: (stats) => {
                    if (roll(40 + stats.hissing * 0.6)) {
                        return {
                            changes: { hissing: 5, satiety: 5 }, // Stage 1 hiss gain
                            message: '你抢走了它的名牌去换了食物。仇恨的种子已种下。',
                            success: true,
                            effectType: 'damage'
                        };
                    }
                    return {
                        changes: { health: -5, hissing: 2 },
                        message: '它反抗剧烈，抓伤了你。（过两天再试试？）',
                        success: false,
                        effectType: 'damage'
                    };
                }
            }
        ]
    },

    // 阶段二：成长 (Day 6+)
    {
        id: 'side_apprentice_good',
        chainId: 'apprentice',
        title: '师徒：反哺',
        description: '那个徒弟现在强壮多了，叼着鸽子等你。',
        image: getImg('徒弟的报恩', 'fbbf24'),
        type: 'SIDE_QUEST',
        allowedStages: ['CAT_LORD'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_apprentice_good'] && day <= failedAt['side_apprentice_good'] + 1) {
                return { unlocked: false, reason: '需冷却' };
            }
            return {
                unlocked: completed.includes('side_apprentice_1') && history.includes('app_choice_teach') && day >= 6,
                reason: '需第8天且有师徒情'
            };
        },
        choices: [
            {
                id: 'app_choice_accept',
                text: '欣慰吃下',
                calculateChance: (stats) => 95, // 修改：从100%降为95%
                effect: (stats) => {
                    if (roll(95)) {
                        return {
                            changes: { satiety: 30, health: 10, hissing: -5 },
                            message: '“师父，这是孝敬您的。” 你吃到了猫生中最美味的鸽子。',
                            success: true,
                            effectType: 'heal'
                        };
                    }
                    return {
                        changes: { health: -5, satiety: -5 },
                        message: '鸽子好像不太新鲜...你吃完后拉肚子了。徒弟一脸愧疚。（过两天再试试）',
                        success: false,
                        effectType: 'damage'
                    };
                }
            }
        ]
    },
    {
        id: 'side_apprentice_evil',
        chainId: 'apprentice',
        title: '师徒：逆徒归来',
        description: '一只体型巨大的长毛猫挡住了路，眼神冰冷。',
        image: getImg('复仇之火', 'b91c1c'),
        type: 'SIDE_QUEST',
        allowedStages: ['CAT_LORD'], 
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_apprentice_evil'] && day <= failedAt['side_apprentice_evil'] + 1) {
                return { unlocked: false, reason: '需养伤' };
            }
            return {
                unlocked: completed.includes('side_apprentice_1') && history.includes('app_choice_rob') && day >= 6,
                reason: '需第8天且有仇怨'
            };
        },
        choices: [
            {
                id: 'app_choice_fight',
                text: '清理门户',
                calculateChance: (stats) => Math.min(80, 20 + stats.hissing * 0.6 + stats.health * 0.4),
                effect: (stats) => {
                    if (roll(20 + stats.hissing * 0.6 + stats.health * 0.4)) {
                        return {
                            changes: { hissing: 15, health: -20 }, // Stage 2: Big hiss gain for winning fight
                            message: '惨烈的战斗。你姜还是老的辣，把它打跑了。',
                            success: true,
                            effectType: 'damage'
                        };
                    }
                    return {
                        changes: { health: -40, hissing: -10 },
                        message: '你老了。它把你按在地上羞辱。“现在扯平了。”（过两天再试试）',
                        success: false,
                        effectType: 'damage'
                    };
                }
            },
            {
                id: 'app_choice_apologize',
                text: '低头认错',
                calculateChance: (stats) => 50,
                effect: (stats) => {
                    if (roll(50)) {
                        return {
                            changes: { hissing: -20, smarts: 5 }, // Stage 2: Huge hiss loss
                            message: '你低下了头。它愣住了，叹了口气转身离开。',
                            success: true,
                            effectType: 'neutral'
                        };
                    }
                    return {
                        changes: { health: -10, hissing: -10 },
                        message: '它不接受道歉，咬了你一口。（过两天再试试）',
                        success: false,
                        effectType: 'damage'
                    };
                }
            }
        ]
    },

    // 阶段三：豪宅 (Day 9+)
    {
        id: 'side_apprentice_mansion_good',
        chainId: 'apprentice',
        title: '师徒：守护者',
        description: '徒弟正在窗外驱赶野狗。',
        image: getImg('守护者', '059669'),
        type: 'SIDE_QUEST',
        allowedStages: ['MANSION'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_apprentice_mansion_good'] && day <= failedAt['side_apprentice_mansion_good'] + 1) {
                return { unlocked: false, reason: '徒弟离去' };
            }
            return {
                unlocked: completed.includes('side_apprentice_good') && day >= 9,
                reason: '需第12天且善缘'
            };
        },
        choices: [
            {
                id: 'app_choice_share_food',
                text: '偷偷推出去一罐罐头',
                calculateChance: (stats) => 95,
                effect: (stats) => ({
                    changes: { satiety: -10, smarts: 5, hissing: 5 },
                    message: '你把罐头推到门缝边。它在守护你的安逸。',
                    success: true,
                    effectType: 'heal'
                })
            },
            {
                id: 'app_choice_invite_in',
                text: '挠门让它进来',
                calculateChance: (stats) => 20 + stats.smarts * 0.5,
                effect: (stats) => {
                    if (roll(20 + stats.smarts * 0.5)) {
                        return {
                            changes: { hissing: 10, smarts: 2 }, // Rebellious act
                            message: '铲屎官被震慑住了，允许它进屋吃饭。',
                            success: true,
                            effectType: 'heal'
                        }
                    }
                    return {
                        changes: { hissing: 5 },
                        message: '徒弟摇了摇头，转身消失在夜色中。（过两天再试试）',
                        success: false, // Changed to false for retry
                        effectType: 'neutral'
                    }
                }
            }
        ]
    },
    {
        id: 'side_apprentice_mansion_evil',
        chainId: 'apprentice',
        title: '师徒：暗夜魅影',
        description: '逆徒正在厨房偷吃你的进口粮。',
        image: getImg('暗夜入侵', '7f1d1d'),
        type: 'SIDE_QUEST',
        allowedStages: ['MANSION'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_apprentice_mansion_evil'] && day <= failedAt['side_apprentice_mansion_evil'] + 1) {
                return { unlocked: false, reason: '需冷却' };
            }
            return {
                unlocked: completed.includes('side_apprentice_evil') && day >= 9,
                reason: '需第12天且恶缘'
            };
        },
        choices: [
            {
                id: 'app_choice_alert',
                text: '大叫报警',
                calculateChance: (stats) => 90,
                effect: (stats) => ({
                    changes: { hissing: -10, smarts: 5, satiety: 5 }, // Relying on humans reduces wildness
                    message: '铲屎官赶走了它。你保住了食物，但失去了尊严。',
                    success: true,
                    effectType: 'neutral'
                })
            },
            {
                id: 'app_choice_duel_mansion',
                text: '在此决斗！',
                calculateChance: (stats) => Math.min(80, 30 + stats.hissing * 0.7),
                effect: (stats) => {
                    if (roll(30 + stats.hissing * 0.7)) {
                        return {
                            changes: { hissing: 15, health: -10 }, // Stage 3: Fighting brings back wildness
                            message: '你把它打出了窗外。家里一片狼藉，但你捍卫了领地。',
                            success: true,
                            effectType: 'damage'
                        }
                    }
                    return {
                        changes: { health: -30, hissing: -5 },
                        message: '你太胖了。它吃光了你的粮，还撒了泡尿。（过两天再试试）',
                        success: false,
                        effectType: 'damage'
                    }
                }
            }
        ]
    },

    // 阶段四：网红 (Day 13+)
    {
        id: 'side_apprentice_celeb_good',
        chainId: 'apprentice',
        title: '师徒：黄金搭档',
        description: '拍摄外景时徒弟闯入镜头。',
        image: getImg('最佳拍档', 'f59e0b'),
        type: 'SIDE_QUEST',
        allowedStages: ['CELEBRITY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_apprentice_celeb_good'] && day <= failedAt['side_apprentice_celeb_good'] + 1) {
                return { unlocked: false, reason: '需冷却' };
            }
            return {
                unlocked: completed.includes('side_apprentice_mansion_good') && day >= 13,
                reason: '需第13天且连心'
            };
        },
        choices: [
            {
                id: 'app_choice_collab',
                text: '一起营业',
                calculateChance: (stats) => 90, // 修改：从100%降为90%
                effect: (stats) => {
                    if (roll(90)) {
                        return {
                            changes: { smarts: 10, hissing: -5, satiety: 20 },
                            message: '“霸道保镖俏老头”组合火遍全网！徒弟也被收养了。',
                            success: true,
                            effectType: 'heal'
                        };
                    }
                    return {
                        changes: { hissing: 2, smarts: -2 },
                        message: '徒弟太紧张了，在镜头前炸毛，把场面搞砸了。（过两天再试试）',
                        success: false,
                        effectType: 'neutral'
                    };
                }
            }
        ]
    },
    {
        id: 'side_apprentice_celeb_evil',
        chainId: 'apprentice',
        title: '师徒：黑料曝光',
        description: '逆徒在直播窗口外凄厉嚎叫。',
        image: getImg('直播事故', '991b1b'),
        type: 'SIDE_QUEST',
        allowedStages: ['CELEBRITY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_apprentice_celeb_evil'] && day <= failedAt['side_apprentice_celeb_evil'] + 1) {
                return { unlocked: false, reason: '需冷却' };
            }
            return {
                unlocked: completed.includes('side_apprentice_mansion_evil') && day >= 13,
                reason: '需第13天且宿怨'
            };
        },
        choices: [
            {
                id: 'app_choice_ignore_hater',
                text: '假装没听见',
                calculateChance: (stats) => 50 + stats.smarts * 0.3,
                effect: (stats) => {
                    if (roll(50 + stats.smarts * 0.3)) {
                        return {
                            changes: { hissing: -5, smarts: 5 },
                            message: '你淡定的表现被称为“佛系”。逆徒叫累了走了。',
                            success: true,
                            effectType: 'neutral'
                        }
                    }
                    return {
                        changes: { hissing: 5, health: -10 },
                        message: '观众被噪音吵走了。你压力过大脱发。（过两天再试试）',
                        success: false,
                        effectType: 'damage'
                    }
                }
            },
            {
                id: 'app_choice_expose',
                text: '隔窗对骂',
                calculateChance: (stats) => 100,
                effect: (stats) => ({
                    changes: { hissing: 30, smarts: -10 }, // Stage 4: Massive hiss gain for breaking character
                    message: '你疯狂哈气展示野性。直播间人气爆炸！猫设崩了，但你爽了。',
                    success: true,
                    effectType: 'damage'
                })
            }
        ]
    }
];
