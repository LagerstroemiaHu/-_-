import React, { useEffect, useState, useRef } from 'react';
import { GameStats } from '../types';
import { Heart, Fish, Zap, Brain } from 'lucide-react';

interface Props {
  stats: GameStats;
  className?: string;
}

const StatBar = ({
  icon: Icon,
  value,
  color,
  label,
  statKey
}: {
  icon: any,
  value: number,
  color: string,
  label: string,
  statKey: keyof GameStats
}) => {
    const [particles, setParticles] = useState<any[]>([]);
    const prevValue = useRef(value);

    useEffect(() => {
        const diff = value - prevValue.current;
        if (diff !== 0) {
            // Adaptive density: Higher multiplier and higher cap for large changes
            // e.g., +20 stat change -> ~100 particles, capped at 60 for performance
            const count = Math.min(Math.floor(Math.abs(diff) * 5), 60); 
            
            const newParticles = [];
            const isGain = diff > 0;

            for (let i = 0; i < count; i++) {
                const id = Math.random();
                const size = 3 + Math.random() * 4; // Random size variation 3-7px
                
                let tx, ty;
                
                if (isGain) {
                    // Gather: From all directions (360 degrees) towards center
                    // "Surrounding" effect rather than just sides
                    const angle = Math.random() * Math.PI * 2;
                    const dist = 50 + Math.random() * 70; // 50px to 120px radius
                    tx = Math.cos(angle) * dist;
                    ty = Math.sin(angle) * dist;
                } else {
                    // Explode: Radial burst outward
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 40 + Math.random() * 70;
                    tx = Math.cos(angle) * distance;
                    ty = Math.sin(angle) * distance;
                }

                // Rotation variables with Stat-based variance
                let rotRange = 180 + Math.random() * 360;
                
                if (statKey === 'hissing') {
                    // Hissing particles spin more violently/erratically
                    rotRange *= 2.5;
                } else if (statKey === 'smarts') {
                    // Smarts might be more consistent
                    rotRange = 360; 
                }

                const intensityMult = 1 + Math.min(Math.abs(diff) / 20, 0.5);
                rotRange *= intensityMult;

                const rotStart = Math.random() * 360;
                const rotEnd = rotStart + (Math.random() > 0.5 ? 1 : -1) * rotRange;

                // CSS variables for animation
                const style = {
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    '--rot-start': `${rotStart}deg`,
                    '--rot-end': `${rotEnd}deg`,
                    left: '50%',
                    top: '50%',
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${Math.random() * 0.2}s` // Slightly wider delay window for density
                } as React.CSSProperties;

                newParticles.push({ id, style, type: isGain ? 'gather' : 'explode' });
            }
            
            setParticles(prev => [...prev, ...newParticles]);
            
            // Clean up after animation finishes
            setTimeout(() => {
                setParticles(prev => prev.filter(p => !newParticles.includes(p)));
            }, 1600); // 1.5s animation + buffer
        }
        prevValue.current = value;
    }, [value, statKey]);

    return (
        <div className="flex flex-col flex-1 h-full justify-center px-1 md:px-2 border-r-[3px] md:border-r-[4px] border-black last:border-r-0 bg-white relative">
            {/* Header */}
            <div className="flex justify-between items-end mb-1 z-10 relative">
                <div className="flex items-center gap-1">
                    <Icon size={14} className="text-black shrink-0" strokeWidth={3} />
                    <span className="text-[10px] md:text-xs font-black uppercase leading-none tracking-tighter truncate">{label}</span>
                </div>
                <span className="text-sm md:text-xl font-black font-mono leading-none">{Math.round(value)}</span>
            </div>

            {/* Bar Container */}
            <div className="w-full h-2 md:h-3 border-[3px] border-black bg-stone-200 relative shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group">
                 {/* Fill */}
                <div
                    className={`h-full transition-all duration-500 ease-out ${color} ${value < 30 ? 'animate-pulse' : ''} relative`}
                    style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                >
                    {/* The particles will use the color of this element via the class */}
                </div>
                
                 {/* Particle System Layer */}
                 <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center z-50">
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className={`stat-particle ${color} ${p.type === 'gather' ? 'animate-particle-gather' : 'animate-particle-explode'} border border-black`}
                            style={p.style}
                        />
                    ))}
                 </div>
            </div>
        </div>
    );
};

const StatsDisplay: React.FC<Props> = ({ stats, className = '' }) => {
  return (
    <div className={`flex h-full w-full ${className}`}>
        <StatBar icon={Heart} value={stats.health} color="bg-rose-500" label="健康" statKey="health" />
        <StatBar icon={Fish} value={stats.satiety} color="bg-amber-500" label="饱腹" statKey="satiety" />
        <StatBar icon={Zap} value={stats.hissing} color="bg-purple-600" label="哈气" statKey="hissing" />
        <StatBar icon={Brain} value={stats.smarts} color="bg-blue-500" label="智力" statKey="smarts" />
    </div>
  );
};

export default StatsDisplay;