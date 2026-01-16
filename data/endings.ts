
import { EndingType, EndingConfig } from '../types';
import { Skull, Crown, Star, Home, Heart, Zap, Ghost, Trash2, Camera, Brain, Shield, Users, HeartCrack, Baby, Smile, Frown, Swords, Flag, Eye } from 'lucide-react';
import { getImg } from './utils';

export const ENDING_REGISTRY: Record<EndingType, EndingConfig> = {
    // === STAGE 1: STRAY ===
    'STRAY_STARVED': {
        id: 'STRAY_STARVED', title: '饿死街头', description: '流浪生活是残酷的。你在饥寒交迫中闭上了眼睛，没能撑过这个冬天。',
        icon: Skull, color: 'text-stone-500', isGood: false, image: getImg('饿死', '57534e')
    },
    'STRAY_FROZEN': {
        id: 'STRAY_FROZEN', title: '冻毙荒野', description: '生命值耗尽。在某个寒冷的冬夜，你蜷缩成一团，再也没有睁开眼。',
        icon: Ghost, color: 'text-cyan-400', isGood: false, image: getImg('冻死', '0ea5e9')
    },
    'STRAY_DOMESTICATED': {
        id: 'STRAY_DOMESTICATED', title: '被收编的灵魂', description: '哈气值归零。你放弃了流浪的尊严，在第一阶段就主动找了张饭票。虽然活着，但野性已死。',
        icon: Home, color: 'text-orange-400', isGood: false, image: getImg('被收编', 'fbbf24')
    },

    // === STAGE 2: LORD ===
    'LORD_DEPOSED': {
        id: 'LORD_DEPOSED', title: '失去王座', description: '饱腹感归零。曾经的王因为太久没抢到食物，被年轻的挑战者赶下了台，饿死在领地边缘。',
        icon: Crown, color: 'text-stone-400', isGood: false, image: getImg('王座陨落', '44403c')
    },
    'LORD_KILLED': {
        id: 'LORD_KILLED', title: '帮派喋血', description: '生命值归零。王座之下皆是枯骨。你在最后一次地盘争夺战中力竭而亡，死得像个斗士。',
        icon: Swords, color: 'text-red-600', isGood: false, image: getImg('战死', '991b1b')
    },
    'LORD_SOFT': {
        id: 'LORD_SOFT', title: '威严扫地', description: '哈气值归零。你对小弟太温柔了，甚至开始讨好它们。它们不再怕你，你被驱逐出了猫群。',
        icon: Frown, color: 'text-yellow-600', isGood: false, image: getImg('被驱逐', 'a16207')
    },

    // === STAGE 3: MANSION ===
    'MANSION_THROWN_OUT': {
        id: 'MANSION_THROWN_OUT', title: '被逐出家门', description: '饱腹感归零（实际上是因挑食被饿）。因为过度挑剔激怒了主人，你被重新扔回了寒冷的街头，且已无生存能力。',
        icon: Trash2, color: 'text-stone-600', isGood: false, image: getImg('被遗弃', '57534e')
    },
    'MANSION_OBESITY': {
        id: 'MANSION_OBESITY', title: '富贵病', description: '生命值归零。顶级罐头和缺乏运动毁了你的心脏。你是在睡梦中因为脂肪肝走的。',
        icon: Heart, color: 'text-rose-500', isGood: false, image: getImg('肥胖致死', 'f43f5e')
    },
    'MANSION_DOLL': {
        id: 'MANSION_DOLL', title: '彻底玩偶化', description: '哈气值归零。你穿上了粉色裙子，任由人类摆布，甚至学会了像狗一样握手。你的灵魂已经不是猫了。',
        icon: Smile, color: 'text-pink-400', isGood: false, image: getImg('穿裙子的猫', 'f472b6')
    },

    // === STAGE 4: CELEBRITY ===
    'CELEB_EXHAUSTED': {
        id: 'CELEB_EXHAUSTED', title: '过劳死', description: '生命值归零。没完没了的通告和直播榨干了你最后一丝精力。你在闪光灯下倒下了。',
        icon: Skull, color: 'text-purple-900', isGood: false, image: getImg('直播猝死', '581c87')
    },
    'CELEB_FORGOTTEN': {
        id: 'CELEB_FORGOTTEN', title: '过气明星', description: '饱腹感归零（流量枯竭）。流量退去后，主人不再喂你昂贵的食物。你在奢华的公寓里渐渐虚弱，无人问津。',
        icon: Ghost, color: 'text-gray-400', isGood: false, image: getImg('过气', '9ca3af')
    },
    'CELEB_FAKE': {
        id: 'CELEB_FAKE', title: '工业假猫', description: '哈气值归零。你不再是一只猫，而是一个赚钱的符号。你的每一个表情都是设计好的，眼神里没有光。',
        icon: Camera, color: 'text-blue-400', isGood: false, image: getImg('假笑猫', '3b82f6')
    },

    // === SPECIAL DEATHS ===
    'STUPID_DEATH': {
        id: 'STUPID_DEATH', title: '好奇害死猫', description: '智力归零。你的智商不足以支撑你活到明天。你因为好奇钻进了一个正在启动的引擎里。',
        icon: Brain, color: 'text-amber-700', isGood: false, image: getImg('蠢死', 'b45309')
    },
    'PHILOSOPHY_DEATH': {
        id: 'PHILOSOPHY_DEATH', title: '虚无主义者', description: '因过度思考而绝食。你参透了宇宙的真理，觉得吃罐头没有意义。',
        icon: Brain, color: 'text-indigo-600', isGood: false, image: getImg('思考者', '4338ca')
    },

    // === SURVIVAL LEGENDS (Primary Endings) ===
    'SURVIVOR_STRAY': {
        id: 'SURVIVOR_STRAY', title: '街头幸存者', description: '15天结束。你从未被驯服，也从未称王。你作为一只普通的流浪猫活了下来，这是最平凡的奇迹。',
        icon: Star, color: 'text-stone-500', isGood: true, image: getImg('幸存', '78716c')
    },
    'LEGEND_LORD': {
        id: 'LEGEND_LORD', title: '不朽教父', description: '15天结束。你统治了这片区域直到最后。年轻的猫传颂着你的名字，虽然你依然流浪，但你是自由的王。',
        icon: Crown, color: 'text-purple-600', isGood: true, image: getImg('教父', '7e22ce')
    },
    'LEGEND_COMFORT': {
        id: 'LEGEND_COMFORT', title: '养老赢家', description: '15天结束。你成功住进了豪宅，享受了最好的医疗和食物。晚年安稳，猫生圆满。',
        icon: Home, color: 'text-blue-600', isGood: true, image: getImg('豪宅养老', '2563eb')
    },
    'LEGEND_SUPERSTAR': {
        id: 'LEGEND_SUPERSTAR', title: '喵星巨星', description: '15天结束。你征服了街头、豪宅和互联网！你的名字被印在猫粮罐头上，你是这个时代的图腾。',
        icon: Star, color: 'text-amber-400', isGood: true, image: getImg('巨星', 'f59e0b')
    },

    // === ACHIEVEMENTS (Secondary Tags) ===
    'ACH_APPRENTICE_MASTER': {
        id: 'ACH_APPRENTICE_MASTER', title: '一代宗师', description: '成就：成功培养了一名优秀的徒弟，并与它并在巅峰相见。',
        icon: Users, color: 'text-emerald-500', isGood: true
    },
    'ACH_APPRENTICE_RIVAL': {
        id: 'ACH_APPRENTICE_RIVAL', title: '宿敌', description: '成就：与徒弟反目成仇，并在多次交锋中存活下来。',
        icon: Swords, color: 'text-rose-500', isGood: true
    },
    'ACH_APPRENTICE_TRAITOR': {
        id: 'ACH_APPRENTICE_TRAITOR', title: '养虎为患', description: '成就：被自己亲手教出来的徒弟击败或羞辱。',
        icon: HeartCrack, color: 'text-gray-500', isGood: false
    },
    'ACH_LOVE_TRUE': {
        id: 'ACH_LOVE_TRUE', title: '神仙眷侣', description: '成就：打破了阶级的阻碍，与哈基米终成眷属。',
        icon: Heart, color: 'text-pink-500', isGood: true
    },
    'ACH_LOVE_REGRET': {
        id: 'ACH_LOVE_REGRET', title: '爱过', description: '成就：在暴雨夜选择了放手，留下了无尽的遗憾。',
        icon: HeartCrack, color: 'text-stone-400', isGood: true
    },
    'ACH_LOVE_PLATONIC': {
        id: 'ACH_LOVE_PLATONIC', title: '柏拉图之恋', description: '成就：虽然失去了身体的一部分，但你们的灵魂依然相依。',
        icon: Heart, color: 'text-blue-400', isGood: true
    },
    'ACH_EGG_DEFENDER': {
        id: 'ACH_EGG_DEFENDER', title: '孤睾战士', description: '成就：面对手术刀，你誓死捍卫了身体的完整性！',
        icon: Shield, color: 'text-orange-500', isGood: true
    },
    'ACH_PHILO_UTOPIA': {
        id: 'ACH_PHILO_UTOPIA', title: '革命家', description: '成就：你试图建立一个没有饥饿的大同世界。',
        icon: Flag, color: 'text-red-500', isGood: true
    },
    'ACH_PHILO_NIHILISM': {
        id: 'ACH_PHILO_NIHILISM', title: '虚空凝视者', description: '成就：你打破了第四面墙，意识到这只是个游戏。',
        icon: Eye, color: 'text-purple-500', isGood: true
    },
    'ACH_PHILO_DICTATOR': {
        id: 'ACH_PHILO_DICTATOR', title: '独裁者', description: '成就：你悟出了强权即真理，并贯彻到底。',
        icon: Crown, color: 'text-black', isGood: true
    },
    
    // === TRAITS ===
    'TRAIT_SAINT': {
        id: 'TRAIT_SAINT', title: '圣母喵', description: '评价：你对所有遇到的NPC都选择了友善的选项。',
        icon: Baby, color: 'text-emerald-400', isGood: true
    },
    'TRAIT_DEVIL': {
        id: 'TRAIT_DEVIL', title: '恶伯爵', description: '评价：你对所有遇到的NPC都选择了暴力或掠夺。',
        icon: Ghost, color: 'text-red-700', isGood: true
    },
    'TRAIT_COWARD': {
        id: 'TRAIT_COWARD', title: '跑路王', description: '评价：遇到危险你总是第一个跑，但你活下来了。',
        icon: Zap, color: 'text-yellow-500', isGood: true
    },
    'STAT_MAX_SMARTS': {
        id: 'STAT_MAX_SMARTS', title: '爱因斯坦', description: '评价：智力达到了巅峰 (100)。',
        icon: Brain, color: 'text-blue-600', isGood: true
    },
    'STAT_MAX_HISSING': {
        id: 'STAT_MAX_HISSING', title: '哥斯拉', description: '评价：哈气值达到了巅峰 (100)。',
        icon: Zap, color: 'text-purple-600', isGood: true
    },
    'STAT_BALANCED': {
        id: 'STAT_BALANCED', title: '六边形战士', description: '评价：所有属性都保持在较高水平 (>=60)。',
        icon: Star, color: 'text-amber-500', isGood: true
    }
};
