
import { GameEvent } from '../../types';
import { roll, pick, getImg } from '../utils';

export const STORY_QUESTS: GameEvent[] = [
    // ==========================================
    // STAGE 1 -> 2: 街头 -> 猫王
    // 恢复为标准的武力挑战或智力取胜，移除徒弟人质/助战情节
    // ==========================================
    {
        id: 'stage_cat_lord',
        title: '挑战：猫圈话事人',
        description: '月圆之夜，垃圾场。现任老大“独眼龙”站在高处。如果你想在这片街区立足，就必须击败它。',
        image: getImg('猫领主', '4c1d95'),
        type: 'STAGE',
        unlockCondition: (day, stats) => {
            const unlocked = day >= 4 && stats.hissing > 30;
            let reason = '';
            if (day < 4) reason = '需第4天';
            else if (stats.hissing <= 30) reason = '需哈气>30';
            return { unlocked, reason };
        },
        choices: [
            {
                id: 'challenge',
                text: '我要打十个！(硬刚)',
                calculateChance: (stats) => Math.min(95, 40 + stats.hissing * 0.5 + stats.health * 0.2),
                effect: (stats) => {
                     const chance = Math.min(95, 40 + stats.hissing * 0.5 + stats.health * 0.2);
                     if (roll(chance)) {
                         return { 
                             changes: { hissing: 20, smarts: 5, satiety: -10 }, 
                             message: '一记左勾拳，新王登基！所有的流浪猫都低下了头，向新的领主致敬。', 
                             success: true, 
                             effectType: 'neutral',
                             stageUnlock: 'CAT_LORD',
                             sound: 'hiss'
                         };
                     }
                     return { 
                         changes: { health: -20, hissing: -5, satiety: -10 }, 
                         message: '你被打败了。独眼龙把你按在地上摩擦，你的威严扫地。', 
                         success: false, 
                         effectType: 'damage', 
                         sound: 'impact' 
                     };
                }
            },
            {
                id: 'negotiate',
                text: '智取：合纵连横',
                calculateChance: (stats) => Math.min(95, 20 + stats.smarts * 0.8),
                effect: (stats) => {
                    if (roll(Math.min(95, 20 + stats.smarts * 0.8))) {
                         return { 
                             changes: { hissing: 5, smarts: 10, satiety: -5 }, 
                             message: '你运用了《厚黑学》。通过承诺分配垃圾桶的使用权，你兵不血刃地瓦解了独眼龙的统治。', 
                             success: true, 
                             effectType: 'neutral',
                             stageUnlock: 'CAT_LORD',
                             sound: 'meow'
                         };
                    }
                    return { 
                        changes: { hissing: -5, smarts: -2 }, 
                        message: '你的演讲太无聊了，所有猫都睡着了。独眼龙醒来后把你赶走了。', 
                        success: false, 
                        effectType: 'neutral' 
                    };
                }
            }
        ]
    },

    // ==========================================
    // STAGE 2 -> 3: 猫王 -> 豪宅
    // 恢复为标准的潜入或碰瓷，移除恋爱线抉择
    // ==========================================
    {
        id: 'stage_mansion',
        title: '机遇：豪宅大劫案',
        description: '那扇传说中的落地窗竟然没关！屋里透出暖气和金枪鱼的味道。这是改变阶级的机会。',
        image: getImg('闯入豪宅', '0284c7'),
        type: 'STAGE',
        unlockCondition: (day, stats) => {
             const unlocked = day >= 8 && stats.hissing < 40;
             let reason = '';
             if (day < 8) reason = '需第8天';
             else if (stats.hissing >= 40) reason = '需温顺(哈气<40)';
             return { unlocked, reason };
        },
        choices: [
          {
            id: 'sneak',
            text: '潜行模式 (靠身手)',
            calculateChance: (stats) => Math.min(95, 30 + stats.smarts * 0.5 + stats.health * 0.3),
            effect: (stats) => {
                 if (roll(Math.min(95, 30 + stats.smarts * 0.5 + stats.health * 0.3))) {
                    return { 
                        changes: { satiety: 30, health: 10, smarts: 8, hissing: -5 }, 
                        message: '你钻进了温暖的客厅，成功躲到了沙发底下。从此以后，告别寒风，拥抱暖气。', 
                        success: true, 
                        effectType: 'heal',
                        stageUnlock: 'MANSION'
                    };
                 }
                 return { 
                     changes: { health: -15, hissing: 5 }, 
                     message: '刚进门就被扫地机器人撞飞了。豪宅不是那么好进的。', 
                     success: false, 
                     effectType: 'damage', 
                     sound: 'impact' 
                 };
            }
          },
          {
            id: 'meow',
            text: '碰瓷卖惨 (靠演技)',
            calculateChance: (stats) => Math.min(95, 40 + stats.smarts * 0.2 + (100 - stats.hissing) * 0.4),
            effect: (stats) => {
                if (roll(Math.min(95, 40 + stats.smarts * 0.2 + (100 - stats.hissing) * 0.4))) {
                    return { 
                        changes: { satiety: 25, hissing: -10 }, 
                        message: '你用尽毕生演技装出一副快死的样子。人类把你抱了进去。为了这张饭票，你出卖了灵魂。', 
                        success: true, 
                        effectType: 'heal', 
                        stageUnlock: 'MANSION',
                        sound: 'meow' 
                    };
                }
                return { 
                    changes: { hissing: 5, satiety: -5 }, 
                    message: '园丁用水管滋了你一身。你的卖惨表演失败了。', 
                    success: false, 
                    effectType: 'damage' 
                };
            }
          }
        ]
    },

    // ==========================================
    // STAGE 3 -> 4: 豪宅 -> 网红
    // ==========================================
    {
        id: 'stage_influencer',
        title: '命运：流量密码',
        description: '一个拿着手机的年轻人盯上了你。镜头的反光映出你圆润的脸庞。',
        image: getImg('网红耄耋', 'be123c'),
        type: 'STAGE',
        unlockCondition: (day, stats) => {
            const unlocked = day >= 12 && stats.smarts > 50 && stats.health > 30;
            let reason = '';
            if (day < 12) reason = '需第12天';
            else if (stats.smarts <= 50) reason = '需聪明>70';
            else if (stats.health <= 30) reason = '需健康>70';
            return { unlocked, reason };
        },
        choices: [
          {
            id: 'pose',
            text: '配合：我是大明星',
            calculateChance: (stats) => Math.min(95, 20 + stats.smarts * 0.5 + stats.satiety * 0.3),
            effect: (stats) => {
               if (roll(Math.min(95, 20 + stats.smarts * 0.5 + stats.satiety * 0.3))) {
                 return { 
                     changes: { smarts: 8, hissing: -5, satiety: 15 }, 
                     message: '你精准地找到了镜头感。视频爆火，你成为了全网追捧的“圆头大叔”。你享受这种被关注的感觉。', 
                     success: true, 
                     effectType: 'heal',
                     stageUnlock: 'CELEBRITY',
                     sound: 'shutter'
                 }
               }
               return { changes: { hissing: 3 }, message: '你摆了个姿势，结果打了个喷嚏。视频没火，只有黑粉在嘲笑你。', success: false, effectType: 'neutral' }
            }
          },
          {
            id: 'philosophical_glitch',
            text: '凝视镜头：打破次元壁',
            // 这是一个基于属性的彩蛋选项，不依赖历史记录
            calculateChance: (stats) => stats.smarts > 80 ? 80 : 0,
            effect: (stats) => {
                if (roll(80)) {
                    return {
                        changes: { smarts: 20, hissing: -5 },
                        message: '你死死盯着镜头，仿佛看穿了屏幕后的观众。视频标题《这只猫看见了上帝》引发了全球恐慌。你成神了。',
                        success: true,
                        stageUnlock: 'CELEBRITY',
                        effectType: 'neutral',
                        sound: 'typewriter'
                    };
                }
                return { changes: { smarts: -5 }, message: '你盯着镜头看太久，变成了斗鸡眼。大家觉得你是个傻子。', success: false, effectType: 'neutral' };
            }
          },
          {
            id: 'ignore',
            text: '高冷：不理睬',
            calculateChance: (stats) => 90,
            effect: (stats) => {
                // 拒绝进阶，保持现状
                if (roll(90)) {
                    return { 
                        changes: { hissing: 5, smarts: 2 }, 
                        message: '你全程背对着镜头舔屁股。年轻人无奈地走了。你守住了豪宅猫的清静，拒绝了流量的喧嚣。', 
                        success: false, // 拒绝进阶
                        effectType: 'neutral', 
                        sound: 'hiss' 
                    };
                }
                return { changes: { hissing: 2 }, message: '你的不理不睬被解读为“无趣”。拍摄失败。', success: false, effectType: 'neutral' };
            }
          }
        ]
    },
    {
        id: 'stage_sales',
        title: '巅峰：直播带货',
        description: '年轻人想让你穿“招财猫”红马甲直播卖猫粮。这是彻底变现的机会。',
        image: getImg('明星带货', 'fbbf24'),
        type: 'STAGE',
        unlockCondition: (day, stats) => ({
            unlocked: day >= 14,
            reason: day < 14 ? '需等待至第14天' : undefined
        }),
        choices: [
          {
            id: 'cooperate',
            text: '为了生活，不寒碜',
            calculateChance: (stats) => Math.min(60, 10 + stats.smarts * 0.3 + (100 - stats.satiety) * 0.2),
            effect: (stats) => {
                 if (roll(Math.min(30, 10 + stats.smarts * 0.3 + (100 - stats.satiety) * 0.2))) {
                     return { changes: { health: 15, satiety: 30, smarts: 5 }, message: '真香！弹幕都在刷礼物。尊严换来了最好的金枪鱼。你彻底融入了人类社会。', success: true, effectType: 'heal', sound: 'meow' };
                 }
                 return { changes: { hissing: 20, satiety: 20 }, message: '直播事故！你吐了。品牌方解约。你搞砸了。', success: false, effectType: 'damage', sound: 'fail' };
            }
          },
          {
              id: 'run',
              text: '宁死不从！(回归野性)',
              calculateChance: (stats) => Math.min(50, stats.hissing * 0.5),
              effect: (stats) => {
                  if (roll(Math.min(50, stats.hissing * 0.5))) {
                      return { 
                          changes: { hissing: 30, smarts: 5, satiety: -10 }, 
                          message: '你撕烂了马甲，从窗户跳了出去！去他的流量，去他的罐头！我是圆头，我是自由的！(你逃回了街头，但这也许是你想要的结局)', 
                          success: true, 
                          effectType: 'neutral', 
                          sound: 'impact' 
                      };
                  }
                  return { changes: { hissing: 10, satiety: -10 }, message: '你想跑，但被抓了回来。现在你被关在笼子里直播。', success: false, effectType: 'damage' };
              }
          }
        ]
      }
];
