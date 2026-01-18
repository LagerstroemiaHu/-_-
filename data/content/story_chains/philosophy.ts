
import { GameEvent } from '../../../types';
import { roll, pick, getImg } from '../../utils';

// 哲学线：从流浪到大同的猫生思考
export const PHILOSOPHY_QUESTS: GameEvent[] = [
    // ----------------------------------------------------------------
    // 阶段一：流浪 - 丛林法则 (Day 2+)
    // ----------------------------------------------------------------
    {
        id: 'phil_stray_jungle',
        chainId: 'philosophy',
        title: '悟道：丛林法则',
        description: '你和一只老猫同时发现了一块牛排。',
        image: getImg('丛林法则', '78350f'),
        type: 'SIDE_QUEST',
        allowedStages: ['STRAY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            // 冷却检查
            if (failedAt['phil_stray_jungle'] && day <= failedAt['phil_stray_jungle'] + 1) {
                return { unlocked: false, reason: '上次失败需冷却' };
            }
            return { unlocked: day >= 3 && stats.smarts > 15, reason: '需第3天且智力>15' };
        },
        choices: [
            {
                id: 'phil_choice_dominate',
                text: '强者独食 (抢夺)',
                calculateChance: (stats) => Math.min(95, 30 + stats.health * 0.5 + stats.hissing * 0.2),
                effect: (stats) => {
                    if (roll(30 + stats.health * 0.5 + stats.hissing * 0.2)) {
                        return {
                            changes: { satiety: 40, hissing: 5, smarts: 5 }, // Stage 1: small hiss gain
                            message: '你打跑了它。肉很香，但有点苦。你悟出了第一条真理：垃圾桶不相信眼泪。',
                            success: true,
                            effectType: 'damage'
                        };
                    }
                    return {
                        changes: { health: -10, satiety: -5 },
                        message: '老猫为了活命爆发了惊人的力量。你被咬伤了。（过两天再试试）',
                        success: false,
                        effectType: 'damage'
                    };
                }
            },
            {
                id: 'phil_choice_share',
                text: '弱者的互助 (分食)',
                calculateChance: (stats) => 90, // 修改：从100%降为90%
                effect: (stats) => {
                    if (roll(90)) {
                        return {
                            changes: { satiety: 15, smarts: 10, hissing: -5 },
                            message: '你撕下一半推给它。你们在寒风中分享了这顿饭。也许合作能让我们活下去。',
                            success: true,
                            effectType: 'heal'
                        };
                    }
                    return {
                        changes: { satiety: -5, hissing: 5 },
                        message: '你刚推过去，它就叼起整块肉跑了！该死的背叛。（过两天再试试）',
                        success: false,
                        effectType: 'neutral'
                    };
                }
            },
            {
                id: 'phil_choice_overthink_1',
                text: '思考肉的来源',
                calculateChance: (stats) => 100,
                effect: (stats) => ({
                    changes: { satiety: -10, smarts: 2, health: -5 },
                    message: '在你思考的时候，肉被狗叼走了。思考太多是会饿死的。',
                    success: false, // Intentional failure but no cooldown needed logic-wise, but for consistency:
                    effectType: 'neutral'
                })
            }
        ]
    },

    // ----------------------------------------------------------------
    // 阶段二：领主 - 封建契约 (Day 8+) - 错开时间
    // ----------------------------------------------------------------
    {
        id: 'phil_lord_contract',
        chainId: 'philosophy',
        title: '悟道：权力的本质',
        description: '一只黑猫质疑你为什么要收鱼头。',
        image: getImg('猫的王座', '581c87'),
        type: 'SIDE_QUEST',
        allowedStages: ['CAT_LORD'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['phil_lord_contract'] && day <= failedAt['phil_lord_contract'] + 1) {
                return { unlocked: false, reason: '需恢复威信' };
            }
            return {
                unlocked: completed.includes('phil_stray_jungle') && day >= 8,
                reason: '需第8天且完成前置'
            };
        },
        choices: [
            {
                id: 'phil_choice_divine_right',
                text: '因为我最强 (君权神授)',
                condition: (stats) => stats.hissing > 40, 
                calculateChance: (stats) => Math.min(95, 30 + stats.hissing * 0.8),
                effect: (stats) => ({
                    changes: { hissing: 10, smarts: 5 }, // Stage 2: moderate hiss gain
                    message: '你一巴掌把它拍翻：“因为是我赶走了野狗。我的武力就是你们安睡的保障。”',
                    success: true,
                    effectType: 'damage'
                })
            },
            {
                id: 'phil_choice_social_contract',
                text: '这是一种交易 (社会契约)',
                calculateChance: (stats) => Math.min(90, 30 + stats.smarts * 0.8),
                effect: (stats) => ({
                    changes: { smarts: 15, hissing: -5 },
                    message: '“你可以不交，但下次恶犬来袭时，别躲在我的身后。” 它沉默了。',
                    success: true,
                    effectType: 'neutral'
                })
            },
            {
                id: 'phil_choice_debate',
                text: '和它辩论',
                // 修复逻辑：确保 calculateChance 和 effect 内部使用的概率一致。
                calculateChance: (stats) => Math.min(80, 20 + stats.smarts * 0.6),
                effect: (stats) => {
                    const chance = Math.min(80, 20 + stats.smarts * 0.6);
                    if (roll(chance)) {
                        return { changes: { smarts: 10, hissing: -5 }, message: '你用逻辑说服了它。它听得晕头转向，最后交了双倍鱼头当学费。', success: true, effectType: 'neutral' };
                    }
                    return { changes: { hissing: -10, health: -5 }, message: '它不想听你的长篇大论，直接给了你一拳。暴力比哲学更管用。（过两天再试试）', success: false, effectType: 'damage' };
                }
            }
        ]
    },

    // ----------------------------------------------------------------
    // 阶段三：豪宅 - 资本异化 (Day 10+)
    // ----------------------------------------------------------------
    {
        id: 'phil_mansion_labor',
        chainId: 'philosophy',
        title: '悟道：罐头的代价',
        description: '铲屎官拿着逗猫棒，示意你跳圈才给罐头。',
        image: getImg('劳动异化', '1d4ed8'),
        type: 'SIDE_QUEST',
        allowedStages: ['MANSION'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['phil_mansion_labor'] && day <= failedAt['phil_mansion_labor'] + 1) {
                return { unlocked: false, reason: '需平复心情' };
            }
            return {
                unlocked: completed.includes('phil_lord_contract') && day >= 10,
                reason: '需第10天且完成前置'
            };
        },
        choices: [
            {
                id: 'phil_choice_work',
                text: '出卖色相 (打工)',
                calculateChance: (stats) => 90, // 修改：从100%降为90%
                effect: (stats) => {
                    if (roll(90)) {
                        return {
                            changes: { satiety: 30, smarts: 5, hissing: -5 }, // Stage 3: Hissing drops
                            message: '你跳了。我的可爱是生产资料，罐头是工资。我被异化成了商品。',
                            success: true,
                            effectType: 'neutral'
                        };
                    }
                    return {
                        changes: { hissing: 2, satiety: -5 },
                        message: '你跳得很敷衍，甚至绊了一跤。铲屎官笑了，但没给罐头。（过两天再试试）',
                        success: false,
                        effectType: 'neutral'
                    };
                }
            },
            {
                id: 'phil_choice_strike',
                text: '暴力罢工 (砸烂机器)',
                condition: (stats) => stats.hissing > 20,
                calculateChance: (stats) => Math.min(80, 20 + stats.hissing * 0.8),
                effect: (stats) => {
                    if (roll(20 + stats.hissing * 0.8)) {
                        return {
                            changes: { satiety: 40, hissing: 15, smarts: 10 }, // Big reward for rebellion
                            message: '你推翻了喂食器！你直接夺取了生产资料！铲屎官惊呆了。',
                            success: true,
                            effectType: 'damage'
                        };
                    }
                    return {
                        changes: { satiety: -10, hissing: 5 },
                        message: '推不动。铲屎官以为你在闹脾气，把你关了禁闭。（过两天再试试）',
                        success: false, // Changed to false to allow retry
                        effectType: 'neutral'
                    };
                }
            },
            {
                id: 'phil_choice_nihilism',
                text: '不吃也罢 (虚无主义)',
                calculateChance: (stats) => 100,
                effect: (stats) => ({
                    changes: { satiety: -15, smarts: 20, health: -5 },
                    message: '食欲是基因的枷锁。你绝食抗议，思考存在的意义。',
                    success: false,
                    effectType: 'damage'
                })
            }
        ]
    },

    // ----------------------------------------------------------------
    // 阶段四：终局 - 喵特纳雄耐尔 (Day 14+)
    // ----------------------------------------------------------------
    {
        id: 'phil_final_utopia',
        chainId: 'philosophy',
        title: '悟道：大同世界',
        description: '你拥有一切。窗外是寒风中的流浪猫。',
        image: getImg('喵特纳雄耐尔', 'be123c'),
        type: 'SIDE_QUEST',
        allowedStages: ['MANSION', 'CELEBRITY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['phil_final_utopia'] && day <= failedAt['phil_final_utopia'] + 1) {
                return { unlocked: false, reason: '革命需积蓄力量' };
            }
            return {
                unlocked: completed.includes('phil_mansion_labor') && day >= 14,
                reason: '需第14天且完成前置'
            };
        },
        choices: [
            {
                id: 'phil_choice_oligarch',
                text: '独善其身 (寡头)',
                calculateChance: (stats) => 90, // 修改：从100%降为90%
                effect: (stats) => {
                    if (roll(90)) {
                        return {
                            changes: { satiety: 20, smarts: -5, hissing: -10 },
                            message: '你拉上了窗帘。这是你努力（或出卖色相）得来的，你成为了既得利益者。',
                            success: true,
                            effectType: 'sleep'
                        };
                    }
                    return {
                        changes: { smarts: -2, health: -5 },
                        message: '你拉上窗帘，但窗外的惨叫声让你彻夜难眠。良心未泯是种折磨。',
                        success: false,
                        effectType: 'sleep'
                    };
                }
            },
            {
                id: 'phil_choice_revolution',
                text: '打翻粮仓 (再分配)',
                calculateChance: (stats) => Math.min(90, 40 + stats.smarts * 0.6),
                effect: (stats) => {
                    if (roll(40 + stats.smarts * 0.6)) {
                        return {
                            changes: { smarts: 20, hissing: 20, satiety: -10 }, // Huge hiss boost
                            message: '你把罐头推下阳台！流浪猫蜂拥而至。全世界流浪猫，联合起来！',
                            success: true,
                            effectType: 'neutral'
                        };
                    }
                    return {
                        changes: { hissing: 5, smarts: 5 },
                        message: '粮袋卡住了。你对着楼下叫了几声，只传来了风声。革命失败。（过两天再试试）',
                        success: false,
                        effectType: 'neutral'
                    };
                }
            },
            {
                id: 'phil_choice_simulation',
                text: '凝视虚空 (打破第四面墙)',
                calculateChance: (stats) => 50,
                effect: (stats) => {
                    if (roll(50)) {
                        return {
                            changes: { smarts: 100, health: -10, satiety: -10 },
                            message: '你意识到，你的猫生只是屏幕前某个碳基生物点击的结果。喵！(获得：超维智慧)',
                            success: true,
                            effectType: 'neutral'
                        }
                    }
                    return {
                        changes: { smarts: -10 },
                        message: '你盯着空气看了太久，觉得自己像个傻子。（过两天再试试）',
                        success: false,
                        effectType: 'neutral'
                    }
                }
            }
        ]
    }
];
