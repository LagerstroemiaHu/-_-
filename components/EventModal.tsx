
import React from 'react';
import { GameEvent, Choice, GameStats, StatType } from '../types';
import { X, ArrowRight, Skull, CheckCircle2, Heart, Fish, Zap, Brain, AlertTriangle, Compass } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface Props {
  event: GameEvent;
  stats: GameStats;
  onChoice: (choice: Choice) => void;
  result: { message: string, success: boolean, changes?: Partial<GameStats> } | null;
  onContinue: () => void;
  onClose: () => void;
}

const StatBadge = ({ stat, value }: { stat: string, value: number }) => {
    if (value === 0) return null;
    const isPos = value > 0;
    const colors: Record<string, string> = {
        health: 'bg-rose-100 text-rose-700 border-rose-300',
        satiety: 'bg-amber-100 text-amber-700 border-amber-300',
        hissing: 'bg-purple-100 text-purple-700 border-purple-300',
        smarts: 'bg-blue-100 text-blue-700 border-blue-300',
    };
    const labels: Record<string, string> = {
        health: '健康', satiety: '饱腹', hissing: '哈气', smarts: '智力'
    };
    const Icon = { health: Heart, satiety: Fish, hissing: Zap, smarts: Brain }[stat as StatType] || AlertTriangle;

    return (
        <div className={`flex items-center gap-1 px-2 py-1 rounded border-2 font-black text-xs ${colors[stat] || 'bg-stone-100 border-stone-300 text-stone-600'}`}>
            <Icon size={12} />
            <span>{labels[stat] || stat} {isPos ? '+' : ''}{value}</span>
        </div>
    );
}

const EventModal: React.FC<Props> = ({ event, stats, onChoice, result, onContinue, onClose }) => {
  const isAutoEvent = event.type === 'AUTO';
  const isSideQuest = event.type === 'SIDE_QUEST';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm transition-all duration-300"
      onClick={result ? onContinue : undefined} 
    >
      <div 
        className="bg-white w-full max-w-md overflow-hidden animate-[scale-in_0.3s_ease-out] flex flex-col max-h-[90vh] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative"
        onClick={(e) => e.stopPropagation()} 
      >
        {!result && !isAutoEvent && (
            <button 
                onClick={onClose}
                onMouseEnter={() => audioManager.playHover()}
                className="absolute top-3 right-3 z-20 p-1.5 bg-white border-2 border-black hover:bg-stone-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1"
            >
                <X size={18} strokeWidth={3} />
            </button>
        )}

        {event.image && (
          <div className="w-full h-32 sm:h-44 shrink-0 relative bg-stone-900 border-b-4 border-black">
             <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
             <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 border-2 border-white mb-1 inline-flex items-center gap-1 transform -skew-x-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] 
                    ${isSideQuest ? 'bg-amber-500 text-black border-black' : isAutoEvent ? 'bg-rose-600' : 'bg-black'}
                `}>
                   {event.type === 'AUTO' && <AlertTriangle size={10} strokeWidth={3} />}
                   {isSideQuest && <Compass size={10} strokeWidth={3} />}
                   {isSideQuest ? '奇遇' : event.type === 'RANDOM' ? '突发' : event.type === 'STAGE' ? '命运' : event.type === 'AUTO' ? '强制' : '日常'}
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white leading-none">{event.title}</h2>
             </div>
          </div>
        )}

        <div className="p-4 overflow-y-auto no-scrollbar bg-white flex-1">
          {result ? (
            <div className="text-center py-2">
               <div className={`mx-auto w-16 h-16 flex items-center justify-center mb-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-3 ${result.success ? 'bg-emerald-400 text-black' : 'bg-rose-500 text-white'}`}>
                 {result.success ? <CheckCircle2 size={32} strokeWidth={3} /> : <Skull size={32} strokeWidth={3} />}
               </div>
               
               <div className="text-left bg-stone-50 border-l-4 border-black p-4 mb-4">
                  <p className="text-base font-bold text-stone-900 leading-relaxed mb-3">{result.message}</p>
                  
                  {result.changes && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200">
                          {Object.entries(result.changes).map(([stat, val]) => (
                              <StatBadge key={stat} stat={stat} value={val as number} />
                          ))}
                      </div>
                  )}
               </div>

               <button onClick={onContinue} onMouseEnter={() => audioManager.playHover()} className="w-full py-3 bg-stone-900 text-white font-black text-lg border-2 border-transparent hover:bg-stone-800 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1">继续冒险 <ArrowRight size={18} strokeWidth={3} /></button>
            </div>
          ) : (
            <>
              <p className={`text-stone-800 mb-6 text-sm sm:text-base font-bold border-l-4 pl-3 py-3 pr-2 shadow-sm leading-relaxed ${isSideQuest ? 'border-amber-500 bg-amber-50' : event.type === 'AUTO' ? 'border-rose-500 bg-rose-50' : 'border-amber-400 bg-amber-50'}`}>
                {event.description}
              </p>
              <div className="space-y-3">
                {event.choices.map((choice) => {
                  const available = choice.condition ? choice.condition(stats) : true;
                  const chance = choice.calculateChance ? Math.floor(choice.calculateChance(stats)) : null;
                  return (
                    <button key={choice.id} disabled={!available} onClick={() => onChoice(choice)} onMouseEnter={() => available && audioManager.playHover()} className={`w-full p-3 text-left border-4 transition-all group relative poly-button flex flex-col gap-0.5 ${available ? 'border-black bg-white text-black hover:bg-amber-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-stone-300 bg-stone-100 text-stone-400 cursor-not-allowed grayscale'}`}>
                      <div className="flex justify-between items-center relative z-10 w-full">
                        <span className="font-black text-sm sm:text-base">{choice.text}</span>
                        {chance !== null && available && <span className="text-[10px] font-black px-1.5 py-0.5 border-2 border-black bg-emerald-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">{chance}%</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
