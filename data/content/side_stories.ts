
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
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            // 如果此任务在 failedAt 中，说明上次抵抗失败被强行绝育了，不可再重试
            if (failedAt['side_egg_crisis']) {
                return { unlocked: false, reason: '手术已完成' };
            }
            return { unlocked: day >= 7, reason: '需在豪宅待一段时日' };
        },
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
                        // 抵抗失败 = 相当于顺从命运（被绝育）
                        // 设为 success: false 会进入 failedAt，配合 unlockCondition 锁定任务
                        message: '反抗失败...虽然你拼死抵抗，但还是被强行带去了诊所。你失去了蛋蛋。（手术完成）', 
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
        description: '网上有人公开diss你，说你这只圆头耄耋全是摆拍，其实性格极其恶劣。',
        image: getImg('网络战争', '3b82f6'),
        type: 'SIDE_QUEST',
        allowedStages: ['CELEBRITY'],
        unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
            if (failedAt['side_hater_war'] && day <= failedAt['side_hater_war'] + 1) {
                return { unlocked: false, reason: '需冷却' };
            }
            return { unlocked: day >= 10, reason: '需成名后' };
        },
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
                    if (roll(Math.min(80, 20 + stats.hissing * 0.4 + stats.smarts * 0.4))) {
                        return {
                            changes: { hissing: 10, smarts: -2, satiety: 5 },
                            message: '你对着镜头哈了十分钟气，反向带货。流量爆炸了，但你的猫设变得暴力。',
                            success: true,
                            effectType: 'damage'
                        }
                    }
                    return {
                        changes: { hissing: 5, smarts: -5, health: -5 },
                        message: '对线失败，你被网友挖出了以前偷吃狗粮的黑料，气得肝疼。（过两天再试试）',
                        success: false,
                        effectType: 'damage'
                    }
                }
            }
        ]
    }
];

// 修改恋爱线逻辑以适配新需求
const MODIFIED_LOVE_QUESTS: GameEvent[] = LOVE_QUESTS.map(quest => {
    // 阶段三：玻璃之隔 - 失败可重试
    if (quest.id === 'side_hakimi_3') {
        return {
            ...quest,
            unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
                if (failedAt['side_hakimi_3'] && day <= failedAt['side_hakimi_3'] + 1) {
                    return { unlocked: false, reason: '需等待雨停' };
                }
                
                // 关键逻辑修改：必须经历过蛋蛋危机（side_egg_crisis在completed中），且没有顺从（history无choice_egg_surrender），且没有失败（failedAt无side_egg_crisis）
                const eggCrisisResolved = completed.includes('side_egg_crisis');
                const stillHasBalls = !history.includes('choice_egg_surrender') && !failedAt['side_egg_crisis'];

                return {
                    unlocked: completed.includes('side_hakimi_2') && day >= 11 && eggCrisisResolved && stillHasBalls,
                    reason: '需保住蛋蛋且旧情未了'
                };
            },
            choices: quest.choices.map(c => {
                if (c.id === 'love_choice_open_window') {
                    return {
                        ...c,
                        effect: (stats) => {
                             if (roll(30 + stats.smarts * 0.6)) {
                                return {
                                    changes: { health: 5, hissing: 10, smarts: 5 }, 
                                    message: '你拨开了锁扣！哈基米跳了进来。在你的坚持下，铲屎官不得不收留了她。(获得成就：儿孙满堂)',
                                    success: true,
                                    effectType: 'heal'
                                };
                            }
                            return {
                                changes: { hissing: 5, health: -5 },
                                message: '窗户锁死了！你拼命挠玻璃，但无济于事。她失望地消失在雨夜中。（过两天再试试）',
                                success: false, // 保持失败状态，以便再次触发
                                effectType: 'damage'
                            };
                        }
                    }
                }
                return c;
            })
        };
    }
    // 阶段三分支：已绝育 - 判定条件修改
    if (quest.id === 'side_hakimi_3_neutered') {
        return {
            ...quest,
            unlockCondition: (day, stats, completed, history, completedAt, failedAt) => {
                if (failedAt['side_hakimi_3_neutered'] && day <= failedAt['side_hakimi_3_neutered'] + 1) {
                    return { unlocked: false, reason: '需平复心情' };
                }
                
                // 逻辑：必须已经没有蛋蛋了 (顺从了 OR 抵抗失败了)
                const lostBalls = history.includes('choice_egg_surrender') || !!failedAt['side_egg_crisis'];

                return {
                    // 触发条件：前置任务完成 + 11天后 + 已失去蛋蛋
                    unlocked: completed.includes('side_hakimi_2') && day >= 11 && lostBalls,
                    reason: '需第11天但身已残'
                };
            }
        }
    }
    return quest;
});

// 合并所有支线
export const SIDE_STORIES: GameEvent[] = [
    ...PHILOSOPHY_QUESTS,
    ...MODIFIED_LOVE_QUESTS,
    ...APPRENTICE_QUESTS,
    ...MISC_QUESTS
];
