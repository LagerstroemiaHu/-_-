
import { GameEvent } from '../../types';
import { roll, pick, getImg } from '../utils';

export const RANDOM_EVENTS_EXTRA: GameEvent[] = [
  {
      id: 'sell_fish_brother',
      title: '高启墙的兵法',
      description: '菜市场深处，一个穿着旧夹克的鱼贩子正如痴如醉地读着《孙子兵法》。他的眼神深邃，让你想起了那句：“风浪越大，鱼越贵。”',
      image: getImg('高启墙', '0369a1'),
      type: 'RANDOM',
      choices: [
          {
              id: 'read_art_of_war',
              text: '和他一起读《兵法》',
              calculateChance: (stats) => Math.min(95, 30 + stats.smarts * 0.6),
              effect: (stats) => {
                  if (roll(30 + stats.smarts * 0.6)) {
                      const msg = pick([
                          '你悟出了“围师必阙”的道理。以后堵老鼠更有心得了。',
                          '鱼贩子摸了摸你的头：“这只猫有当大佬的潜质。” 你的气质变得更加冷酷。',
                          '你学会了如何用眼神压制对手。哈气值暴涨。'
                      ]);
                      return { changes: { smarts: 5, hissing: 6 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '书太深奥了，你看得直打瞌睡。',
                      '你试图翻书，结果把书抓破了。鱼贩子默默地拿起了杀鱼刀...',
                      '你没悟出兵法，只学会了怎么装深沉。'
                  ]);
                  return { changes: { smarts: -1, hissing: 2 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'eat_fish',
              text: '告诉老磨(老默)我想吃鱼了',
              calculateChance: (stats) => 50,
              effect: (stats) => {
                  if (roll(50)) {
                      const msg = pick([
                          '老磨（那个冷面杀手）面无表情地丢给你一条刚杀的鱼。这鱼充满了江湖的味道。',
                          '强哥笑了：“给这只猫安排一下。” 你享受了一顿免费的霸王餐。',
                          '你得到了一条大鱼，但你也感觉自己欠了某种还不起的人情。'
                      ]);
                      return { changes: { satiety: 15, health: 3, hissing: 2 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '老磨冷冷地看了你一眼。你感觉背脊发凉，落荒而逃。',
                      '你刚想偷鱼，就被一条冻硬的咸鱼拍飞了。',
                      '“你什么档次，跟我吃一样的鱼？” 你被轰了出去。'
                  ]);
                  return { changes: { health: -5, hissing: -1 }, message: failMsg, success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'northeast_rain',
      title: '东北羽姐：战狼特训',
      description: 'BGM突然变成了激昂的唢呐。一个穿着红棉袄的女人正在扛着半扇猪奔跑，嘴里喊着：“兄弟们！这一期咱们整点硬的！”',
      image: getImg('东北羽姐', 'b91c1c'),
      type: 'RANDOM',
      choices: [
          {
              id: 'carry_pig',
              text: '帮她扛猪',
              calculateChance: (stats) => Math.min(95, 20 + stats.health * 0.8),
              effect: (stats) => {
                  if (roll(20 + stats.health * 0.8)) {
                      const msg = pick([
                          '你虽然扛不动猪，但你帮忙叼了个猪蹄。羽姐夸你：“这猫也是个战狼！”',
                          '你展现了惊人的爆发力。直播间弹幕刷屏：“这猫是特种兵转世吧？”',
                          '羽姐赏了你一根大骨头。这顿饭吃得那是相当豪迈。'
                      ]);
                      return { changes: { health: 6, hissing: 5, satiety: 10 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '猪太沉了，你差点被压扁。羽姐喊道：“这猫咋这么虚呢？”',
                      '你被猪尾巴甩了一脸。战狼特训失败。',
                      '你没扛动，反而被羽姐不小心踩了一脚。'
                  ]);
                  return { changes: { health: -8, hissing: -2 }, message: failMsg, success: false, effectType: 'damage' };
              }
          },
          {
              id: 'eat_corn',
              text: '生吃红薯',
              calculateChance: (stats) => 95, // 修改：从100%降为95%
              effect: (stats) => {
                  if (roll(95)) {
                    const msg = pick([
                        '咔嚓！你咬了一口生红薯。虽然有点硬，但胜在纯天然。',
                        '你学着羽姐的样子大口咀嚼。观众直呼：“这猫太接地气了！”',
                        '这一口下去，你感觉自己充满了东北黑土地的力量。'
                    ]);
                    return { changes: { satiety: 6, health: 1 }, message: msg, success: true, effectType: 'heal' };
                  }
                  return { changes: { health: -2 }, message: '红薯太硬了，差点把你的牙崩掉。', success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'crazy_thursday',
      title: '肯德鸡爷爷的疯狂',
      description: '今天是周四。一个和蔼的老爷爷雕像前围满了人，他们嘴里念叨着：“V我50...”',
      image: getImg('疯狂星期四', 'b91c1c'),
      type: 'RANDOM',
      choices: [
          {
              id: 'beg_nugget',
              text: 'V我一个鸡块',
              calculateChance: (stats) => 50,
              effect: (stats) => {
                  if (roll(50)) {
                      const msg = pick([
                          '好心的路人给了你一块吮指原味鸡。虽然热量爆炸，但真香！',
                          '你不仅吃到了鸡块，还得到了一个蛋挞。这就是疯狂星期四的力量！',
                          '你喵了一声“V我50”，居然真的有人给你扔了50g的猫粮。'
                      ]);
                      return { changes: { satiety: 12, health: -1 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '文案太烂，没人理你。',
                      '你被一群复读机包围了，脑瓜子嗡嗡的。',
                      '店员把你赶走了：“这里没有V我50，只有疯狂加班。”'
                  ]);
                  return { changes: { hissing: 2, smarts: -1 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'steal_bag',
              text: '这就是我的全家桶！',
              calculateChance: (stats) => 30,
              effect: (stats) => {
                  if (roll(30)) {
                      const msg = pick([
                          '你趁乱叼走了一个袋子。里面全是炸鸡！今晚是狂欢夜！',
                          '你抢到了一个老北京鸡肉卷。虽然不正宗，但肉很多。',
                          '你成功了！但是吃太多油炸食品让你第二天拉肚子了。'
                      ]);
                      return { changes: { satiety: 18, health: -3 }, message: msg, success: true, effectType: 'heal' };
                  }
                  return { changes: { health: -5, hissing: 2 }, message: '你被抓住了。疯狂的不是星期四，是被打的你。', success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'black_myth',
      title: '黑神话：悟孔',
      description: '你看到一根棍子插在石头里。一个老猴子对你说：“天命喵，你终于来了。”',
      image: getImg('天命喵', 'f59e0b'),
      type: 'RANDOM',
      choices: [
          {
              id: 'smash_pot',
              text: '打碎那个罐子！',
              calculateChance: (stats) => 95, // 修改：从100%降为95%
              effect: (stats) => {
                  if (roll(95)) {
                    const msg = pick([
                        '那是本能！你打碎了路边所有的罐子，捡到了不少灵蕴（其实是硬币）。',
                        '你把土地公公的头都打歪了。但是很爽。',
                        '这才是天命喵该干的事。破坏让你的哈气值提升了。'
                    ]);
                    return { changes: { hissing: 3, smarts: -1 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  return { changes: { health: -2 }, message: '罐子是铁做的，你的爪子肿了。物理引擎太真实了。', success: false, effectType: 'damage' };
              }
          },
          {
              id: 'light_incense',
              text: '上香',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  if (roll(90)) {
                      const msg = pick([
                          '你在土地庙前拜了拜。生命值回满了，葫芦也满了。',
                          '虽然你没有广治（广智）救你，但你的诚心感动了策划。',
                          '休息一会儿。所有的怪（老鼠）都刷新了。'
                      ]);
                      return { changes: { health: 10, satiety: -2 }, message: msg, success: true, effectType: 'heal' };
                  }
                  return { changes: { health: 2 }, message: '香断了。不太吉利。', success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'true_fragrance',
      title: '真香定律的轮回',
      description: '面前放着一碗看起来像是隔夜的炒饭。你的尊严告诉你：流浪猫也是有底线的！我就是饿死，死外边，从这里跳下去，也不会吃你们一点东西！',
      image: getImg('真香炒饭', 'd97706'),
      type: 'RANDOM',
      choices: [
          {
              id: 'deny_eat',
              text: '傲娇拒绝 (然后...)',
              calculateChance: (stats) => 60, // 60%概率触发真香
              effect: (stats) => {
                  if (roll(60)) {
                      const msg = pick([
                          '两分钟后... “真香！” 你把脸埋进饭碗里，吃得比谁都快。',
                          '你本想拒绝，但身体很诚实。这炒饭里竟然有火腿丁！真香！',
                          '你打破了誓言。在饥饿面前，所有猫都会变成王境泽喵。'
                      ]);
                      return { changes: { satiety: 12, hissing: -2, smarts: -1 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '你真的饿着肚子走了。虽然保住了尊严，但差点饿晕在路边。',
                      '你刚想回头吃，饭就被狗抢走了。这就是傲娇的代价。',
                      '你坚守了底线，但底线不能当饭吃。胃在抽搐。'
                  ]);
                  return { changes: { satiety: -5, health: -3, hissing: 2 }, message: failMsg, success: false, effectType: 'damage' };
              }
          },
          {
              id: 'eat_now',
              text: '直接吃 (无聊)',
              calculateChance: (stats) => 95, // 修改：从100%降为95%
              effect: (stats) => {
                  if (roll(95)) {
                    const msg = pick([
                        '你直接吃了。没有任何戏剧性，只是一顿普通的饭。',
                        '填饱了肚子，但失去了一个成为网红表情包的机会。',
                        '味道一般，勉强果腹。'
                    ]);
                    return { changes: { satiety: 8 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  return { changes: { health: -5 }, message: '饭已经凉透了，吃完后你的肚子开始隐隐作痛。', success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'white_door',
      title: '白色的异次元之门',
      description: '你看到了一个发光的白色矩形。一个声音在你脑海中回荡：“异世相遇，尽享美味...”',
      image: getImg('启动！', 'f3f4f6'),
      type: 'RANDOM',
      choices: [
          {
              id: 'start_game',
              text: '触碰：启动！',
              calculateChance: (stats) => 50,
              effect: (stats) => {
                  if (roll(50)) {
                      const msg = pick([
                          '你的意识进入了提瓦特大陆。虽然身体在现实中饿着，但精神得到了极大的满足。',
                          '门酱附体！你摆出了一个奇怪的姿势。虽然很蠢，但很有趣。',
                          '原来你是草元素猫。你对着水坑产生了绽放反应。'
                      ]);
                      return { changes: { smarts: -3, satiety: -2, health: 3 }, message: msg, success: true, effectType: 'sleep' };
                  }
                  const failMsg = pick([
                      '你的手机没电了/门关上了。巨大的空虚感袭来。',
                      '你被强光晃瞎了眼，什么也没发生，除了短暂的失明。',
                      '有人大喊“OP收收味”，把你踢回了现实。'
                  ]);
                  return { changes: { smarts: -1, hissing: 2 }, message: failMsg, success: false, effectType: 'damage' };
              }
          },
          {
              id: 'guard_door',
              text: '守护这扇门',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  const msg = pick([
                      '你像个守门员一样挡在发光体前。谁也别想过去！哈气值提升。',
                      '你成为了“门之主”。路过的猫都觉得你疯了，但你觉得自己很帅。',
                      '你拒绝了二次元的诱惑，坚守了三次元的猫生。'
                  ]);
                  return { changes: { hissing: 5, smarts: 2 }, message: msg, success: true, effectType: 'neutral' };
              }
          }
      ]
  }
];
