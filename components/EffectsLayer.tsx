
import React from 'react';
import { GameStats } from '../types';

interface ActiveEffect {
  type: string;
  color: 'red' | 'green' | 'amber' | 'purple' | 'blue' | 'indigo' | null;
  changes?: Partial<GameStats>;
}

interface Props {
  isLowHealth: boolean;
  isLowSatiety: boolean;
  isLowWildness: boolean;
  activeEffect: ActiveEffect | null;
}

const EffectsLayer: React.FC<Props> = ({ isLowHealth, isLowSatiety, isLowWildness, activeEffect }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      
      {/* 1. 低生命值警报：柔和的红色边缘呼吸晕影 */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${isLowHealth ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(circle, transparent 40%, rgba(220, 38, 38, 0.25) 100%)' }}
      />
      
      {/* 2. 低饱腹感：模拟虚弱的动态去色和模糊循环 */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ${isLowSatiety ? 'opacity-100 animate-blur-pulse' : 'opacity-0'}`} 
      />

      {/* 3. 低哈气值（温顺/被驯化）：粉紫色柔光滤镜，略带窒息感（Domestication Filter） */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none mix-blend-screen ${isLowWildness ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 20%, rgba(192, 132, 252, 0.15) 80%, rgba(255, 255, 255, 0.2) 100%)',
            backdropFilter: 'sepia(0.2) contrast(0.9)'
        }}
      />
      {/* 额外的边缘暗角增强“被圈养”的感觉 */}
      <div 
          className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${isLowWildness ? 'opacity-60' : 'opacity-0'}`}
          style={{ boxShadow: 'inset 0 0 80px rgba(168, 85, 247, 0.2)' }}
      />

      {/* 4. 动作反馈：内发光边框脉冲 */}
      <div 
        className={`absolute inset-0 transition-all duration-300 pointer-events-none
          ${activeEffect?.color === 'red' ? 'effect-red' : ''}
          ${activeEffect?.color === 'green' ? 'effect-green' : ''}
          ${activeEffect?.color === 'amber' ? 'effect-amber' : ''}
        `} 
      />
      
      {/* 5. 睡眠状态：暗化背景模拟休息 */}
      {activeEffect?.type === 'sleep' && (
         <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center">
            <div className="text-white/20 font-black text-9xl tracking-widest italic animate-pulse">ZZZ</div>
         </div>
      )}

    </div>
  );
};

export default EffectsLayer;
