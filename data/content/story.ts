
import { GameEvent } from '../../types';
import { roll, pick, getImg } from '../utils';

export const STORY_QUESTS: GameEvent[] = [
    {
        id: 'stage_cat_lord',
        title: '挑战：猫圈话事人',
        description: '月圆之夜，流浪猫大会。现任老大“独眼龙”站在高处。你需要证明实力。\n[解锁要求: 第3天, 哈气>30]',
        image: getImg('猫领主', '4c1d95'),
        type: 'STAGE',
        unlockCondition: (day, stats) => {
            const unlocked = day >= 3 && stats.hissing > 30;
            let reason = '';
            if (day < 3) reason = '需第3天';
            else if (stats.hissing <= 30) reason = '需哈气>30';
            return { unlocked, reason };
        },
        choices: [
            {
                id: 'challenge',
                text: '我要打十个！',
                calculateChance: (stats) => Math.min(95, 40 + stats.hissing * 0.5 + stats.health * 0.2),
                effect: (stats) => {
                     const chance = Math.min(95, 40 + stats.hissing * 0.5 + stats.health * 0.2);
                     if (roll(chance)) {
                         const msg = pick([
                             '你一记漂亮的左勾拳把独眼龙打进了可回收垃圾桶。全场寂静，随即爆发出一阵喵喵叫。新王登基！(解锁：猫领主阶段)',
                             '你利用体型优势，一记泰山压顶，直接把独眼龙坐晕了。暴力，但是有效。(解锁：猫领主阶段)',
                             '双方缠斗了十分钟，最后你咬住了它的后颈皮。独眼龙求饶了。这片街区是你的了！(解锁：猫领主阶段)'
                         ]);
                         return { 
                             changes: { hissing: 10, smarts: 5, satiety: -10 }, 
                             message: msg, 
                             success: true, 
                             effectType: 'neutral',
                             stageUnlock: 'CAT_LORD',
                             sound: 'hiss'
                         };
                     }
                     const failMsg = pick([
                         '理想很丰满，现实很骨感。你被群殴了，肿着脸回到了角落，像个真正的失败者。',
                         '你高估了自己的体力，挥了两拳就喘不上气。独眼龙嘲笑地看着你，把你踢下了台。',
                         '你刚冲上去就滑倒了。全场爆笑。这绝对是你猫生中最尴尬的时刻。'
                     ]);
                     return { changes: { health: -20, hissing: -5, satiety: -10 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
                }
            },
            {
                id: 'negotiate',
                text: '智取：合纵连横',
                calculateChance: (stats) => Math.min(95, 20 + stats.smarts * 0.8),
                effect: (stats) => {
                    const chance = Math.min(95, 20 + stats.smarts * 0.8);
                    if (roll(chance)) {
                         const msg = pick([
                             '你通过散布独眼龙偷吃狗粮的谣言，成功瓦解了它的统治。大家推举你为新老大，虽然手段有点脏。(解锁：猫领主阶段)',
                             '你发表了一篇关于《垃圾桶资源分配优化》的演讲，猫猫们觉得你很有文化，决定选你当CEO。(解锁：猫领主阶段)',
                             '你承诺带大家去吃自助餐（其实是骗人的）。在糖衣炮弹下，独眼龙被和平演变了。(解锁：猫领主阶段)'
                         ]);
                         return { 
                             changes: { hissing: 5, smarts: 10, satiety: -5 }, 
                             message: msg, 
                             success: true, 
                             effectType: 'neutral',
                             stageUnlock: 'CAT_LORD',
                             sound: 'meow'
                         };
                    }
                    const failMsg = pick([
                        '你说了一大堆大道理，但大家只想看打架。你被轰下了台，还被扔了烂菜叶。',
                        '你的演讲太无聊了，所有猫都睡着了。独眼龙醒来后把你赶走了。',
                        '有猫揭穿了你上次偷吃的事。你的信誉破产了，灰溜溜地逃离了现场。'
                    ]);
                    return { changes: { hissing: -5, smarts: -2 }, message: failMsg, success: false, effectType: 'neutral' };
                }
            }
        ]
    },
    {
        id: 'stage_mansion',
        title: '机遇：豪宅大劫案',
        description: '那扇传说中的落地窗竟然没关！里面有真皮沙发。 \n[解锁要求: 第6天, 聪明>40]',
        image: getImg('闯入豪宅', '0284c7'),
        type: 'STAGE',
        unlockCondition: (day, stats) => {
             const unlocked = day >= 6 && stats.smarts > 40;
             let reason = '';
             if (day < 6) reason = '需第6天';
             else if (stats.smarts <= 40) reason = '需聪明>40';
             return { unlocked, reason };
        },
        choices: [
          {
            id: 'sneak',
            text: '潜行模式开启',
            calculateChance: (stats) => Math.min(95, 30 + stats.smarts * 0.5 + stats.health * 0.3),
            effect: (stats) => {
                 if (roll(Math.min(95, 30 + stats.smarts * 0.5 + stats.health * 0.3))) {
                    const msg = pick([
                        '你像一阵风一样潜入，不仅吃光了猫粮，还在真皮沙发上留下了你的专属抓痕。这里是天堂。(解锁：豪宅阶段)',
                        '你成功避开了所有摄像头和传感器。现在，这个带地暖的客厅就是你的新皇宫。(解锁：豪宅阶段)',
                        '你钻进了保姆的袋子混了进去。等到晚上出来时，这里已经任你宰割。(解锁：豪宅阶段)'
                    ]);
                    return { 
                        changes: { satiety: 30, health: 10, smarts: 8 }, 
                        message: msg, 
                        success: true, 
                        effectType: 'heal',
                        stageUnlock: 'MANSION'
                    };
                 }
                 const failMsg = pick([
                     '刚进门就被扫地机器人撞飞了。这该死的高科技，警报声响彻云霄。',
                     '你被自动感应门夹住了尾巴。那种疼痛让你发出了杀猪般的叫声，被保安扔了出去。',
                     '里面有一只凶猛的杜宾犬。你还没来得及看清装修，就为了保命而逃之夭夭。'
                 ]);
                 return { changes: { health: -15, hissing: 5 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
            }
          },
          {
            id: 'meow',
            text: '碰瓷卖惨',
            calculateChance: (stats) => Math.min(95, 40 + stats.smarts * 0.2 + (100 - stats.hissing) * 0.4),
            effect: (stats) => {
                if (roll(Math.min(95, 40 + stats.smarts * 0.2 + (100 - stats.hissing) * 0.4))) {
                    const msg = pick([
                        '女主人把你抱了起来：“天哪，这只猫丑得好可爱！”你虽然受到侮辱，但得到了食物。',
                        '你只是躺在门口，他们就以为你快死了。立刻把你抱进去喂了顶级罐头。计划通。',
                        '小孩哭着闹着要养你。家长没办法，只好把你接了进去。虽然要忍受小孩，但值得。'
                    ]);
                    return { changes: { satiety: 25, hissing: -5 }, message: msg, success: true, effectType: 'heal', sound: 'meow' };
                }
                const failMsg = pick([
                    '“去去去！”园丁用水管滋了你一身。不仅没吃到，还洗了个冷水澡。',
                    '他们以为你是疯猫，差点叫了防疫站。你不得不狼狈逃窜。',
                    '这家人对猫毛过敏。门在你面前重重关上，差点夹到你的胡子。'
                ]);
                return { changes: { hissing: 5, satiety: -5 }, message: failMsg, success: false, effectType: 'damage' };
            }
          }
        ]
    },
    {
        id: 'stage_influencer',
        title: '命运：流量密码',
        description: '一个拿着手机的年轻人盯上了你。他一直在找角度。 \n[解锁要求: 第9天, 聪明>50, 健康>30]',
        image: getImg('网红耄耋', 'be123c'),
        type: 'STAGE',
        unlockCondition: (day, stats) => {
            const unlocked = day >= 9 && stats.smarts > 50 && stats.health > 30;
            let reason = '';
            if (day < 9) reason = '需第9天';
            else if (stats.smarts <= 50) reason = '需聪明>50';
            else if (stats.health <= 30) reason = '需健康>30';
            return { unlocked, reason };
        },
        choices: [
          {
            id: 'pose',
            text: '勉为其难当个模',
            calculateChance: (stats) => Math.min(95, 20 + stats.smarts * 0.5 + stats.satiety * 0.3),
            effect: (stats) => {
               if (roll(Math.min(95, 20 + stats.smarts * 0.5 + stats.satiety * 0.3))) {
                 const msg = pick([
                     '视频标题《这只猫看破了红尘》爆火。你莫名其妙成了全网“哲学猫”代表。(解锁：网红阶段)',
                     '你厌世的眼神击中了无数社畜的心。他们哭着喊着要给你寄罐头。(解锁：网红阶段)',
                     '你随便伸了个懒腰，就被解读为“猫式瑜伽大师”。一夜涨粉百万。(解锁：网红阶段)'
                 ]);
                 return { 
                     changes: { smarts: 8, hissing: -5, satiety: 15 }, 
                     message: msg, 
                     success: true, 
                     effectType: 'heal',
                     stageUnlock: 'CELEBRITY',
                     sound: 'shutter'
                 }
               }
               const failMsg = pick([
                   '你摆了个姿势，结果打了个巨大的喷嚏，鼻涕泡挂在脸上。视频火了，但是作为鬼畜素材。',
                   '你试图展现优雅，结果从栏杆上摔了下来。这届网友只会在评论区发“哈哈哈哈”。',
                   '镜头把你拍得太胖了。评论区都在讨论你有几层下巴，而不是你的气质。'
               ]);
               return { changes: { hissing: 3 }, message: failMsg, success: false, effectType: 'neutral' }
            }
          },
          {
            id: 'ignore',
            text: '高冷不理睬',
            calculateChance: (stats) => 90,
            effect: (stats) => {
                if (roll(90)) {
                    const msg = pick([
                        '你全程背对着镜头舔屁股。这种不羁的态度反而吸引了一群死忠粉。',
                        '你直接无视了人类，打了个哈欠睡着了。评论区都在刷“高冷男神”。',
                        '你给了镜头一个鄙视的眼神然后走开了。这段视频被做成了几万个表情包。'
                    ]);
                    return { changes: { hissing: 5, smarts: 2 }, message: msg, success: true, effectType: 'neutral', sound: 'hiss' };
                }
                const failMsg = pick([
                    '你的不理不睬被解读为“无趣”。视频根本没火。',
                    '年轻人觉得你很难搞，放弃了拍摄。',
                    '你走得太快，只拍到了你的残影，模糊不清。'
                ]);
                return { changes: { hissing: 2 }, message: failMsg, success: false, effectType: 'neutral' };
            }
          }
        ]
    },
    {
        id: 'stage_sales',
        title: '巅峰：直播带货',
        description: '年轻人想让你穿“招财猫”红马甲直播卖猫粮。 \n[解锁要求: 第12天, 坚持生存]',
        image: getImg('明星带货', 'fbbf24'),
        type: 'STAGE',
        unlockCondition: (day, stats) => ({
            unlocked: day >= 12,
            reason: day < 12 ? '需等待至第12天' : undefined
        }),
        choices: [
          {
            id: 'cooperate',
            text: '为了生活，不寒碜',
            calculateChance: (stats) => Math.min(95, 30 + stats.smarts * 0.4 + (100 - stats.satiety) * 0.3),
            effect: (stats) => {
                 if (roll(Math.min(95, 30 + stats.smarts * 0.4 + (100 - stats.satiety) * 0.3))) {
                     const msg = pick([
                         '真香！弹幕都在刷礼物，你也吃到了顶级金枪鱼。尊严是什么？能吃吗？',
                         '你非常配合地吃播。商家乐开了花，你下半辈子的猫粮都有着落了。',
                         '虽然穿着傻气的马甲，但看着账户余额（虽然不是你的），你感到很欣慰。'
                     ]);
                     return { changes: { health: 15, satiety: 30, smarts: 5 }, message: msg, success: true, effectType: 'heal', sound: 'meow' };
                 }
                 const failMsg = pick([
                     '你穿上马甲后突然发狂，把直播用的猫粮袋子抓了个稀烂。直播事故现场。',
                     '你吃到一半吐了。品牌方连夜解约，还要求赔偿地毯清洗费。',
                     '你在直播间当众拉了一坨屎。虽然流量爆炸，但你的职业生涯结束了。'
                 ]);
                 return { changes: { hissing: 20, satiety: 20 }, message: failMsg, success: false, effectType: 'damage', sound: 'fail' };
            }
          },
          {
              id: 'run',
              text: '宁死不从！',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你飞檐走壁逃之夭夭，留下了一个潇洒的背影和一地鸡毛。',
                          '你趁他们调试灯光时，从窗户跳了出去。自由的味道比罐头更香。',
                          '你咬断了网线，趁乱消失在夜色中。从此江湖上只剩你的传说。'
                      ]);
                      return { changes: { hissing: 30, smarts: 5, satiety: -10 }, message: msg, success: true, effectType: 'neutral', sound: 'impact' };
                  }
                  const failMsg = pick([
                      '你想跑，但门被锁死了。你被迫营业，一脸丧气。',
                      '你被抓了回来，还被扣了一顿饭。',
                      '你逃跑的时候撞到了镜头，现在欠了一屁股债（猫债）。'
                  ]);
                  return { changes: { hissing: 10, satiety: -10 }, message: failMsg, success: false, effectType: 'damage' };
              }
          }
        ]
      }
];

