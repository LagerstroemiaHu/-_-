
import React from 'react';
import { Character } from '../../types';
import { audioManager } from '../../utils/audio';

interface Props {
    characters: Character[];
    onSelect: (char: Character) => void;
}

export const CharacterSelect: React.FC<Props> = ({ characters, onSelect }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-amber-50 animate-in">
            <h1 className="text-3xl md:text-5xl font-black mb-8 uppercase italic">谁在书写传奇?</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full">
                {characters.map(char => (
                    <button 
                        key={char.id} 
                        disabled={char.locked} 
                        onClick={() => { audioManager.playClick(); onSelect(char); }} 
                        className={`bg-white border-[6px] border-black p-6 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left active:translate-y-0.5 group ${char.locked ? 'opacity-40 grayscale' : ''}`}
                    >
                        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-black mb-4 group-hover:rotate-6 transition-transform">
                            <img src={char.avatar} className="w-full h-full object-cover" alt={char.name} />
                        </div>
                        <h3 className="text-2xl font-black">{char.name}</h3>
                        <p className="font-bold text-stone-500 mt-2 text-sm leading-snug">{char.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
