
import { GameEvent } from '../../types';
import { roll, pick, getImg } from '../utils';

export const RANDOM_EVENTS: GameEvent[] = [
  // ==================== 猫咪日常 (Normal Cat Life) ====================
  {
      id: 'chase_butterfly',
      title: '日常：迷途的蝴蝶',
      description: '一只色彩斑斓的蝴蝶飞进了你的视野。它飞得很慢，似乎在挑衅你。',
      image: getImg('抓蝴蝶', 'f472b6'),
      type: 'RANDOM',
      choices: [
          {
              id: 'catch_it',
              text: '扑杀本能',
              calculateChance: (stats) => 70 + stats.health * 0.2,
              effect: (stats) => {
                  if (roll(70 + stats.health * 0.2)) {
                      return { changes: { hissing: 3, satiety: 2, health: 2 }, message: '你精准地按住了它。虽然口感一般（有点粉），但这是猎手的胜利。', success: true, effectType: 'neutral' };
                  }
                  return { changes: { health: -2 }, message: '你扑了个空，还在地上打了个滚。蝴蝶嘲笑般地飞高了。', success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'watch_zen',
              text: '静静欣赏',
              calculateChance: (stats) => 90, // 修改：从100%降为90%
              effect: (stats) => {
                  if (roll(90)) {
                    return { changes: { smarts: 3, hissing: -2 }, message: '你看着它起舞，参透了万物静观皆自得的道理。你的心境平和了。', success: true, effectType: 'heal' };
                  }
                  return { changes: { smarts: -1 }, message: '看着看着你睡着了，口水流了一地，醒来时蝴蝶早就不见了。', success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'hairball_hazard',
      title: '日常：毛球危机',
      description: '嗓子里痒痒的，有什么东西呼之欲出。是时候清理一下库存了。',
      image: getImg('吐毛球', '78716c'),
      type: 'RANDOM',
      choices: [
          {
              id: 'vomit_now',
              text: '咳出来！',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  return { changes: { health: 5, satiety: -5 }, message: '呕——！一个完美的管状毛球被吐了出来。你感觉神清气爽，胃口大开。', success: true, effectType: 'heal' };
              }
          },
          {
              id: 'swallow_down',
              text: '咽下去',
              calculateChance: (stats) => 50,
              effect: (stats) => {
                  if (roll(50)) {
                      return { changes: { satiety: 2, health: -2 }, message: '你强行把它咽了回去。虽然有点恶心，但至少没吐得到处都是。', success: true, effectType: 'neutral' };
                  }
                  return { changes: { health: -5, satiety: -5 }, message: '咽不下去！你反而呛到了，咳嗽了半天，难受极了。', success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'sunny_nap',
      title: '日常：午后阳光',
      description: '今天阳光正好，一块完美的光斑投射在地上。它在移动，它在召唤。',
      image: getImg('晒太阳', 'fbbf24'),
      type: 'RANDOM',
      choices: [
          {
              id: 'sunbathe',
              text: '光合作用',
              calculateChance: (stats) => 95, // 修改：从100%降为95%
              effect: (stats) => {
                  if (roll(95)) {
                    return { changes: { health: 3, hissing: -3, smarts: -1 }, message: '你躺在光斑里，随着太阳移动挪动身体。这一刻，你是一只液体的猫。', success: true, effectType: 'sleep' };
                  }
                  return { changes: { health: -1, hissing: 1 }, message: '刚躺下，一片乌云遮住了太阳。你的好心情没了。', success: false, effectType: 'neutral' };
              }
          },
          {
              id: 'shadow_hunt',
              text: '抓影子',
              calculateChance: (stats) => 80,
              effect: (stats) => {
                  if(roll(80)) {
                      return { changes: { health: 2, satiety: -2 }, message: '你在光影交错间跳跃。虽然什么也没抓到，但活动了筋骨。', success: true, effectType: 'neutral' };
                  }
                  return { changes: { smarts: -2 }, message: '你追着自己的影子跑了十圈，转晕了。路边的狗看傻了。', success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'strange_bug',
      title: '日常：神秘虫子',
      description: '地板上有一只长得很奇怪的多腿生物正在快速移动。',
      image: getImg('抓虫子', '3f6212'),
      type: 'RANDOM',
      choices: [
          {
              id: 'eat_bug',
              text: '丰富的蛋白质',
              calculateChance: (stats) => 60,
              effect: (stats) => {
                  if (roll(60)) {
                      return { changes: { satiety: 5, health: 1 }, message: '嘎嘣脆，鸡肉味。虽然不知道是什么，但能吃就行。', success: true, effectType: 'heal' };
                  }
                  return { changes: { health: -5, satiety: -2 }, message: '这虫子是辣的！或者是臭的！你的嘴麻了一下午。', success: false, effectType: 'damage' };
              }
          },
          {
              id: 'play_bug',
              text: '玩弄它',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  return { changes: { hissing: 2, smarts: 1 }, message: '你把它拨来拨去，直到它不再动弹。你失去了兴趣，高傲地离开了。', success: true, effectType: 'neutral' };
              }
          }
      ]
  },

  // ==================== 梗事件 (Meme Events) ====================
  {
      id: 'snow_leopard_boy',
      title: '狸塘：纯真的眼神',
      description: '你遇到了一位眼神清澈的少年，他手里拿着猫薄荷电子烟。他的身边似乎跟着一只白色的猛兽，少年正在对着它大喊：“雪豹闭嘴！”',
      image: getImg('芝士雪豹', '0ea5e9'),
      type: 'RANDOM',
      choices: [
          {
              id: 'approach_beast',
              text: '挑衅那只“大猫”',
              calculateChance: (stats) => 50,
              effect: (stats) => {
                  if (roll(50)) {
                      const msg = pick([
                          '你冲上去哈气，结果发现那是烟雾幻化成的雪豹。少年赞赏你的勇气：“这是瑞克五代。”',
                          '那只雪豹被你的气势震慑，居然发出了一声“喵”。原来是只染色的家猫。',
                          '少年把你抱了起来，对着镜头说：“家人们，这是我在狸塘捡到的猞猁。”你火了。'
                      ]);
                      return { changes: { hissing: 3, smarts: 1, satiety: 2 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '那真的是一只雪豹！它给了你一巴掌。你飞出了三米远。',
                      '少年把你当成了电子烟，对着你猛吸了一口。你差点窒息。',
                      '你被少年的高音震晕了。这就是顶流的压迫感吗？'
                  ]);
                  return { changes: { health: -8, hissing: -2 }, message: failMsg, success: false, effectType: 'damage' };
                  }
          },
          {
              id: 'listen_song',
              text: '聆听他的歌声',
              calculateChance: (stats) => 90, // 修改：从100%降为90%
              effect: (stats) => {
                  if (roll(90)) {
                    const msg = pick([
                        '他唱起了《Zood》。那空灵的嗓音净化了你的心灵，虽然你一句也没听懂。',
                        '你感觉自己在草原上奔跑，周围全是名为“吱吱”的小马（老鼠）。',
                        '你悟出了“回笼”的真谛。世界变得简单而纯粹。'
                    ]);
                    return { changes: { smarts: -1, health: 3, hissing: -3 }, message: msg, success: true, effectType: 'heal' };
                  }
                  return { changes: { smarts: -2 }, message: '这歌声太魔性了，在你脑子里循环了一整天，搞得你头痛欲裂。', success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'intestine_judge',
      title: '顶级厨狮的试炼',
      description: '一位胖胖的厨师端着一盘九转大肠刺身站在你面前。评委曹可盘（盘子）正死死盯着他，问：“你自己尝了吗？”',
      image: getImg('九转大肠', 'b45309'),
      type: 'RANDOM',
      choices: [
          {
              id: 'taste_it',
              text: '品尝一口',
              calculateChance: (stats) => 60,
              effect: (stats) => {
                  if (roll(60)) {
                      const msg = pick([
                          '“但是我保留了一部分原味，才知道你吃的是大肠。” 你被这股直冲天灵盖的味道征服了。',
                          '你品尝到了猫生百味。酸甜苦辣咸，还有那一抹无法忽视的...答辩味。',
                          '你的味蕾被重击了，但你的肠胃居然适应了这种强度。饱腹感+。'
                      ]);
                      return { changes: { satiety: 12, health: -1, smarts: 1 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '呕！你当场把隔夜饭吐了出来。这根本不是给猫吃的！',
                      '那种直冲天灵盖的腥臭味让你晕了过去。这是生化武器！',
                      '你愤怒地打翻了盘子。评委曹可盘给你点了个赞。'
                  ]);
                  return { changes: { health: -8, satiety: -5 }, message: failMsg, success: false, effectType: 'damage' };
              }
          },
          {
              id: 'ask_intent',
              text: '是故意的还是不小心的？',
              calculateChance: (stats) => 100,
              effect: (stats) => {
                  const msg = pick([
                      '厨师挺起胸膛，骄傲地抬起头：“是故意的！” 你被这种诚实（和无耻）震撼了。',
                      '他承认保留了一部分原味，为了让你知道你吃的是大肠。多么朴素的真理。',
                      '你通过眼神确认了，他是带着骄傲端上来的。你默默敬了个礼，然后跑路。'
                  ]);
                  return { changes: { smarts: 3, hissing: 1 }, message: msg, success: true, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'macarthur_review',
      title: '五星上将麦克抓瑟',
      description: '周围的空气突然凝固，背景音乐变成了严肃的纪录片风格。一个深沉的男声响起：“如果让我去评价这只猫...”',
      image: getImg('大型猫片', '1e1b4b'),
      type: 'RANDOM',
      choices: [
          {
              id: 'accept_review',
              text: '接受采访',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  const msg = pick([
                      '麦克抓瑟表示：这只猫的圆头比我的军衔还要闪耀。连我也要在它的哈气面前退避三舍。',
                      '五星上将评论道：当年我在战场如果有这只猫的一半勇气，我也不会撤退得那么狼狈。',
                      '大型纪录片《传奇名猫》正在播出。你的威望值在猫圈达到了顶峰。'
                  ]);
                  return { changes: { hissing: 5, smarts: 1 }, message: msg, success: true, effectType: 'neutral' };
              }
          },
          {
              id: 'salute',
              text: '向将军敬礼',
              calculateChance: (stats) => 50,
              effect: (stats) => {
                  if (roll(50)) {
                      const msg = pick([
                          '你标准地举起了爪子。麦克抓瑟感动落泪，送了你一根在这个年纪睡得着的玉米芯（其实是火腿肠）。',
                          '老兵不死，只是凋零。你们在精神层面达成了共鸣。',
                          '这一刻，你不再是一只流浪猫，你是麦克抓瑟认证的战略合作伙伴。'
                      ]);
                      return { changes: { satiety: 8, hissing: 3 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '你敬礼的时候爪子钩住了胡子，场面一度十分滑稽。纪录片变成了喜剧片。',
                      '旁白突然卡壳了：“这...这只猫在干什么？” 导演喊了卡。',
                      '你把敬礼做成了招财猫的动作。麦克抓瑟觉得你在向他要钱。'
                  ]);
                  return { changes: { smarts: -1 }, message: failMsg, success: false, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'lightning_whips',
      title: '混元形意：马保锅',
      description: '你遇到一只穿着对襟小褂的老猫，它自称是混元形意太极门掌门。它突然开始全身疯狂抽动，并对你大喊：“年轻人不讲武德，快来领教我的闪电五连编！”',
      image: getImg('闪电五连编', '1e1b4b'),
      type: 'RANDOM',
      choices: [
          {
              id: 'learn_whips',
              text: '尝试学习“松鼠弹抖”',
              calculateChance: (stats) => Math.min(95, 20 + stats.health * 0.6),
              effect: (stats) => {
                  if (roll(20 + stats.health * 0.6)) {
                      const msg = pick([
                          '你掌握了高频振动的精髓！现在的你只要一炸毛，频率快到肉眼看不见。对方被你的气势吓得直呼“耗子尾汁”。',
                          '你悟出了“接化发”的真谛，老猫欣慰地摸了摸你的头。你感觉全身充满了武林正气。',
                          '你在抖动中产生了一股神秘的生物电，整条街的感应灯都为你闪烁。老猫直呼你为“奇才”。'
                      ]);
                      return { changes: { hissing: 6, smarts: -1, health: 3 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '你还没弹抖起来，就因为频率过高导致腰闪了。大师摇头叹息：“年轻人，你大意了，没有闪。”',
                      '你用力过猛，把自己摔成了“咸鱼大翻身”。大师表示这种武德需要回炉重造。',
                      '你尝试模仿大师，结果看起来像是在抽筋。路过的一只泰迪对你投来了同情的目光。'
                  ]);
                  return { changes: { health: -5, hissing: -3 }, message: failMsg, success: false, effectType: 'damage' };
              }
          },
          {
              id: 'rat_tail_juice',
              text: '劝他“好自为之”',
              calculateChance: (stats) => 90, // 修改：从100%降为90%
              effect: (stats) => {
                  if (roll(90)) {
                    const msg = pick([
                        '你优雅地走开，并留下了一个鄙视的眼神。大师愣在原地，开始反思自己的武德。你的智力得到了社会实践的提升。',
                        '你轻蔑地打了个哈欠，大师气得跳脚，却因为腰椎间盘突出无法追赶。你的冷静赢得了围观猫咪的掌声。',
                        '你留下了一句模糊的“喵（傻）”，飘然而去。这种不战而屈人之兵的境界让你的智力大幅上涨。'
                    ]);
                    return { changes: { smarts: 3, hissing: 1 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  return { changes: { health: -2 }, message: '大师急眼了，从背后偷袭了你！“我大意了，没有闪”的人变成了你。', success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'nezha_meatballs',
      title: '魔童降世：哪抓',
      description: '海边，一个扎着两个揪揪、套着红肚兜的小屁孩正对着一堆食材疯狂研磨。一股混合了仙气和牛肉的香味飘来，这是传说中的“灵珠磨丸”！',
      image: getImg('哪抓磨丸', 'ef4444'),
      type: 'RANDOM',
      choices: [
          {
              id: 'help_grind',
              text: '帮他一起磨（为了吃）',
              calculateChance: (stats) => Math.min(95, 30 + stats.health * 0.5),
              effect: (stats) => {
                  if (roll(30 + stats.health * 0.5)) {
                      const msg = pick([
                          '你用爪子帮他搓出了完美的球体。哪抓很高兴，分了你一颗磨好的金青色肉丸。吃下去后，你感觉浑身充满了混元珠的力量！',
                          '你那圆润的身体和磨盘意外地合拍。磨出来的肉丸色泽晶莹。哪抓赏了你一大碗肉糜。',
                          '磨丸过程中你悟出了离心力原理。哪抓觉得你这只猫很上道，和你共享了这顿仙肴。'
                      ]);
                      return { changes: { satiety: 12, health: 5, smarts: 1 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '你磨得太慢了，哪抓不耐烦地一脚把你踢进了海里。海水很凉，你的自尊心和身体都受到了伤害。',
                      '你不小心把口水掉进了磨盘里，哪抓大发雷霆，把你当成混天绫一样甩了三圈。',
                      '你的爪子被磨盘夹住了，痛得你发出了杀猪般的喵叫。肉丸没吃到，反而损兵折将。'
                  ]);
                  return { changes: { health: -5, satiety: -1 }, message: failMsg, success: false, effectType: 'damage' };
              }
          },
          {
              id: 'dragon_warning',
              text: '提醒他：龙王在看着你',
              calculateChance: (stats) => 80,
              effect: (stats) => {
                  const msg = pick([
                      '哪抓停下了手中的磨盘，若有所思地看向大海。他觉得你这只猫很有见地，送了你一块乾坤圈碎屑（其实是块磨牙饼干）。',
                      '由于你的提醒，哪抓避开了巡海夜叉。他称赞你为“猫中诸葛”。',
                      '哪抓觉得你的直觉很准，他分了一些极品和牛给你，让你帮他放哨。'
                  ]);
                  return { changes: { smarts: 5, hissing: 2 }, message: msg, success: true, effectType: 'neutral' };
              }
          }
      ]
  },
  {
      id: 'mamba_destiny',
      title: '黑曼巴：落山鸡的雾',
      description: '清晨四点的“落山鸡”（Los Angeles）大雾弥漫。你看到一个穿着紫金24号球衣的巨人正走向一架直升机。你的直觉疯狂预警，那是通往天堂的单程票。',
      image: getImg('凌晨四点的救赎', '4b2a89'),
      type: 'RANDOM',
      allowedStages: ['MANSION', 'CELEBRITY'],
      choices: [
          {
              id: 'mamba_bite',
              text: '死命咬住他的球鞋不松口',
              calculateChance: (stats) => Math.min(95, 20 + stats.hissing * 0.5 + stats.health * 0.3),
              effect: (stats) => {
                  if (roll(20 + stats.hissing * 0.5 + stats.health * 0.3)) {
                      const msg = pick([
                          '你死死咬住那双Kobe 5。他无奈地停下来蹲下安抚你，错过了起飞时间。直升机独自飞入浓雾。你救了一个时代。',
                          '你那锋利的牙齿咬穿了昂贵的皮料。他为了抓住你耽误了时间，远方的雾气中传来闷响。他摸着你的头，一脸庆幸。',
                          '他把你从鞋子上拽下来，准备说教时，看到了新闻。他沉默了很久，给了你一个紧紧的拥抱。Man, what can I say?'
                      ]);
                      return { changes: { health: 5, smarts: 5, hissing: -2 }, message: msg, success: true, effectType: 'heal' };
                  }
                  const failMsg = pick([
                      '你被轻轻拨开了。他回头给了你一个标志性的笑容，转身上了机。旋律响起，那是遗憾的声音。',
                      '你还没跳上去就被保安拎走了。你只能对着天空中远去的螺旋桨发声长叹。',
                      '你的牙齿滑了一下。那个伟岸的身影在浓雾中渐渐消失。See You Again 旋律在脑中回响。'
                  ]);
                  return { changes: { health: -3, hissing: 2 }, message: failMsg, success: false, effectType: 'damage' };
              }
          },
          {
              id: 'mamba_backpack',
              text: '钻进他的背包里撒尿',
              calculateChance: (stats) => Math.min(95, 30 + stats.smarts * 0.6),
              effect: (stats) => {
                  if (roll(30 + stats.smarts * 0.6)) {
                      const msg = pick([
                          '他闻到了异味，不得不回屋更换装备。直升机因塔台指令先行起飞。他摸着你的圆头叹了口气。这泡尿拯救了世界。',
                          '这一招虽然恶心，但极其见效。他不得不留下来清理背包。你看着他避开了死神，深藏功与名。',
                          '异味让他陷入了沉思，他决定今天不出远门了。他不知道，你的一泡尿改变了篮球史。'
                      ]);
                      return { changes: { smarts: 5, hissing: 5, satiety: 2 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '你钻进去了，但他并没有发现。这下真的 See You Again 了。（还好你有9条命）',
                      '你还没来得及施展，就被他顺手塞进了一个豪华猫包带走了。你不得不面对未知的航程。',
                      '你在背包里睡着了，直到降落。虽然很安全，但你什么都没改变。'
                  ]);
                  return { changes: { hissing: -1, smarts: -1 }, message: failMsg, success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'sakiko_crying',
      title: '丰川箱子：猫生组乐队',
      description: '一个穿着黑色衣服的蓝发少女在街角哭泣，她似乎很喜欢“箱子”。她看着你，眼神空洞：“你这只猫，满脑子都只想着自己呢。”',
      image: getImg('丰川箱子', '1e1b4b'),
      type: 'RANDOM',
      allowedStages: ['STRAY', 'CAT_LORD'],
      choices: [
          {
              id: 'sakiko_comfort',
              text: '求组乐队',
              calculateChance: (stats) => 90,
              effect: (stats) => {
                  const msg = pick([
                      '“我是客服小箱... 你愿意把剩下的猫生交给我吗？” 她把你抱进了纸箱，虽然你只是一只猫。',
                      '她擦干了眼泪，弹起了《春日影爪》。你成了 Ave Mewjica 的吉祥物。',
                      '她自嘲地笑了：“连猫都在可怜我吗？” 温暖的体温平复了她的情绪。'
                  ]);
                  return { changes: { satiety: 8, hissing: -1, smarts: 1 }, message: msg, success: true, effectType: 'heal' };
              }
          },
          {
              id: 'sakiko_steal',
              text: '抢走她的黄瓜',
              calculateChance: (stats) => 50,
              effect: (stats) => {
                  if (roll(50)) {
                      const msg = pick([
                          '你叼起她便当里的黄瓜拔腿就跑。箱子愣住了，暂时忘了哭泣。',
                          '黄瓜被你藏进了下水道。箱子找了半天，最终决定放下过去（或者陷入更深的绝望）。',
                          '你咬了一口，很难吃。但你成功转移了她的注意力。'
                      ]);
                      return { changes: { hissing: 5, smarts: 2 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '你刚动手，就被一个叫长崎素世的人类抓住了后颈皮，你被强制教育了一番。',
                      '箱子的手速极快，一把按住了你。她用那种极其冰冷的眼神看着你，让你不寒而栗。',
                      '你被黄瓜上的刺扎到了嘴。箱子连看都没看你一眼，继续沉浸在悲伤中。'
                  ]);
                  return { changes: { health: -3, hissing: 1 }, message: failMsg, success: false, effectType: 'damage' };
              }
          }
      ]
  },
  {
      id: 'basketball_chicken',
      title: '练习牲：只因你太美',
      description: '背景音乐突然响起了“只因你太美”。你看到一只穿着背带裤的猫在运球。',
      image: getImg('只因你太美', '6366f1'),
      type: 'RANDOM',
      choices: [
          {
              id: 'tie_shan_kao',
              text: '施展“铁山靠”',
              calculateChance: (stats) => Math.min(95, 40 + stats.health * 0.5),
              effect: (stats) => {
                  if (roll(40 + stats.health * 0.5)) {
                      const msg = pick([
                          '你的肩膀猛地一撞，篮球飞得老远。全场都在为你欢呼。你感觉自己练习了两年半。',
                          '这一撞充满了灵魂！你不仅击飞了球，还完成了一个优雅的转身。Ikung! ',
                          '背带裤瞬间穿在身（幻觉）。你的爆发力让周围的小黑爪惊掉下巴。'
                      ]);
                      return { changes: { health: 3, hissing: 3, smarts: -1 }, message: msg, success: true, effectType: 'neutral' };
                  }
                  const failMsg = pick([
                      '你用力过猛，撞到了电线杆上。那个旋律仿佛在嘲笑你：小黑子！露出鸡脚了吧！',
                      '你重心不稳，由于太滑直接滚进了下水道。练习时长增加中。',
                      '你的毛发被篮球弹到了，产生了静电。'
                  ]);
                  return { changes: { health: -3 }, message: failMsg, success: false, effectType: 'damage' };
              }
          },
          {
              id: 'rap_meow',
              text: '食不食鱼饼？',
              calculateChance: (stats) => Math.min(95, 20 + stats.smarts * 0.8),
              effect: (stats) => {
                  const msg = pick([
                      '你对着路人喵喵叫：“食不食鱼饼？”路人被你逗乐了，给了你一块真的鱼饼。',
                      '你的快节奏喵叫极具感染力。路过的音乐博主把你拍了下来。',
                      '香翅捞饭！你的叫声充满了魔性，智力+2。'
                  ]);
                  return { changes: { smarts: 2, satiety: 3 }, message: msg, success: true, effectType: 'heal' };
              }
          }
      ]
  }
];
