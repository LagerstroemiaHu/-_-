
import { GameEvent } from '../../types';
import { roll, pick, getImg } from '../utils';

export const SUDDEN_EVENTS: GameEvent[] = [
    {
        id: 'sudden_carrot_tissue',
        title: '突发：艰难抉择',
        description: '主人让你选择：', 
        image: getImg('艰难抉择', '111827'),
        type: 'AUTO',
        // Reduced from 70% to 20%
        autoTriggerCondition: (day, stats, stage) => (stage === 'MANSION' || stage === 'CELEBRITY') && roll(20),
        choices: [
            {
                id: 'carrot',
                text: '萝卜',
                effect: (stats) => ({
                    changes: { satiety: 15 },
                    message: '蒸蚌',
                    success: true,
                    effectType: 'heal'
                })
            },
            {
                id: 'tissue',
                text: '纸巾',
                effect: (stats) => ({
                    changes: {},
                    message: '选错了，再选一次',
                    success: false,
                    retry: true 
                })
            }
        ]
    },
    {
        id: 'sudden_gluttony',
        title: '突发：消化不良',
        description: '警告：你吃得太多太好了。你的肚子涨得像个气球，连路都走不动。过度的安逸是流浪猫的大忌。',
        image: getImg('暴饮暴食', 'f59e0b'),
        type: 'AUTO',
        // Reduced from 60% to 25%
        autoTriggerCondition: (day, stats, stage) => stats.satiety > 90 && stats.health > 80 && roll(25),
        choices: [
            {
                id: 'vomit_pain',
                text: '呕...好难受',
                calculateChance: (stats) => 25,
                effect: (stats) => {
                    if (roll(25)) {
                        return {
                            changes: { health: -10, satiety: -10 },
                            message: '你找了个草丛解决了问题。虽然有点虚弱，但胃舒服多了。',
                            success: true,
                            effectType: 'heal'
                        }
                    }
                    return {
                        changes: { health: -30, satiety: -30, hissing: -10 },
                        message: '你在草丛里吐得昏天黑地。刚才吃的美味全白费了，还让你虚弱不堪。',
                        success: false,
                        effectType: 'damage'
                    }
                }
            },
            {
                id: 'sleep_it_off',
                text: '强行消化',
                calculateChance: (stats) => Math.min(60, stats.health * 0.8),
                effect: (stats) => {
                    if (roll(Math.min(15, stats.health * 0.8))) {
                         return { 
                             changes: { satiety: -5, health: -5 }, 
                             message: '你趴在地上哼哼了一下午，终于缓过来了。虽然肚子还是不舒服，但至少没吐。', 
                             success: true, 
                             effectType: 'sleep' 
                         };
                    }
                    return { 
                        changes: { health: -10, satiety: -10 }, 
                        message: '你的胃在抗议！剧烈的腹痛让你在地上打滚。不仅没消化，反而更严重了。', 
                        success: false, 
                        effectType: 'damage' 
                    };
                }
            }
        ]
    },
    {
        id: 'sudden_ego_check',
        title: '突发：盲目自信',
        description: '你最近太嚣张了。你以为自己是狮子王，结果在一只真•恶犬面前翻了车。',
        image: getImg('盲目自信', 'b91c1c'),
        type: 'AUTO',
        // Reduced from 60% to 20%
        autoTriggerCondition: (day, stats, stage) => stage === 'STRAY' && stats.hissing > 80 && roll(20),
        choices: [
            {
                id: 'get_beaten',
                text: '正面硬刚',
                effect: (stats) => ({
                    changes: { health: -15, hissing: -20 },
                    message: '你被追了五条街。你的耳朵被咬了一个缺口。你意识到自己只是一只老猫，不是神。',
                    success: false,
                    effectType: 'damage'
                })
            },
            {
                id: 'hide_shame',
                text: '立刻认怂',
                calculateChance: (stats) => 90,
                effect: (stats) => {
                    if (roll(90)) {
                        return {
                            changes: { hissing: -20, smarts: 5 },
                            message: '你立刻翻肚皮投降。虽然狗一脸懵逼地走了，但目睹这一切的小猫都在窃笑。',
                            success: true,
                            effectType: 'neutral'
                        }
                    }
                    return {
                        changes: { health: -5, hissing: -10 },
                        message: '你都投降了，那只恶犬还是咬了你一口。太没品了！',
                        success: false,
                        effectType: 'damage'
                    }
                }
            }
        ]
    },
    {
        id: 'sudden_depression',
        title: '突发：存在主义危机',
        description: '你太聪明了。你开始思考“猫生的意义”。为什么我们要抓老鼠？为什么天是蓝的？这种思考让你感到虚无。',
        image: getImg('猫生哲学', '1e3a8a'),
        type: 'AUTO',
        // Reduced from 40% to 15%
        autoTriggerCondition: (day, stats, stage) => stats.smarts > 70 && stage !== 'CELEBRITY' && roll(15),
        choices: [
            {
                id: 'depressed',
                text: '陷入沉思',
                calculateChance: (stats) => 90,
                effect: (stats) => {
                    if (roll(90)) {
                        return {
                            changes: { hissing: -10, satiety: -5, smarts: 5 },
                            message: '你对着墙壁发呆了一整天。你觉得一切都索然无味。哈气值大幅下降。',
                            success: true,
                            effectType: 'neutral'
                        }
                    }
                    return {
                        changes: { health: -2, satiety: -10, smarts: -2 },
                        message: '你想得太深，导致头痛欲裂，连饭都忘了吃。',
                        success: false,
                        effectType: 'damage'
                    }
                }
            },
            {
                id: 'play_dumb',
                text: '去追尾巴',
                calculateChance: (stats) => 90,
                effect: (stats) => {
                    if (roll(90)) {
                        return {
                            changes: { smarts: -5, health: 5, satiety: -2 },
                            message: '你强行让自己做些蠢事。虽然智商下降了，但那种快乐又回来了。',
                            success: true,
                            effectType: 'neutral'
                        }
                    }
                    return {
                        changes: { smarts: -1, hissing: -2 },
                        message: '你转了两圈就晕了，不仅没快乐起来，还觉得自己像个傻子。',
                        success: false,
                        effectType: 'neutral'
                    }
                }
            }
        ]
    },
    {
        id: 'sudden_weakness',
        title: '突发：旧伤复发',
        description: '阴雨天。你年轻时留下的伤腿开始隐隐作痛。岁月不饶猫啊。',
        image: getImg('旧伤复发', '57534e'),
        type: 'AUTO',
        // Reduced from 20% to 10%
        autoTriggerCondition: (day, stats, stage) => day > 10 && roll(10),
        choices: [
            {
                id: 'ouch',
                text: '硬撑',
                effect: (stats) => ({
                    changes: { health: -20 },
                    message: '你今天不得不跛着脚走路。行动力受到影响。',
                    success: false,
                    effectType: 'damage'
                })
            },
            {
                id: 'rest_day',
                text: '彻底躺平',
                calculateChance: (stats) => 90,
                effect: (stats) => {
                    if (roll(80)) {
                        return {
                            changes: { satiety: -20, health: -5 },
                            message: '你决定今天什么都不做。虽然肚子饿得咕咕叫，但腿稍微舒服点了。',
                            success: true,
                            effectType: 'sleep'
                        }
                    }
                    return {
                        changes: { satiety: -25, health: -15 },
                        message: '躺了一天，结果腿更麻了，肚子也饿扁了。',
                        success: false,
                        effectType: 'damage'
                    }
                }
            }
        ]
    },
     {
        id: 'sudden_kindness',
        title: '突发：神的怜悯',
        description: '你快饿死了。就在你眼冒金星的时候，天上掉下了一个肉包子（或者是谁没拿稳）。',
        image: getImg('天降肉包', 'fbbf24'),
        type: 'AUTO',
        // Reduced from 70% to 30% (keep it slightly higher as it's a helper event)
        autoTriggerCondition: (day, stats, stage) => stats.satiety < 10 && roll(30),
        choices: [
            {
                id: 'eat_save',
                text: '狼吞虎咽',
                calculateChance: (stats) => 80,
                effect: (stats) => {
                    if (roll(80)) {
                        return {
                            changes: { satiety: 20, health: 5 },
                            message: '感谢猫神！你活下来了。虽然肉包有点凉，但在你嘴里胜过满汉全席。',
                            success: true,
                            effectType: 'heal'
                        }
                    }
                    return {
                        changes: { satiety: 5, health: -5 },
                        message: '你吃太快噎住了！虽然不饿了，但喉咙痛得要命。',
                        success: false,
                        effectType: 'damage'
                    }
                }
            },
            {
                id: 'save_half',
                text: '留一半当夜宵',
                calculateChance: (stats) => 95,
                effect: (stats) => {
                    if (roll(95)) {
                        return {
                            changes: { satiety: 10, smarts: 5 },
                            message: '你克制住了欲望，把一半藏了起来。这种未雨绸缪的智慧让你感到自豪。',
                            success: true,
                            effectType: 'heal'
                        }
                    }
                    return {
                        changes: { satiety: 10 },
                        message: '你刚藏好，就被老鼠偷走了。早知道就全吃了！',
                        success: false,
                        effectType: 'neutral'
                    }
                }
            }
        ]
    }
];
