
import { EndingType, EndingConfig } from '../types';
import { Skull, Crown, Star, Home, Heart, Zap, Ghost, Trash2, Camera, Brain, Shield, Users, HeartCrack, Baby, Smile, Frown, Swords, Flag, Eye, Lock, Bird, EggOff, Cat, Footprints, Scissors, Scale, Shuffle, Ban } from 'lucide-react';
import { getImg } from './utils';

export const ENDING_REGISTRY: Record<EndingType, EndingConfig> = {
    // === STAGE 1: STRAY ===
    'STRAY_STARVED': {
        id: 'STRAY_STARVED', title: '饿死街头', description: '流浪生活是残酷的。你在饥寒交迫中闭上了眼睛，没能撑过这个冬天。',
        icon: Skull, color: 'text-stone-500', isGood: false, image: getImg('瘦骨嶙峋的猫倒在雪地里', '57534e')
    },
    'STRAY_FROZEN': {
        id: 'STRAY_FROZEN', title: '冻毙荒野', description: '生命值耗尽。在某个寒冷的冬夜，你蜷缩成一团，再也没有睁开眼。',
        icon: Ghost, color: 'text-cyan-400', isGood: false, image: getImg('暴风雪中的僵硬猫咪', '0ea5e9')
    },
    'STRAY_DOMESTICATED': {
        id: 'STRAY_DOMESTICATED', title: '被收编的灵魂', description: '哈气值归零。你放弃了流浪的尊严，在第一阶段就主动找了张饭票。虽然活着，但野性已死。',
        icon: Home, color: 'text-orange-400', isGood: false, image: getImg('窗台上的家猫看着窗外', 'fbbf24')
    },

    // === STAGE 2: LORD ===
    'LORD_DEPOSED': {
        id: 'LORD_DEPOSED', title: '失去王座', description: '饱腹感归零。曾经的王因为太久没抢到食物，被年轻的挑战者赶下了台，饿死在领地边缘。',
        icon: Crown, color: 'text-stone-400', isGood: false, image: getImg('破碎的王冠与老猫的背影', '44403c')
    },
    'LORD_KILLED': {
        id: 'LORD_KILLED', title: '帮派喋血', description: '生命值归零。王座之下皆是枯骨。你在最后一次地盘争夺战中力竭而亡，死得像个斗士。',
        icon: Swords, color: 'text-red-600', isGood: false, image: getImg('巷战中倒下的伤痕累累的猫', '991b1b')
    },
    'LORD_SOFT': {
        id: 'LORD_SOFT', title: '威严扫地', description: '哈气值归零。你对小弟太温柔了，甚至开始讨好它们。它们不再怕你，你被驱逐出了猫群。',
        icon: Frown, color: 'text-yellow-600', isGood: false, image: getImg('被猫群嘲笑的落魄首领', 'a16207')
    },

    // === STAGE 3: MANSION ===
    'MANSION_THROWN_OUT': {
        id: 'MANSION_THROWN_OUT', title: '被逐出家门', description: '饱腹感归零（实际上是因挑食被饿）。因为过度挑剔激怒了主人，你被重新扔回了寒冷的街头，且已无生存能力。',
        icon: Trash2, color: 'text-stone-600', isGood: false, image: getImg('豪宅大门紧闭，猫在雨中', '57534e')
    },
    'MANSION_OBESITY': {
        id: 'MANSION_OBESITY', title: '富贵病', description: '生命值归零。顶级罐头和缺乏运动毁了你的心脏。你是在睡梦中因为脂肪肝走的。',
        icon: Heart, color: 'text-rose-500', isGood: false, image: getImg('过度肥胖的猫瘫在沙发上', 'f43f5e')
    },
    'MANSION_DOLL': {
        id: 'MANSION_DOLL', title: '彻底玩偶化', description: '哈气值归零。你穿上了粉色裙子，任由人类摆布，甚至学会了像狗一样握手。你的灵魂已经不是猫了。',
        icon: Smile, color: 'text-pink-400', isGood: false, image: getImg('穿着裙子眼神空洞的猫', 'f472b6')
    },

    // === STAGE 4: CELEBRITY ===
    'CELEB_EXHAUSTED': {
        id: 'CELEB_EXHAUSTED', title: '过劳死', description: '生命值归零。没完没了的通告和直播榨干了你最后一丝精力。你在闪光灯下倒下了。',
        icon: Skull, color: 'text-purple-900', isGood: false, image: getImg('直播间里累倒的猫', '581c87')
    },
    'CELEB_FORGOTTEN': {
        id: 'CELEB_FORGOTTEN', title: '过气明星', description: '饱腹感归零（流量枯竭）。流量退去后，主人不再喂你昂贵的食物。你在奢华的公寓里渐渐虚弱，无人问津。',
        icon: Ghost, color: 'text-gray-400', isGood: false, image: getImg('空荡荡的粉丝见面会', '9ca3af')
    },
    'CELEB_FAKE': {
        id: 'CELEB_FAKE', title: '工业假猫', description: '哈气值归零。你不再是一只猫，而是一个赚钱的符号。你的每一个表情都是设计好的，眼神里没有光。',
        icon: Camera, color: 'text-blue-400', isGood: false, image: getImg('无数闪光灯下的假笑猫', '3b82f6')
    },

    // === SPECIAL DEATHS ===
    'STUPID_DEATH': {
        id: 'STUPID_DEATH', title: '好奇害死猫', description: '智力归零。你的智商不足以支撑你活到明天。你因为好奇钻进了一个正在启动的引擎里。',
        icon: Brain, color: 'text-amber-700', isGood: false, image: getImg('汽车引擎盖与猫尾巴', 'b45309')
    },
    'PHILOSOPHY_DEATH': {
        id: 'PHILOSOPHY_DEATH', title: '虚无主义者', description: '因过度思考而绝食。你参透了宇宙的真理，觉得吃罐头没有意义。',
        icon: Brain, color: 'text-indigo-600', isGood: false, image: getImg('凝视星空的瘦猫', '4338ca')
    },

    // === SURVIVAL LEGENDS (Primary Endings) ===
    'SURVIVOR_STRAY': {
        id: 'SURVIVOR_STRAY', title: '街头幸存者', description: '15天结束。你从未被驯服，也从未称王。你作为一只普通的流浪猫活了下来，这是最平凡的奇迹。',
        icon: Star, color: 'text-stone-500', isGood: true, image: getImg('夕阳下的普通流浪猫', '78716c')
    },
    'LEGEND_LORD': {
        id: 'LEGEND_LORD', title: '不朽教父', description: '15天结束。你统治了这片区域直到最后。年轻的猫传颂着你的名字，虽然你依然流浪，但你是自由的王。',
        icon: Crown, color: 'text-purple-600', isGood: true, image: getImg('高墙上俯视众生的猫王', '7e22ce')
    },
    'LEGEND_COMFORT': {
        id: 'LEGEND_COMFORT', title: '养老赢家', description: '15天结束。你成功住进了豪宅，享受了最好的医疗和食物。晚年安稳，猫生圆满。',
        icon: Home, color: 'text-blue-600', isGood: true, image: getImg('壁炉前熟睡的胖猫', '2563eb')
    },
    'LEGEND_SUPERSTAR': {
        id: 'LEGEND_SUPERSTAR', title: '喵星巨星', description: '15天结束。你征服了街头、豪宅和互联网！你的名字被印在猫粮罐头上，你是这个时代的图腾。',
        icon: Star, color: 'text-amber-400', isGood: true, image: getImg('时代广场大屏幕上的猫', 'f59e0b')
    },

    // === ACHIEVEMENTS (Secondary Tags) ===
    'ACH_APPRENTICE_MASTER': {
        id: 'ACH_APPRENTICE_MASTER', title: '一代宗师', description: '成就：成功培养了一名优秀的徒弟，并与它并在巅峰相见。',
        icon: Users, color: 'text-emerald-500', isGood: true, image: getImg('两只猫并肩看日出', '10b981')
    },
    'ACH_APPRENTICE_RIVAL': {
        id: 'ACH_APPRENTICE_RIVAL', title: '宿敌', description: '成就：与徒弟反目成仇，并在多次交锋中存活下来。',
        icon: Swords, color: 'text-rose-500', isGood: true, image: getImg('两只猫对峙的剪影', 'e11d48')
    },
    'ACH_APPRENTICE_TRAITOR': {
        id: 'ACH_APPRENTICE_TRAITOR', title: '养虎为患', description: '成就：被自己亲手教出来的徒弟击败或羞辱。',
        icon: HeartCrack, color: 'text-gray-500', isGood: false, image: getImg('被年轻猫打败的老猫', '6b7280')
    },
    'ACH_LOVE_TRUE': {
        id: 'ACH_LOVE_TRUE', title: '神仙眷侣', description: '成就：打破了阶级的阻碍，与哈基米终成眷属。',
        icon: Heart, color: 'text-pink-500', isGood: true, image: getImg('两只猫依偎在窗台', 'ec4899')
    },
    'ACH_LOVE_FAMILY': {
        id: 'ACH_LOVE_FAMILY', title: '儿孙满堂', description: '成就：不仅赢得了爱情，还保住了蛋蛋，留下了优秀的基因。',
        icon: Cat, color: 'text-rose-400', isGood: true, image: getImg('一窝可爱的小猫', 'fb7185')
    },
    'ACH_DIVORCE': {
        id: 'ACH_DIVORCE', title: '一别两宽', description: '成就：虽然娶到了白富美，但为了流量炒作绯闻伤透了她的心。她带着孩子离开了，只留给你一个空荡荡的豪宅。',
        icon: Scissors, color: 'text-stone-600', isGood: false, image: getImg('撕裂的结婚照', '57534e')
    },
    'ACH_LOVE_REGRET': {
        id: 'ACH_LOVE_REGRET', title: '爱过', description: '成就：在暴雨夜选择了放手，留下了无尽的遗憾。',
        icon: HeartCrack, color: 'text-stone-400', isGood: true, image: getImg('雨夜中离去的背影', 'a8a29e')
    },
    'ACH_LOVE_PLATONIC': {
        id: 'ACH_LOVE_PLATONIC', title: '柏拉图之恋', description: '成就：虽然失去了身体的一部分，但你们的灵魂依然相依。',
        icon: Heart, color: 'text-blue-400', isGood: true, image: getImg('两只猫隔着玻璃对视', '60a5fa')
    },
    'ACH_EGG_DEFENDER': {
        id: 'ACH_EGG_DEFENDER', title: '孤睾战士', description: '成就：无论是因为顺从还是反抗失败，你永远失去了它们。你变得更强了，也更秃了。',
        icon: EggOff, color: 'text-stone-500', isGood: false, image: getImg('带着伊丽莎白圈的猫', '78716c')
    },
    
    // === PHILOSOPHY ACHIEVEMENTS ===
    'ACH_PHILO_UTOPIA': {
        id: 'ACH_PHILO_UTOPIA', title: '革命家', description: '成就：你试图建立一个没有饥饿的大同世界。',
        icon: Flag, color: 'text-red-500', isGood: true, image: getImg('猫群聚集在红旗帜下', 'ef4444')
    },
    'ACH_PHILO_NIHILISM': {
        id: 'ACH_PHILO_NIHILISM', title: '虚空凝视者', description: '成就：你打破了第四面墙，意识到这只是个游戏。',
        icon: Eye, color: 'text-purple-500', isGood: true, image: getImg('猫眼中的二进制代码', 'a855f7')
    },
    'ACH_PHILO_DICTATOR': {
        id: 'ACH_PHILO_DICTATOR', title: '独裁者', description: '成就：你悟出了强权即真理，并贯彻到底。',
        icon: Crown, color: 'text-black', isGood: true, image: getImg('独坐王座的黑影', '000000')
    },
    'ACH_PHILO_THREE_FACED': {
        id: 'ACH_PHILO_THREE_FACED', title: '墙头草', description: '成就：你在强权、互助和虚无之间反复横跳，试图讨好所有主义。',
        icon: Shuffle, color: 'text-amber-600', isGood: false, image: getImg('三张面具的猫', 'd97706')
    },
    'ACH_PHILO_TWO_FACED': {
        id: 'ACH_PHILO_TWO_FACED', title: '双面猫', description: '成就：你的立场摇摆不定，在两种思想中纠结。',
        icon: Scale, color: 'text-blue-400', isGood: true, image: getImg('半黑半白的脸', '3b82f6')
    },
    'ACH_PHILO_APOLITICAL': {
        id: 'ACH_PHILO_APOLITICAL', title: '岁月静好', description: '成就：你对哲学不感兴趣，或者完全避开了所有思考的机会。',
        icon: Ban, color: 'text-stone-400', isGood: true, image: getImg('睡觉的猫耳朵塞住', 'a8a29e')
    },

    'ACH_RETURN_WILD': {
        id: 'ACH_RETURN_WILD', title: '自由之翼', description: '成就：在流量巅峰选择撕碎马甲，回归街头。你虽然失去了一切，但赢回了自己。',
        icon: Bird, color: 'text-cyan-500', isGood: true, image: getImg('跳出窗户飞向蓝天的猫', '06b6d4')
    },
    'ACH_CAGE_CAT': {
        id: 'ACH_CAGE_CAT', title: '笼中困兽', description: '成就：试图逃离直播生涯失败，被关进了镀金的笼子。',
        icon: Lock, color: 'text-stone-700', isGood: false, image: getImg('金丝笼里眼神黯淡的猫', '292524')
    },
    'ACH_LONE_WOLF': {
        id: 'ACH_LONE_WOLF', title: '孤身一人', description: '成就：你没有爱情，没有徒弟，也没有搞哲学。你像一块石头一样硬邦邦地活到了最后。',
        icon: Footprints, color: 'text-stone-400', isGood: true, image: getImg('雪地里孤独的脚印', '57534e')
    },
    
    // === TRAITS ===
    'TRAIT_SAINT': {
        id: 'TRAIT_SAINT', title: '圣母喵', description: '评价：你对所有遇到的NPC都选择了友善的选项。',
        icon: Baby, color: 'text-emerald-400', isGood: true, image: getImg('头顶光环的猫', '34d399')
    },
    'TRAIT_DEVIL': {
        id: 'TRAIT_DEVIL', title: '恶伯爵', description: '评价：你对所有遇到的NPC都选择了暴力或掠夺。',
        icon: Ghost, color: 'text-red-700', isGood: true, image: getImg('恶魔角的猫', 'b91c1c')
    },
    'TRAIT_COWARD': {
        id: 'TRAIT_COWARD', title: '跑路王', description: '评价：遇到危险你总是第一个跑，但你活下来了。',
        icon: Zap, color: 'text-yellow-500', isGood: true, image: getImg('飞奔的残影', 'eab308')
    },
    'STAT_MAX_SMARTS': {
        id: 'STAT_MAX_SMARTS', title: '爱因斯坦', description: '评价：智力达到了巅峰 (100)。',
        icon: Brain, color: 'text-blue-600', isGood: true, image: getImg('戴眼镜的猫博士', '2563eb')
    },
    'STAT_MAX_HISSING': {
        id: 'STAT_MAX_HISSING', title: '哥斯拉', description: '评价：哈气值达到了巅峰 (100)。',
        icon: Zap, color: 'text-purple-600', isGood: true, image: getImg('喷火的巨猫', '9333ea')
    },
    'STAT_BALANCED': {
        id: 'STAT_BALANCED', title: '六边形战士', description: '评价：所有属性都保持在较高水平 (>=60)。',
        icon: Star, color: 'text-amber-500', isGood: true, image: getImg('全能猫超人', 'f59e0b')
    }
};
