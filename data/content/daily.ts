
import { GameEvent } from '../../types';
import { roll, pick, getImg } from '../utils';

export const DAILY_ACTIONS: GameEvent[] = [
  // ===================== 全阶段通用日常 (Universal Actions) =====================
  {
    id: 'nap',
    title: '睡大觉',
    description: '不论是称霸街头还是统治豪宅，充足的睡眠都是力量的来源。',
    image: getImg('睡大觉', '1e1b4b'),
    type: 'DAILY',
    hints: [{ stat: '健康', change: 'up' }, { stat: '饱腹', change: 'down' }],
    choices: [
        {
            id: 'deep_sleep',
            text: '深度睡眠',
            calculateChance: (stats) => 80,
            effect: (stats) => {
                if (roll(80)) {
                    const msg = pick([
                        '你梦见自己回到了食物链的顶端。在梦里，你无所不能。健康得到了显著恢复。',
                        '这觉睡得昏天黑地，醒来后感觉精力充沛。毛发看起来更有光泽了。',
                        '你找到了一个完美的避风港，静谧的睡眠治愈了你所有的疲惫。',
                        '你在梦中抓住了那个红点。身心愉悦。'
                    ]);
                    return { changes: { health: 12, satiety: -4 }, message: msg, success: true, effectType: 'sleep' };
                }
                const failMsg = pick([
                    '你刚进入深度睡眠，就被一阵刺耳的喇叭声惊醒。不仅没休息好，心脏还怦怦跳。',
                    '你在睡梦中翻了个身，不小心掉进了旁边的水坑/地板缝里，狼狈不堪。',
                    '有一只讨厌的蚊子一直绕着你的耳朵转，这觉睡得异常痛苦。',
                    '你梦见自己被绝育了，惊醒后一身冷汗。'
                ]);
                return { changes: { health: -5, satiety: -5 }, message: failMsg, success: false, effectType: 'damage', sound: 'fail' };
            }
        },
        {
            id: 'light_nap',
            text: '浅睡打盹',
            calculateChance: (stats) => 90,
            effect: (stats) => {
                if (roll(90)) {
                    const msg = pick([
                        '你眯着眼观察周围，同时给身体充了点电。这种半梦半醒的状态最安全。',
                        '只是打了个盹，你就恢复了精神。随时准备应对突发状况。',
                        '这种偷闲的快感让你的心情变好了，虽然恢复不多但胜在稳妥。'
                    ]);
                    return { changes: { health: 8, satiety: -3 }, message: msg, success: true, effectType: 'heal' };
                }
                const failMsg = pick([
                    '哪怕是打盹，你也被落下的树叶惊飞了。流浪的神经果然还是太紧张。',
                    '你的脖子睡僵了，现在歪着头看起来像个傻子。',
                    '由于睡姿不对，你的腿麻了，站起来的时候像个醉汉。'
                ]);
                return { changes: { health: -2 }, message: failMsg, success: false, effectType: 'neutral' };
            }
        }
    ]
  },
  {
    id: 'observe_human',
    title: '观察人类',
    description: '人类是种奇怪的生物。通过观察他们，你可以提升智慧，或者通过模仿变蠢。',
    image: getImg('观察人类', '1e3a8a'),
    type: 'DAILY',
    hints: [{ stat: '智力', change: 'up' }, { stat: '智力', change: 'down' }],
    choices: [
        {
            id: 'philosophical_study',
            text: '研究逻辑 (智力+)',
            calculateChance: (stats) => Math.min(95, 30 + stats.smarts * 0.7),
            effect: (stats) => {
                if (roll(30 + stats.smarts * 0.7)) {
                    const msg = pick([
                        '你发现人类总是在忙碌于无意义的事情。这种优越感让你的智力大幅上涨。',
                        '你从人类的争吵中悟出了“平衡”的道理。你感觉自己离猫神又近了一步。',
                        '你观察了一整天路人的表情，总结出了一套《人类投喂概率学》。'
                    ]);
                    return { changes: { smarts: 5, satiety: -5 }, message: msg, success: true, effectType: 'neutral' };
                }
                const failMsg = pick([
                    '你想得太多，导致大脑过载，现在除了想吃鱼什么也思考不出来。',
                    '你盯着路人看太久，被以为是在瞪人，被人类丢了一个空瓶子。',
                    '这种深奥的思考让你感到前所未有的空虚，猫生无常啊。'
                ]);
                return { changes: { smarts: -2, satiety: -5 }, message: failMsg, success: false, effectType: 'damage' };
            }
        },
        {
            id: 'imitate_silly',
            text: '模仿傻事 (智力-)',
            calculateChance: (stats) => 100, // 保持为纯娱乐选项，100%成功（因为变蠢本身就是一种“失败”）
            effect: (stats) => {
                const msg = pick([
                    '你学着人类的样子追自己的尾巴。虽然智商看起来下降了，但心情变好了。',
                    '你试图直立行走，结果摔得很滑稽。通过放弃思考，你获得了快乐。',
                    '你对着空气打了一套王八拳。放弃理智的感觉真好。'
                ]);
                return { changes: { smarts: -8, health: 3, satiety: -3 }, message: msg, success: true, effectType: 'heal' };
            }
        }
    ]
  },
  {
    id: 'groom',
    title: '舔猫毛',
    description: '清洁是猫的尊严。必须时刻保持光鲜亮丽，这是强者的修养。',
    image: getImg('舔猫毛', 'ec4899'),
    type: 'DAILY',
    hints: [{ stat: '哈气', change: 'up' }, { stat: '健康', change: 'up' }],
    choices: [
        {
            id: 'full_service',
            text: '全身大洗护',
            calculateChance: (stats) => 74,
            effect: (stats) => {
                if (roll(74)) {
                    const msg = pick([
                        '从耳尖到尾尖，你每一根毛都顺滑如丝。你感觉自己散发着大佬的魅力。',
                        '全套洗护完成！你现在看起来简直可以去拍猫粮广告，哈气值上涨。',
                        '这种自律让你感到自豪。你找回了当年作为“街区第一帅猫”的感觉。'
                    ]);
                    return { changes: { health: 5, hissing: 3, smarts: 2 }, message: msg, success: true, effectType: 'heal' };
                }
                const failMsg = pick([
                    '你不小心吞下了太多猫毛。现在你一直在干呕，感觉胃里结了个大球。',
                    '舔到一半被雨淋了，现在的你看起来像一只刚从洗衣机里出来的抹布。',
                    '由于太用力，你把自己舔秃了一小块。太尴尬了！'
                ]);
                return { changes: { health: -5, hissing: -4 }, message: failMsg, success: false, effectType: 'damage' };
            }
        },
        {
            id: 'focus_round_head',
            text: '重点打理头部',
            calculateChance: (stats) => 83,
            effect: (stats) => {
                if (roll(83)) {
                    const msg = pick([
                        '你精准地打理了头顶的毛发。完美，依旧是那个让无数猫咪仰望的大佬。',
                        '只要头够圆/亮，世界就没法打败我。你感觉自信心爆棚。',
                        '简单的打理让你看起来神清气爽。这种优雅是骨子里透出来的。'
                    ]);
                    return { changes: { hissing: 3, smarts: 2 }, message: msg, success: true, effectType: 'neutral' };
                }
                const failMsg = pick([
                    '怎么弄都不满意，你开始怀疑是不是最近翻垃圾桶吃胖了。',
                    '你发现了一根白胡须，这让你意识到岁月的残酷。心情大减。',
                    '你在打理时被一个小孩摸了一把，刚梳好的造型全毁了。'
                ]);
                return { changes: { hissing: -2, smarts: -2 }, message: failMsg, success: false, effectType: 'neutral' };
            }
        }
    ]
  },

  // ===================== STRAY STAGE (Stage 1) =====================
  {
    id: 'hiss_training',
    title: '街角练胆',
    description: '你可以练习如何更凶狠（增加哈气），或者练习如何变得温顺（减少哈气）。',
    image: getImg('哈气训练', '4c1d95'),
    type: 'DAILY',
    hints: [{ stat: '哈气', change: 'up' }, { stat: '哈气', change: 'down' }],
    allowedStages: ['STRAY'],
    choices: [
        {
            id: 'wild_roar',
            text: '练习咆哮 (哈气+)',
            calculateChance: (stats) => Math.min(95, 40 + stats.health * 0.5),
            effect: (stats) => {
                if (roll(50 + stats.health * 0.5+stats.hissing * 0.5)) {
                    const msg = pick([
                        '你发出了极具威慑力的哈气声，连路过的野狗都被惊动了。野性+。',
                        '你弓起脊背，感受到了血液中的野性在苏醒。',
                        '你的眼神变得犀利。现在的你，不再是那个只会被驱赶的弱者。'
                    ]);
                    return { changes: { hissing: 5, smarts: 2, satiety: -5 }, message: msg, success: true, effectType: 'neutral', sound: 'hiss' };
                }
                const failMsg = pick([
                    '你用力过猛，差点把自己呛到。嗓子果然还是太久没用了。',
                    '哈到一半打了个喷嚏，野性全无。',
                    '被路过的清洁大妈笑话了：“这猫怎么一惊一乍的？”'
                ]);
                return { changes: { hissing: -2, satiety: -2 }, message: failMsg, success: false, effectType: 'neutral' };
            }
        },
        {
            id: 'practice_purr',
            text: '练习夹子音 (哈气-)',
            calculateChance: (stats) => 90, // 修改：从100%降为90%
            effect: (stats) => {
                if (roll(90)) {
                    const msg = pick([
                        '你对着空气练习“喵~”。声音软糯，你自己都起鸡皮疙瘩了。野性大幅下降。',
                        '你尝试收起獠牙，做出无辜的表情。为了生存，不寒碜。',
                        '你学会了如何用头蹭空气。这是家猫的必修课。'
                    ]);
                    return { changes: { hissing: -5, smarts: 2, satiety: -2 }, message: msg, success: true, effectType: 'neutral', sound: 'meow' };
                }
                const failMsg = pick([
                    '你被自己的口水呛到了，发出了像拖拉机一样的声音。',
                    '你努力想装可爱，结果表情看起来像便秘。',
                    '你刚张嘴，就被一只虫子飞进了喉咙。夹子音变成了干呕。'
                ]);
                return { changes: { hissing: 1, satiety: -1 }, message: failMsg, success: false, effectType: 'neutral' };
            }
        }
    ]
  },
  {
    id: 'forage_trash',
    title: '翻垃圾桶',
    description: '费力地翻找垃圾。你可以选择快速翻找，或者深入底部。',
    image: getImg('翻垃圾桶', 'd97706'),
    type: 'DAILY',
    hints: [{ stat: '饱腹', change: 'up' }, { stat: '健康', change: 'down' }],
    allowedStages: ['STRAY'], 
    choices: [
        {
            id: 'deep_dive',
            text: '深入挖掘',
            calculateChance: (stats) => Math.min(85, 50 + stats.health * 0.4),
            effect: (stats) => {
                if (roll(50 + stats.health * 0.4)) {
                    const msg = pick([
                        '你在最底下找到了半个汉堡！而且还没发霉。',
                        '一整袋炸鸡骨头！虽然有点脏，但肉很多。',
                        '一条完整的鱼骨，上面还连着不少肉。'
                    ]);
                    return { changes: { satiety: 15, health: -8, hissing: 2 }, message: msg, success: true, effectType: 'heal' };
                }
                const failMsg = pick([
                    '你被藏在底下的碎玻璃划伤了爪子。',
                    '你掉进了一个充满腐烂液体的袋子里。恶心死了。',
                    '你翻到了某种化学试剂。现在你感觉头晕眼花。'
                ]);
                return { changes: { satiety: 0, health: -15 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
            }
        },
        {
            id: 'safe_pick',
            text: '表面搜寻',
            calculateChance: (stats) => Math.min(95, 70 + stats.smarts * 0.3),
            effect: (stats) => {
                if (roll(70 + stats.smarts * 0.3)) {
                     const msg = pick(['找到了一些面包屑。', '几根还可以吃的薯条。', '半个馒头。']);
                     return { changes: { satiety: 6 }, message: msg, success: true, effectType: 'heal' };
                }
                const failMsg = pick([
                    '表面全是纸巾和塑料袋，一无所获。',
                    '垃圾桶刚刚被清洁工倒空了。来晚了一步。',
                    '你在翻找时被路人扔进来的咖啡泼了一身。'
                ]);
                return { changes: { satiety: 0, hissing: 2 }, message: failMsg, success: false, effectType: 'neutral' };
            }
        }
    ]
  },
  {
    id: 'hunt_mouse',
    title: '捕猎老鼠',
    description: '这是一场赌上尊严的高强度运动。你可以选择伏击或者追逐。',
    image: getImg('捕猎老鼠', '991b1b'),
    type: 'DAILY',
    hints: [{ stat: '饱腹', change: 'up' }, { stat: '哈气', change: 'up' }],
    allowedStages: ['STRAY', 'CAT_LORD'], 
    choices: [
        {
            id: 'chase',
            text: '极速追杀',
            calculateChance: (stats) => Math.min(90, 40 + stats.health * 0.5 + stats.hissing * 0.5),
            effect: (stats) => {
                if (roll(40 + stats.health * 0.5 + stats.hissing * 0.5)) {
                    const msg = pick([
                        '你跑得肺都要炸了，但终于抓住了它。美味！',
                        '一场教科书般的追逐战。你按住了老鼠的尾巴。',
                        '虽然撞翻了垃圾桶，但猎物到手了。蛋白质是无辜的。'
                    ]);
                    return { changes: { satiety: 14, hissing: 4, health: -5 }, message: msg, success: true, effectType: 'neutral', sound: 'impact' };
                }
                const failMsg = pick([
                    '它钻进了洞里，你一头撞在了墙上。',
                    '你滑倒了。老鼠回头嘲笑你，甚至还在你面前梳理胡须。',
                    '体力不支。你眼睁睁看着它溜走，只抓到了一嘴灰。'
                ]);
                return { changes: { satiety: -5, health: -10 }, message: failMsg, success: false, effectType: 'damage', sound: 'fail' };
            }
        },
        {
            id: 'ambush',
            text: '耐心伏击',
            calculateChance: (stats) => Math.min(85, 30 + stats.smarts * 0.6),
            effect: (stats) => {
                 if (roll(30 + stats.smarts * 0.6)) {
                     const msg = pick([
                         '你像雕塑一样蹲了半小时。老鼠以为你走了，刚探头就被你按住。',
                         '耐心的猎人总有回报。你几乎没费力气就抓到了它。',
                         '你预判了它的预判。在洞口守株待兔成功。'
                     ]);
                     return { changes: { satiety: 10, hissing: 3 }, message: msg, success: true, effectType: 'neutral', sound: 'impact' };
                 }
                 const failMsg = pick([
                     '你蹲到腿都麻了，老鼠根本没出来。浪费时间。',
                     '一只狗突然跑过来把你吓跑了，埋伏失败。',
                     '你睡着了...老鼠从你身上踩了过去。'
                 ]);
                 return { changes: { satiety: -5 }, message: failMsg, success: false, effectType: 'neutral' };
            }
        }
    ]
  },
  {
    id: 'parkour',
    title: '跑酷训练',
    description: '在障碍物间飞奔。这非常消耗体能和卡路里，但能极大地锻炼你的灵活性和健康。',
    image: getImg('练习跑酷', '059669'),
    type: 'DAILY',
    hints: [{ stat: '健康', change: 'up' }],
    allowedStages: ['STRAY'],
    choices: [
        {
            id: 'hardcore',
            text: '极限跑酷',
            calculateChance: (stats) => Math.min(85, 40 + stats.health * 0.8),
            effect: (stats) => {
                if (stats.health < 30) return { changes: { health: -15 }, message: '你的身体承受不住这种强度，摔得很惨。', success: false, effectType: 'damage', sound: 'impact' };
                if (roll(40 + stats.health * 0.8)) {
                    const msg = pick([
                        '你在围墙间飞跃，感觉自己像一只飞鼠！',
                        '连续跳过三个垃圾桶，动作行云流水，引来路人侧目。',
                        '你成功爬上了最高的树枝，俯瞰众生。'
                    ]);
                    return { changes: { health: 8, satiety: -5, hissing: 4 }, message: msg, success: true, effectType: 'neutral' };
                }
                const failMsg = pick([
                    '步子迈大了，扯到了...总之你摔了下来。',
                    '爪子没抓稳，从墙头滑落，掉进了泥坑。',
                    '跳跃途中被一只鸟吓了一跳，落地姿势很难看。'
                ]);
                return { changes: { health: -5, satiety: -5 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
            }
        },
        {
            id: 'stretch',
            text: '伸展运动',
            calculateChance: (stats) => 85,
            effect: (stats) => {
                if (roll(85)) {
                    const msg = pick([
                        '你做了一套广播体操。虽然不帅，但很舒服。',
                        '拉伸了一下身体，感觉经络通畅了。',
                        '简单地磨了磨爪子，伸了个腰。'
                    ]);
                    return { changes: { health: 5, satiety: -2 }, message: msg, success: true, effectType: 'heal' };
                }
                const failMsg = pick([
                    '拉伸过度，腿抽筋了。',
                    '刚伸了个腰就被路人拌了一跤。',
                    '动作太慢，被路过的虫子咬了一口。'
                ]);
                return { changes: { health: -2 }, message: failMsg, success: false, effectType: 'neutral' };
            }
        }
    ]
  },
  {
    id: 'beg_human',
    title: '路边乞讨',
    description: '不需要体力，只需要抛弃尊严。这种行为会让你的野性（哈气）大幅降低。',
    image: getImg('路边乞讨', '4f46e5'),
    type: 'DAILY',
    hints: [{ stat: '饱腹', change: 'up' }, { stat: '哈气', change: 'down' }],
    allowedStages: ['STRAY'],
    choices: [
        {
            id: 'rub_legs',
            text: '疯狂蹭腿',
            calculateChance: (stats) => Math.min(90, 50 + (100 - stats.hissing) * 0.5),
            effect: (stats) => {
                if(roll(50 + (100 - stats.hissing) * 0.5)) {
                    const msg = pick([
                        '路人被你的热情融化了，给你买了一根热狗。',
                        '你成功把毛蹭到了路人的黑裤子上，作为交换，他给了你半个汉堡。',
                        '一位老奶奶觉得你太可怜了，特意去便利店给你买了罐头。'
                    ]);
                    return { changes: { satiety: 12, hissing: -5 }, message: msg, success: true, effectType: 'heal', sound: 'meow' };
                }
                const failMsg = pick([
                    '“走开！”路人嫌你脏，踢了你一脚。',
                    '这人对猫毛过敏，打着喷嚏把你推开了。',
                    '你蹭错人了，那是一只刚遛完弯的大金毛。'
                ]);
                return { changes: { health: -5, hissing: 3 }, message: failMsg, success: false, effectType: 'damage', sound: 'fail' };
            }
        },
        {
            id: 'meow_distance',
            text: '远距离卖萌',
            calculateChance: (stats) => 90,
            effect: (stats) => {
                if (roll(90)) {
                    const msg = pick([
                        '你坐在路边喵喵叫。有人扔给了你一小块面包。',
                        '虽然没人停下来，但你在垃圾桶旁捡到了路人掉落的饼干。',
                        '保持距离让你感到安全，虽然收获不多。'
                    ]);
                    return { changes: { satiety: 6, hissing: -2 }, message: msg, success: true, effectType: 'heal', sound: 'meow' };
                }
                const failMsg = pick([
                    '你叫破了喉咙也没人理你。',
                    '路过的熊孩子朝你扔了石头。',
                    '你的叫声太难听了，被路人嫌弃。'
                ]);
                return { changes: { satiety: -2, hissing: 2 }, message: failMsg, success: false, effectType: 'neutral' };
            }
        }
    ]
  },
  {
    id: 'fight_stray',
    title: '争抢地盘',
    description: '那只独耳猫越界了。你可以选择暴力驱逐（增加哈气）或者威慑。',
    image: getImg('地盘争夺', 'b91c1c'),
    type: 'DAILY',
    hints: [{ stat: '哈气', change: 'up' }, { stat: '健康', change: 'down' }],
    allowedStages: ['STRAY'],
    choices: [
        {
            id: 'fight_hard',
            text: '全力出击 (哈气+)',
            calculateChance: (stats) => Math.min(90, 40 + stats.health * 0.5+stats.hissing * 0.2),
            effect: (stats) => {
                if(roll(40 + stats.health * 0.5+stats.hissing * 0.2)) {
                    const msg = pick([
                        '你把对方打跑了。这片垃圾桶是你的了！野性大增！',
                        '一阵猫毛乱飞，你骑在它身上取得了胜利。',
                        '你咬住了它的耳朵，它惨叫着逃窜。你也受了点皮外伤。'
                    ]);
                    return { changes: { hissing: 5, health: -5 }, message: msg, success: true, effectType: 'damage', sound: 'impact' };
                }
                const failMsg = pick([
                    '你被打得落荒而逃。耻辱！',
                    '对方比你年轻力壮，你被按在地上摩擦。',
                    '你高估了自己的牙口，咬到了石头。'
                ]);
                return { changes: { health: -15, hissing: -5 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
            }
        },
        {
            id: 'ignore_weak',
            text: '放它一马 (哈气-)',
            calculateChance: (stats) => 100, // 保持100%，这是被动选择
            effect: (stats) => {
                const msg = pick([
                    '你看了它一眼，懒得动。对方以为你不屑一顾，灰溜溜走了。',
                    '和平共处吧。你今天的杀心不重。',
                    '你甚至让出了半个垃圾桶。你的心变软了。'
                ]);
                return { changes: { hissing: -3, smarts: 2 }, message: msg, success: true, effectType: 'neutral' };
            }
        }
    ]
  },

  // ===================== CAT LORD STAGE (Stage 2) =====================
  {
      id: 'collect_fees',
      title: '收保护费',
      description: '向小弟索要食物。这能快速填饱肚子，但如果手段太强硬可能会受伤。',
      image: getImg('收保护费', '581c87'),
      type: 'DAILY',
      hints: [{ stat: '饱腹', change: 'up' }, { stat: '哈气', change: 'up' }], // Prioritize Satiety
      allowedStages: ['CAT_LORD'],
      choices: [
          {
              id: 'bully',
              text: '武力征收',
              calculateChance: (stats) => Math.min(95, 20 + stats.health * 0.8),
              effect: (stats) => {
                  if (roll(20 + stats.health * 0.8)) {
                      const msg = pick([
                          '别的猫瑟瑟发抖，献上了小鱼干。你的恶名远扬。',
                          '你抢了一只胖橘的晚餐。它敢怒不敢言。',
                          '暴力是唯一的语言。你吃得很饱。'
                      ]);
                      return { changes: { satiety: 15, hissing: 5, smarts: -2 }, message: msg, success: true, effectType: 'neutral', sound: 'hiss' };
                  }
                  const failMsg = pick([
                      '遇到个愣头青，虽然打赢了，但你也挂了彩。',
                      '这只猫宁死不从，抓伤了你的鼻子。',
                      '你被一群猫围攻了。双拳难敌四手。'
                  ]);
                  return { changes: { hissing: -5, health: -10 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
              }
          },
          {
              id: 'protect',
              text: '提供庇护',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你承诺保护小猫，换取了少量的食物。这叫可持续发展。',
                          '你帮它们赶走了大黄狗，它们感激地送上了鱼骨头。',
                          '公平交易。你维持了秩序，也填饱了肚子。'
                      ]);
                      return { changes: { hissing: -10, smarts: 4, satiety: 8 }, message: msg, success: true, effectType: 'heal', sound: 'meow' };
                  }
                  const failMsg = pick([
                      '这群小猫即使被保护也不交保护费，白干一场。',
                      '你赶跑了敌人，但小猫们早就吓跑了，没拿到食物。',
                      '有个刺头说不需要你的保护，场面一度很尴尬。'
                  ]);
                  return { changes: { hissing: -2, satiety: -5 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'judge_minions',
      title: '圆桌会议',
      description: '消耗脑力来解决小弟们的纠纷。你可以选择公正裁决（增加智力）或者摆烂（减少智力）。',
      image: getImg('圆桌会议', '1e3a8a'),
      type: 'DAILY',
      hints: [{ stat: '智力', change: 'up' }, { stat: '智力', change: 'down' }],
      allowedStages: ['CAT_LORD'],
      choices: [
          {
              id: 'wise_choice',
              text: '公正裁决 (智力+)',
              calculateChance: (stats) => Math.min(90, 30 + stats.smarts * 0.7),
              effect: (stats) => {
                  if(roll(30 + stats.smarts * 0.7)) {
                      const msg = pick([
                          '你的智慧让猫叹服。大家一致认为你是最英明的领袖。',
                          '你巧妙地分配了那条死鱼。没有猫对此有异议。',
                          '你一眼就看穿了谁在撒谎。猫群对你肃然起敬。'
                      ]);
                      return { changes: { smarts: 5, hissing: 2 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '你判错了，大家觉得你老糊涂了。',
                      '你的裁决引起了更大的混乱。猫群打成一团。',
                      '你讲了一堆大道理，但没猫听得懂。'
                  ]);
                  return { changes: { hissing: -5 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'random_verdict',
              text: '随缘判决 (智力-)',
              calculateChance: (stats) => 90, // 修改：从100%降为90%
              effect: (stats) => {
                  if (roll(90)) {
                    const msg = pick([
                        '你转了个身，尾巴指着谁谁就赢。大家觉得这是神的旨意。',
                        '你打了哈欠，示意大家散会。无为而治。',
                        '你把两边的猫都打了一顿。问题解决了。'
                    ]);
                    return { changes: { smarts: -2, hissing: 3 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  return { changes: { hissing: -2, smarts: -1 }, message: '小弟们对这种敷衍的态度感到愤怒，私下里开始质疑你的权威。', success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'patrol_turf',
      title: '巡视领地',
      description: '在领地边缘游走。你可以强化你的气味（增加哈气）或者只是随便看看（减少哈气）。',
      image: getImg('巡视领地', '059669'),
      type: 'DAILY',
      hints: [{ stat: '哈气', change: 'up' }, { stat: '哈气', change: 'down' }],
      allowedStages: ['CAT_LORD'],
      choices: [
          {
              id: 'mark_turf',
              text: '疯狂标记 (哈气+)',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你在每一根电线杆下都留下了记号。很累，但很充实。',
                          '这片街区充满了你的气味。外来者不敢造次。',
                          '你在这个过程中顺便赶走了一只流浪狗。'
                      ]);
                      return { changes: { hissing: 4, satiety: -5, health: 2 }, message: msg, success: true, effectType: 'neutral', sound: 'hiss' };
                  }
                  const failMsg = pick([
                      '你尿不出来...太尴尬了。',
                      '刚标记完就被雨水冲刷干净了。白干。',
                      '标记的时候被一只路过的狗吓了一跳，中断了施法。'
                  ]);
                  return { changes: { satiety: -2, hissing: -2 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'friendly_patrol',
              text: '温和巡视 (哈气-)',
              effect: (stats) => {
                  if (roll(95)) {
                      const msg = pick([
                          '你对过路的小猫点了点头。它们觉得你很亲切。',
                          '你没有驱赶那只新来的小猫，反而和它碰了碰鼻子。',
                          '你坐在高处晒太阳，收敛了杀气。'
                      ]);
                      return { changes: { hissing: -8, smarts: 2 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  return { changes: { hissing: -1 }, message: '你太温和了，有只猫甚至想骑到你头上。', success: false, effectType: 'neutral' };
              }
          }
      ]
  },

  // ===================== MANSION STAGE (Stage 3) =====================
  {
      id: 'luxury_food',
      title: '挑选御膳',
      description: '尽情享用大餐。不仅美味饱腹，还能恢复健康，但容易让野性退化。',
      image: getImg('挑选御膳', '0ea5e9'),
      type: 'DAILY',
      hints: [{ stat: '饱腹', change: 'up' }],
      allowedStages: ['MANSION'],
      choices: [
          {
              id: 'eat_premium',
              text: '优雅进食',
              calculateChance: (stats) => 95,
              effect: (stats) => {
                  if (roll(95)) {
                      const msg = pick([
                          '口感细腻，回味无穷。这才是生活。',
                          '今天是三文鱼拼盘。你吃得干干净净。',
                          '吃饱喝足，你感到前所未有的满足。'
                      ]);
                      return { changes: { satiety: 25, health: 5, hissing: -2 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '这鱼好像不太新鲜，吃完有点反胃。',
                      '吃太快噎住了，难受了好半天。',
                      '今天的口味太淡了，吃得不开心。'
                  ]);
                  return { changes: { satiety: 5, health: -2 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'throw_fit',
              text: '挑三拣四',
              calculateChance: (stats) => 85,
              effect: (stats) => {
                  if (roll(65)) {
                      const msg = pick([
                          '你把碗打翻了。人类惊慌失措地去开了一罐更贵的。你掌控了局面。',
                          '你埋了那碗普通的猫粮。人类明白了你的意思。',
                          '你对着空碗哈气，直到人类端来了和牛。'
                      ]);
                      return { changes: { satiety: 35, hissing: 5, smarts: -2 }, message: msg, success: true, effectType: 'neutral', sound: 'hiss' };
                  }
                  const failMsg = pick([
                      '人类今天心情不好，把碗收走了。你什么也没吃到。',
                      '你打翻了碗，结果被关进了笼子反省。',
                      '你的抗议被无视了。最后你只能饿着肚子睡觉。'
                  ]);
                  return { changes: { satiety: -15, hissing: -5 }, message: failMsg, success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'costume_shoot',
      title: '变装拍摄',
      description: '穿上各种奇怪的衣服拍照。为了艺术（和罐头）。',
      image: getImg('变装拍摄', '8b5cf6'),
      type: 'DAILY',
      hints: [{ stat: '饱腹', change: 'up' }, { stat: '哈气', change: 'up' }], // Prioritize Satiety
      allowedStages: ['CELEBRITY'],
      choices: [
          {
              id: 'cooperate',
              text: '配合拍摄',
              calculateChance: (stats) => Math.min(90, 30 + stats.smarts * 0.5),
              effect: (stats) => {
                  if (roll(50)) {
                      const msg = pick([
                          '这套女仆装虽然羞耻，但报酬丰厚。',
                          '你穿上了小西装，看起来像个猫届CEO。',
                          '虽然帽子有点紧，但你为了艺术忍了。'
                      ]);
                      return { changes: { satiety: 15, smarts: 2 }, message: msg, success: true, effectType: 'neutral', sound: 'shutter' };
                  }
                  const failMsg = pick([
                      '你撕碎了衣服。我不做猫了！',
                      '你死活不肯戴那个蝴蝶结，拍摄被迫取消。',
                      '你在镜头前露出了一脸嫌弃，摄影师很难办。'
                  ]);
                  return { changes: { hissing: 5 }, message: failMsg, success: false, effectType: 'damage', sound: 'hiss' };
              }
          },
          {
              id: 'rebel',
              text: '罢工抗议',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                   if (roll(90)) {
                       const msg = pick([
                           '你钻进了更衣室的柜底死活不出来。拍摄取消。',
                           '你对着镜头展示了菊花。这是无声的抗议。',
                           '你趁乱叼走了道具火腿肠，然后跑路了。'
                       ]);
                       return { changes: { hissing: 4, satiety: 5 }, message: msg, success: true, effectType: 'neutral' };
                   }
                   const failMsg = pick([
                       '你被强行按住拍了几张照片，心情极差。',
                       '你想跑，但是被经纪人抓住了后颈皮。',
                       '抗议无效，今天的罐头也没了。'
                   ]);
                   return { changes: { hissing: -5, satiety: -5 }, message: failMsg, success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'destroy_furniture',
      title: '装修计划',
      description: '消耗体力来破坏家具。你可以选择释放野性（增加哈气）或者使用猫抓板（减少哈气）。',
      image: getImg('破坏家具', 'b91c1c'),
      type: 'DAILY',
      hints: [{ stat: '哈气', change: 'up' }, { stat: '哈气', change: 'down' }],
      allowedStages: ['MANSION'],
      choices: [
          {
              id: 'shred_it',
              text: '疯狂抓挠 (哈气+)',
              calculateChance: (stats) => Math.min(95, 50 + stats.hissing * 0.5),
              effect: (stats) => {
                  if (roll(50 + stats.hissing * 0.5)) {
                      const msg = pick([
                          '沙发毁了，但你很开心。这就是艺术。',
                          '你把窗帘抓成了流苏款。很有设计感。',
                          '地毯被你挠出了一个洞，你把它当成了高尔夫球洞。'
                      ]);
                      return { changes: { hissing: 5, satiety: -5, health: -2 }, message: msg, success: true, effectType: 'neutral', sound: 'impact' };
                  }
                  const failMsg = pick([
                      '你被发现了，不得不中断创作。',
                      '铲屎官拿着喷壶出现了！撤退！',
                      '指甲卡在了织物里，好不容易才拔出来。'
                  ]);
                  return { changes: { hissing: -2 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
            id: 'scratch_post',
            text: '用猫抓板 (哈气-)',
            calculateChance: (stats) => 95,
            effect: (stats) => {
                 if (roll(95)) {
                     const msg = pick([
                         '还是猫抓板安全。你磨了磨指甲，情绪稳定了。',
                         '虽然手感不如真皮沙发，但至少不会挨骂。做个乖宝宝。',
                         '你把猫抓板抓得雪花纷飞，解压神器。'
                     ]);
                     return { changes: { health: 2, satiety: -2, hissing: -3 }, message: msg, success: true, effectType: 'heal' };
                 }
                 const failMsg = pick([
                     '猫抓板被你抓坏了，没有备用的。不爽。',
                     '这个猫抓板掉渣太严重，呛得你直咳嗽。',
                     '抓着抓着就觉得无聊了。'
                 ]);
                 return { changes: { satiety: -1 }, message: failMsg, success: false, effectType: 'neutral' };
            }
          }
      ]
  },
  {
      id: 'zoomies',
      title: '深夜跑酷',
      description: '半夜三点，不知为何，你突然想以音速冲刺。',
      image: getImg('深夜跑酷', 'f59e0b'),
      type: 'DAILY',
      hints: [{ stat: '健康', change: 'up' }, { stat: '饱腹', change: 'down' }],
      allowedStages: ['MANSION'],
      choices: [
          {
              id: 'run_wild',
              text: '全屋冲刺',
              calculateChance: (stats) => Math.min(90, 40 + stats.health * 0.5),
              effect: (stats) => {
                  if (roll(40 + stats.health * 0.5)) {
                      const msg = pick([
                          '你在客厅和卧室之间往返跑了五十次。爽！',
                          '你化作一道残影，铲屎官以为家里闹鬼了。',
                          '漂移过弯！你打破了自己的最快圈速纪录。'
                      ]);
                      return { changes: { health: 5, satiety: -10, hissing: 4 }, message: msg, success: true, effectType: 'neutral', sound: 'impact' };
                  }
                  const failMsg = pick([
                      '你在转弯时打滑，撞到了门框。痛。',
                      '刹车失灵，你一头扎进了垃圾桶。',
                      '跑得太快，你在光滑的地板上劈了个叉。'
                  ]);
                  return { changes: { health: -5, satiety: -5 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
              }
          },
          {
              id: 'parkour_furniture',
              text: '家具跑酷',
              calculateChance: (stats) => Math.min(85, 30 + stats.smarts * 0.4 + stats.health * 0.4),
              effect: (stats) => {
                  if (roll(30 + stats.smarts * 0.4 + stats.health * 0.4)) {
                      const msg = pick([
                          '沙发-桌子-柜顶！完美的落地！',
                          '你把吊灯当成了秋千。这就是从天而降的掌法。',
                          '你在书架之间来回跳跃，就像在丛林里一样。'
                      ]);
                      return { changes: { health: 6, satiety: -10, smarts: 2 }, message: msg, success: true, effectType: 'neutral', sound: 'impact' };
                  }
                  const failMsg = pick([
                      '你错估了距离，从柜子上掉了下来。',
                      '你踩翻了花瓶。随着一声脆响，你的心也碎了。',
                      '起跳失败，你挂在了窗帘上，像个咸鱼。'
                  ]);
                  return { changes: { health: -10, satiety: -5 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
              }
          }
      ]
  },
  {
      id: 'window_tv',
      title: '窗外观鸟',
      description: '看着窗外的鸟。你可以认真学习（智力+）或者只是发出怪叫（智力-）。',
      image: getImg('窗外观鸟', '0ea5e9'),
      type: 'DAILY',
      hints: [{ stat: '智力', change: 'up' }, { stat: '智力', change: 'down' }],
      allowedStages: ['MANSION'],
      choices: [
          {
              id: 'watch',
              text: '学习飞行轨迹 (智力+)',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你学会了鸟类的飞行轨迹。',
                          '你发现那只麻雀每次都停在同一个树枝上。',
                          '通过观察，你领悟了“静若处子”的奥义。'
                      ]);
                      return { changes: { smarts: 4, satiety: -2 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '今天的鸟都很无聊，什么也没学到。',
                      '玻璃反光太严重，什么也看不清。',
                      '看着看着你就睡着了。'
                  ]);
                  return { changes: { satiety: -1 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'chatter',
              text: '无能狂怒 (智力-)',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你对着窗户发出了狩猎的声音。虽然看起来很蠢，但很有气势。',
                          '咔咔咔...你的牙齿在打颤，大脑一片空白，只有本能。',
                          '你试图穿过玻璃去抓鸟，撞到了头。'
                      ]);
                      return { changes: { smarts: -2, hissing: 2, satiety: -2 }, message: msg, success: true, effectType: 'neutral', sound: 'hiss' };
                  }
                  const failMsg = pick([
                      '你叫得太大声，把鸟吓跑了。',
                      '叫了半天，嗓子都哑了。',
                      '鸟根本不理你，这让你感到挫败。'
                  ]);
                  return { changes: { satiety: -2 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'play_laser',
      title: '追逐红点',
      description: '那个红色的点又出现了！它挑衅我！',
      image: getImg('追逐红点', 'ef4444'),
      type: 'DAILY',
      hints: [{ stat: '健康', change: 'up' }],
      allowedStages: ['MANSION'],
      choices: [
          {
              id: 'chase',
              text: '抓住它！',
              calculateChance: (stats) => Math.min(90, 40 + stats.health * 0.5),
              effect: (stats) => {
                  if (roll(50)) {
                      const msg = pick([
                          '你追得气喘吁吁，虽然没抓到，但锻炼了身体。',
                          '该死，它跑得太快了！但你享受这种追逐的快感。',
                          '你差点就按住它了！下次一定能行。'
                      ]);
                      return { changes: { health: 4, satiety: -5 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '你撞到了墙。这红点绝对是魔法！',
                      '红点跑到了天花板上，你急得在下面打转。',
                      '你扑向红点，结果扑到了铲屎官的脚。'
                  ]);
                  return { changes: { health: -2, satiety: -5, hissing: 2 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
              }
          },
          {
              id: 'ignore',
              text: '看破红尘',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你知道那是铲屎官手里的东西。愚蠢的人类。',
                          '你打了个哈欠，静静地看着铲屎官像个傻子一样挥舞激光笔。',
                          '这只是光学的把戏。你是一只信仰科学的猫。'
                      ]);
                      return { changes: { smarts: 4 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '虽然你知道是假的，但身体还是不由自主地动了一下。',
                      '你试图无视，但它真的太闪了！',
                      '你的尾巴出卖了你，它在疯狂摆动。'
                  ]);
                  return { changes: { hissing: -1 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'hide_box',
      title: '纸箱堡垒',
      description: '无论豪宅多大，快递箱子永远是最好的家。',
      image: getImg('纸箱堡垒', 'a855f7'),
      type: 'DAILY',
      hints: [{ stat: '健康', change: 'up' }],
      allowedStages: ['MANSION'],
      choices: [
          {
              id: 'hide',
              text: '钻进去',
              calculateChance: (stats) => 95,
              effect: (stats) => {
                  if (roll(95)) {
                      const msg = pick([
                          '你在箱子里感到无比安全。',
                          '这里是你的独立王国，不需要护照。',
                          '只要看不见外面，外面就不存在。完美的掩体。'
                      ]);
                      return { changes: { health: 2, hissing: -2 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '你太圆润了，卡在了箱子口。',
                      '箱子太小，你在里面转不过身。',
                      '箱子有股奇怪的味道，你待不下去。'
                  ]);
                  return { changes: { hissing: 2 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'chew',
              text: '啃咬箱子',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你给箱子开了个窗。',
                          '把纸板咬碎的声音ASMR。解压。',
                          '你吐出了一块纸板，感觉牙齿更锋利了。'
                      ]);
                      return { changes: { hissing: 2, satiety: -2 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '纸板卡在牙缝里了，难受。',
                      '你咬到了箱子上的胶带，粘嘴。',
                      '把箱子咬烂后，你挨骂了。'
                  ]);
                  return { changes: { health: -1 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'live_stream',
      title: '直播互动',
      description: '打开摄像头。你可以认真营业（智力+）或者直播睡觉（智力-）。',
      image: getImg('直播互动', 'ec4899'),
      type: 'DAILY',
      hints: [{ stat: '智力', change: 'up' }, { stat: '智力', change: 'down' }],
      allowedStages: ['CELEBRITY'],
      choices: [
          {
              id: 'meow_talk',
              text: '喵喵访谈 (智力+)',
              calculateChance: (stats) => 85,
              effect: (stats) => {
                  if (roll(85)) {
                      const msg = pick([
                          '粉丝说听懂了你对宇宙的看法。礼物刷屏了。',
                          '你喵喵叫了十分钟，被翻译成“我们要爱护地球”。',
                          '你说你想吃罐头，粉丝却理解为你对资本主义的批判。'
                      ]);
                      return { changes: { smarts: 4, hissing: -2 }, message: msg, success: true, effectType: 'neutral', sound: 'meow' };
                  }
                  const failMsg = pick([
                      '你忘了开麦克风，演了半天默剧。',
                      '网络卡顿，你变成了马赛克猫。',
                      '你一直背对着镜头，观众跑光了。'
                  ]);
                  return { changes: { hissing: 2 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'sleep_stream',
              text: '直播睡觉 (智力-)',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '几万人围观你睡觉。这届网友真闲。',
                          '你打了个呼噜，弹幕瞬间爆炸。',
                          '睡醒后发现由于太可爱，收到了巨额打赏。'
                      ]);
                      return { changes: { health: 5, satiety: 5, smarts: -2 }, message: msg, success: true, effectType: 'sleep' };
                  }
                  const failMsg = pick([
                      '你在梦中抽搐，吓到了观众。',
                      '睡得太死，打赏提示音把你吓醒了。',
                      '你做噩梦了，直播效果很差。'
                  ]);
                  return { changes: { health: 2 }, message: failMsg, success: false, effectType: 'sleep' };
              }
          }
      ]
  },
  {
      id: 'fan_meet',
      title: '粉丝见面会',
      description: '去公园和粉丝互动。虽然有点吵，但能收礼物。',
      image: getImg('粉丝见面会', 'f472b6'),
      type: 'DAILY',
      hints: [{ stat: '饱腹', change: 'up' }],
      allowedStages: ['CELEBRITY'],
      choices: [
          {
              id: 'accept_gifts',
              text: '收罐头',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '粉丝们排队给你喂罐头。你吃撑了。',
                          '全是进口零食！这就是成名的好处。',
                          '有个粉丝送了你一整条三文鱼。你感到很幸福。'
                      ]);
                      return { changes: { satiety: 12, hissing: -5 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '今天的粉丝都很穷，只带了便宜猫粮。',
                      '有人送了你一件衣服，但没给吃的。',
                      '粉丝太热情，挤得你没胃口吃东西。'
                  ]);
                  return { changes: { hissing: 4 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'high_five',
              text: '击掌',
              calculateChance: (stats) => Math.min(90, 30 + stats.smarts * 0.5),
              effect: (stats) => {
                   if (roll(50)) {
                       const msg = pick([
                           '你学会了和粉丝击掌。大家都要萌化了。',
                           '你轻轻碰了碰粉丝的手，对方激动得晕了过去。',
                           '营业式假笑 + 击掌。专业的偶像。'
                       ]);
                       return { changes: { smarts: 4, hissing: -2 }, message: msg, success: true, effectType: 'neutral', sound: 'meow' };
                   }
                   const failMsg = pick([
                       '你抓伤了一个粉丝的手。好在对方没介意。',
                       '你不想动，场面一度很尴尬。',
                       '你把粉丝的手当成了逗猫棒，咬了一口。'
                   ]);
                   return { changes: { hissing: 4 }, message: failMsg, success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'product_review',
      title: '产品测评',
      description: '商家寄来了新出的猫抓板。你可以真实测评（智力+）或者违心吹捧（智力-）。',
      image: getImg('产品测评', '3b82f6'),
      type: 'DAILY',
      hints: [{ stat: '智力', change: 'up' }, { stat: '智力', change: 'down' }],
      allowedStages: ['CELEBRITY'],
      choices: [
          {
              id: 'honest',
              text: '真实测评 (智力+)',
              calculateChance: (stats) => 85,
              effect: (stats) => {
                   if (roll(85)) {
                       const msg = pick([
                           '你觉得这个很难用，直接尿在了上面。粉丝夸你正直。',
                           '质量太差，一抓就坏。你给了差评，建立了权威。',
                           '你甚至懒得看一眼。这种高冷的态度被解读为“不推荐”。'
                       ]);
                       return { changes: { smarts: 4, satiety: 5 }, message: msg, success: true, effectType: 'neutral' };
                   }
                   const failMsg = pick([
                       '商家买水军黑你。你虽然说了真话，但被网暴了。',
                       '你的差评被平台删除了。白费力气。',
                       '其实产品还行，但你今天心情不好，乱评一通被识破。'
                   ]);
                   return { changes: { hissing: 4 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'fake_praise',
              text: '违心吹捧 (智力-)',
              calculateChance: (stats) => 70,
              effect: (stats) => {
                   if (roll(70)) {
                       const msg = pick([
                           '虽然很难用，但看在钱的份上，你假装玩得很开心。',
                           '你对着那个充满廉价塑料味的玩具打呼噜。演技派。',
                           '商家加钱了。你立刻表示这是你用过最好的产品。'
                       ]);
                       return { changes: { satiety: 15, smarts: -4, hissing: -5 }, message: msg, success: true, effectType: 'heal', sound: 'meow' };
                   }
                   const failMsg = pick([
                       '你演得太假了，粉丝看出来你在恰烂钱。',
                       '你刚夸完，玩具就坏了。直播翻车。',
                       '你的良心（如果有的话）痛了一下。'
                   ]);
                   return { changes: { smarts: -4, hissing: 4 }, message: failMsg, success: false, effectType: 'neutral', sound: 'fail' };
              }
          }
      ]
  },
  {
      id: 'scandal',
      title: '制造绯闻',
      description: '和隔壁的小花猫被拍到了。你可以澄清（理智，哈气-）或者炒作（野性，哈气+）。',
      image: getImg('制造绯闻', 'ef4444'),
      type: 'DAILY',
      hints: [{ stat: '哈气', change: 'up' }, { stat: '哈气', change: 'down' }],
      allowedStages: ['CELEBRITY'],
      choices: [
          {
              id: 'confirm',
              text: '炒作恋情 (哈气+)',
              calculateChance: (stats) => 80,
              effect: (stats) => {
                  if (roll(80)) {
                      const msg = pick([
                          '全网都在磕CP。你表现得像个护妻狂魔。',
                          '你们被称为“国民情侣猫”。',
                          '你们一起拍了广告，狠狠赚了一笔奶粉钱。'
                      ]);
                      return { changes: { hissing: 5, satiety: 10 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '粉丝脱粉回踩。你的女友粉都跑了。',
                      '隔壁小花猫发声明打脸，说不认识你。',
                      '大家觉得你们不般配，说你老牛吃嫩草。'
                  ]);
                  return { changes: { hissing: 5 }, message: failMsg, success: false, effectType: 'damage', sound: 'hiss' };
              }
          },
          {
              id: 'deny',
              text: '温和声明 (哈气-)',
              calculateChance: (stats) => 80,
              effect: (stats) => {
                  if (roll(80)) {
                      const msg = pick([
                          '你声明那只是普通朋友。大家赞赏你的坦诚。',
                          '“专注事业，勿cue。” 粉丝觉得你很专业。',
                          '你发了一张独自看海的照片，暗示单身。'
                      ]);
                      return { changes: { smarts: 4, hissing: -3 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '越描越黑，现在大家都觉得你是渣猫。',
                      '没人相信你的声明。谣言止于智者，但网民不是。',
                      '记者把你堵在门口，你不得不躲起来。'
                  ]);
                  return { changes: { hissing: 5 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'charity_event',
      title: '慈善活动',
      description: '为流浪猫基金会站台。你可以出席（智力+）或者捣乱（智力-）。',
      image: getImg('慈善活动', '10b981'),
      type: 'DAILY',
      hints: [{ stat: '智力', change: 'up' }, { stat: '智力', change: 'down' }],
      allowedStages: ['CELEBRITY'],
      choices: [
          {
              id: 'attend',
              text: '出席活动 (智力+)',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你不仅是明星，还是慈善家。你的形象更加高大了。',
                          '你感人的演讲（虽然只是叫了两声）筹集了大量猫粮。',
                          '你探望了以前的流浪兄弟，不忘初心。'
                      ]);
                      return { changes: { smarts: 5, hissing: -4 }, message: msg, success: true, effectType: 'neutral', sound: 'meow' };
                  }
                  const failMsg = pick([
                      '活动太无聊，你在台上睡着了。',
                      '你被闪光灯吓到了，当场炸毛。',
                      '你不想去，但被强行抱去，全程黑脸。'
                  ]);
                  return { changes: { hissing: 4 }, message: failMsg, success: false, effectType: 'neutral', sound: 'hiss' };
              }
          },
          {
              id: 'steal_spotlight',
              text: '捣乱抢风头 (智力-)',
              calculateChance: (stats) => Math.min(90, 40 + stats.hissing * 0.5),
              effect: (stats) => {
                  if (roll(Math.min(90, 40 + stats.hissing * 0.5))) {
                      const msg = pick([
                          '你推倒了演讲台上的花瓶，全场的目光都集中在你身上。',
                          '你在红毯上赖着不走，把主办方都挤下去了。',
                          '你跳上了自助餐桌，开始享用给嘉宾准备的三文鱼。'
                      ]);
                      return { changes: { hissing: 5, satiety: 12, smarts: -4 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '你想跳上台，结果滑倒了。全场哄笑。',
                      '保安把你当成真的流浪猫赶了出去。',
                      '你被麦克风的啸叫声吓得炸毛，躲到了桌子底下。'
                  ]);
                  return { changes: { hissing: -4, smarts: -2 }, message: failMsg, success: false, effectType: 'damage' };
              }
          }
      ]
  }
];
