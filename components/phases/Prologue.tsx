
import React, { useState } from 'react';
import { Snowflake, ArrowRight } from 'lucide-react';
import { audioManager } from '../../utils/audio';

type PrologueStepId = 'INTRO' | 'CHOICE_SHELF' | 'BATTLE_START' | 'BATTLE_END' | 'EXILE' | 'DEATH';

interface PrologueStep {
    id: PrologueStepId;
    text: string;
    choices?: { label: string, next: PrologueStepId }[];
}

interface Props {
    onComplete: () => void;
}

export const Prologue: React.FC<Props> = ({ onComplete }) => {
    const [stepId, setStepId] = useState<PrologueStepId>('INTRO');

    const prologueContent: Record<PrologueStepId, PrologueStep> = {
        'INTRO': {
            id: 'INTRO',
            text: '凛冬已至。\n\n你悄悄走进那扇熟悉的红木门，屋里的暖气裹挟着食物的香气扑面而来。\n远处的桌子上放着半罐没吃完的顶级金枪鱼罐头，看着让人垂涎欲滴。\n\n那是你曾经的家，或者说，曾经允许你进入的地方。',
            choices: [{ label: '跳上桌子大快朵颐', next: 'CHOICE_SHELF' }]
        },
        'CHOICE_SHELF': {
            id: 'CHOICE_SHELF',
            text: '你轻车熟路地跳上桌子，刚伸出舌头，突然——\n\n一个带着白手套的家伙出现了。那是你的宿敌，“洁癖管家”。\n他发出了尖锐的惊叫声，挥舞着鸡毛掸子把你赶下了桌子。\n\n你慌忙准备从门口逃出，谁料门居然不知在什么时候被关闭了。前有追兵，后无退路。',
            choices: [{ label: '跳上旁边的博古架！', next: 'BATTLE_START' }]
        },
        'BATTLE_START': {
            id: 'BATTLE_START',
            text: '你慌不择路，纵身一跃跳上了摇摇欲坠的博古架。\n\n这里摆满了那些所谓的“古董”。\n白手套停住了，他的脸因为恐惧而扭曲：“别动！那是明朝的——”\n\n你看着他惊恐的表情，内心涌起一股报复的快感。',
            choices: [{ label: '发动技能：大闹天宫', next: 'BATTLE_END' }]
        },
        'BATTLE_END': {
            id: 'BATTLE_END',
            text: '【博古架之战】\n\n噼里啪啦——！\n\n随着一声声清脆的碎裂声，花瓶、玉器、瓷盘化作一地狼藉。\n白手套的咆哮声几乎震碎了你的耳膜。你像一道金色的闪电，在废墟中穿梭。\n\n直到那只带着皮手套的大手死死抓住了你的后颈皮。',
            choices: [{ label: '放开我！', next: 'EXILE' }]
        },
        'EXILE': {
            id: 'EXILE',
            text: '大门重重地打开，又重重地关上。\n\n你被扔进了雪地里。\n\n“滚！永远别再回来！”\n\n屋里的灯灭了。只剩下漫天的飞雪和彻骨的寒风。你的圆头撞在了冰冷的台阶上，有些晕眩。',
            choices: [{ label: '在这寒风中...睡一觉吧...', next: 'DEATH' }]
        },
        'DEATH': {
            id: 'DEATH',
            text: '好冷...\n\n饥饿像火一样烧着胃，身体却像冰一样凉。\n这就是结局吗？流落街头，冻死在无人知晓的冬夜...\n\n意识逐渐模糊。如果再来一次，我要活得像个传说...',
            choices: [{ label: '......', next: 'INTRO' }] 
        }
    };

    const handleChoice = (next: PrologueStepId) => {
        if (next === 'BATTLE_END') audioManager.playSfx('impact');
        else if (next === 'DEATH') audioManager.playSfx('heartbeat');
        else audioManager.playClick();

        if (stepId === 'DEATH') {
            onComplete();
        } else {
            setStepId(next);
        }
    };

    const currentStep = prologueContent[stepId];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                {Array.from({length: 20}).map((_,i) => (
                    <Snowflake key={i} size={Math.random() * 20 + 10} className="absolute animate-bounce" style={{top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDuration: `${Math.random()*5+5}s`}} />
                ))}
            </div>
            
            <div className="max-w-xl w-full z-10 animate-in">
                <div className="mb-4 text-stone-500 text-xs font-black uppercase tracking-widest border-b border-stone-800 pb-2">Prologue: Unrelenting Winter</div>
                <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight italic text-stone-200">
                    {stepId === 'INTRO' && '无法回头的凛冬'}
                    {stepId === 'CHOICE_SHELF' && '洁癖管家的怒火'}
                    {stepId === 'BATTLE_START' && '绝境抉择'}
                    {stepId === 'BATTLE_END' && '破碎的明朝'}
                    {stepId === 'EXILE' && '放逐'}
                    {stepId === 'DEATH' && '终焉与开始'}
                </h2>
                
                <div className="bg-stone-900 border-l-4 border-white p-6 mb-10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <p className="text-base md:text-xl leading-relaxed whitespace-pre-wrap font-serif text-stone-300">
                        {currentStep.text}
                    </p>
                </div>

                <div className="space-y-4">
                    {currentStep.choices?.map((choice, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => handleChoice(choice.next)}
                            className="w-full py-4 border-2 border-white bg-transparent hover:bg-white hover:text-black transition-all font-black text-lg uppercase tracking-widest flex items-center justify-between px-6 group"
                        >
                            <span>{choice.label}</span>
                            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
