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
            text: '凛冬。红木门虚掩着。\n\n屋内透出暖气和金枪鱼罐头的香味。\n那是你曾经的家。',
            choices: [{ label: '跳上桌子开吃', next: 'CHOICE_SHELF' }]
        },
        'CHOICE_SHELF': {
            id: 'CHOICE_SHELF',
            text: '你刚伸出舌头，那个戴白手套的洁癖管家就尖叫着冲了过来。\n\n门“砰”地一声关上了。\n前有鸡毛掸子，后无退路。',
            choices: [{ label: '跳上博古架！', next: 'BATTLE_START' }]
        },
        'BATTLE_START': {
            id: 'BATTLE_START',
            text: '你跃上摇摇欲坠的架子。\n\n那是主人的明朝花瓶。\n管家的脸因恐惧而扭曲：“别动！”\n\n你笑了。',
            choices: [{ label: '大闹天宫', next: 'BATTLE_END' }]
        },
        'BATTLE_END': {
            id: 'BATTLE_END',
            text: '【噼里啪啦】\n\n价值连城的碎片铺满地板。\n你在废墟中穿梭，直到被一只大手死死抓住了后颈皮。',
            choices: [{ label: '放开我！', next: 'EXILE' }]
        },
        'EXILE': {
            id: 'EXILE',
            text: '大门重重关上。\n\n你被扔进雪地。\n“滚！”\n\n灯灭了。只剩彻骨的寒风。',
            choices: [{ label: '睡吧...', next: 'DEATH' }]
        },
        'DEATH': {
            id: 'DEATH',
            text: '冷。饿。\n\n意识模糊。\n\n如果再来一次，我要活成传说...',
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
                    {stepId === 'INTRO' && '无法回头'}
                    {stepId === 'CHOICE_SHELF' && '洁癖管家'}
                    {stepId === 'BATTLE_START' && '绝境'}
                    {stepId === 'BATTLE_END' && '破碎'}
                    {stepId === 'EXILE' && '放逐'}
                    {stepId === 'DEATH' && '终焉'}
                </h2>
                
                <div className="bg-stone-900 border-l-4 border-white p-6 mb-10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <p className="text-xl md:text-3xl leading-relaxed whitespace-pre-wrap font-serif text-stone-300 font-bold">
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