export const HIGH_RISK_EVENTS: Record<number, GameEvent> = {
    3: {
        id: 'risk_rat_king',
        title: '挑战：下水道鼠王',
        description: '这不仅是老鼠，这是一只喝了核废水的变异硕鼠。它正坐在你的晚餐上剔牙。',
        image: getImg('决战鼠王', '000000'),
        type: 'SPECIAL',
        choices: [
            {
                id: 'fight_king',
                text: '决一死战',
                calculateChance: (stats) => Math.min(85, 20 + stats.hissing * 0.5 + stats.health * 0.3),
                effect: (stats) => {
                    if (roll(20 + stats.hissing * 0.5 + stats.health * 0.3)) {
                        const msg = pick([
                            '经过一番恶战，你咬断了鼠王的喉咙！今晚吃自助餐！',
                            '你利用地形优势，把它踹进了下水道深处。你是这里的神！',
                            '你被咬了好几口，但最终还是你赢了。这是王者的伤勋。'
                        ]);
                        return { changes: { hissing: 10, satiety: 30, health: -10 }, message: msg, success: true, effectType: 'damage', sound: 'hiss' };
                    }
                    const failMsg = pick([
                        '它居然会柔术！你被按在地上摩擦，尾巴都被咬秃了。',
                        '老鼠帮手来了！你双拳难敌四手，狼狈逃窜。',
                        '你被它那巨大的门牙吓傻了，僵在原地被打了一顿。'
                    ]);
                    return { changes: { health: -30, hissing: -5 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
                }
            },
            {
                id: 'flee',
                text: '战略撤退',
                calculateChance: (stats) => 90,
                effect: (stats) => {
                    if (roll(90)) {
                        const msg = pick([
                            '大丈夫能屈能伸。这块地盘送它了，反正本来也很臭。',
                            '你假装没看见，优雅地转身离开。只要我不尴尬，尴尬的就是老鼠。',
                            '惹不起还躲不起吗？你决定去翻翻别的垃圾桶。'
                        ]);
                        return { changes: { hissing: -2, satiety: -10 }, message: msg, success: true, effectType: 'neutral' };
                    }
                    const failMsg = pick([
                        '你转身想跑，结果被鼠王咬住了尾巴！',
                        '后面是死路！你不得不硬着头皮挨了两下。',
                        '逃跑途中滑倒了，摔了个狗吃屎。'
                    ]);
                    return { changes: { health: -10, hissing: -5 }, message: failMsg, success: false, effectType: 'damage', sound: 'impact' };
                }
            }
        ]
    },
};

export const STUPID_DEATH_EVENT: GameEvent = {
    id: 'stupid_death',
    title: '好奇心害死猫',
    description: '你的脑子似乎不太好使了。你看到一个飞速旋转的车轮，觉得它看起来很好玩，于是把头伸了进去...',
    image: getImg('蠢死', '000000'),
    type: 'SPECIAL',
    choices: [
        {
            id: 'die',
            text: '下辈子注意点',
            calculateChance: (stats) => 0,
            effect: (stats) => ({ changes: { health: -100 }, message: '眼前一黑。旁白都不想解说你的死法。', success: false, effectType: 'damage', sound: 'impact' })
        }
    ]
};
