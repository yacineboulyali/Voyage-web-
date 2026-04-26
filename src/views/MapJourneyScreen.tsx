/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Trophy, Navigation, Map as MapIcon, User, ChevronRight, Check, Settings } from 'lucide-react';
import { CITIES, type City } from '../types';
import { cn } from '../lib/utils';
import BottomNavBar from '../components/BottomNavBar';
import TopAppBar from '../components/TopAppBar';

interface MapJourneyScreenProps {
  stats: { xp: number; stars: number; level: number };
  onSelectCity: (city: City) => void;
}

export default function MapJourneyScreen({ stats, onSelectCity }: MapJourneyScreenProps) {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const handleCitySelect = (city: City) => {
    if (city.status === 'locked') return;
    setSelectedCityId(city.id);
    // Add a slight delay for the animation to play
    setTimeout(() => {
      onSelectCity(city);
    }, 600);
  };

  return (
    <div className="h-full w-full bg-morocco-cream flex flex-col">
      <TopAppBar stats={stats} />
      
      <main className="flex-grow overflow-y-auto relative pt-8 pb-32">
        <div className="absolute inset-0 zellige-pattern pointer-events-none" />
        
        {/* SVG Journey Path */}
        <div className="absolute inset-0 w-full h-[1200px] pointer-events-none opacity-20">
           <svg width="100%" height="100%" className="fill-none stroke-morocco-gold stroke-[4] stroke-dash-2">
              <path d="M 50% 1100 Q 70% 950 50% 800 T 50% 500 T 50% 200" />
           </svg>
        </div>

        <div className="relative z-10 flex flex-col-reverse items-center gap-48 max-w-md mx-auto py-20">
          {CITIES.map((city, index) => (
            <CityNode 
              key={city.id} 
              city={city} 
              onSelect={() => handleCitySelect(city)} 
              isSelected={selectedCityId === city.id}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Bottom Sheet Context for active city */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-[100px] left-4 right-4 z-40"
        >
          <div className="bg-white border border-morocco-gold/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block bg-morocco-gold/10 text-morocco-gold text-[10px] font-bold px-2.5 py-1 rounded mb-2 border border-morocco-gold/20 uppercase tracking-widest">
                  ÉTAPE 3 • فاس البالي
                </span>
                <h2 className="text-2xl font-headline font-extrabold text-morocco-emerald">La Médina de Fès</h2>
              </div>
              <div className="bg-morocco-gold/5 p-2 rounded-xl text-center min-w-[64px] border border-morocco-gold/10">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Points</p>
                <p className="text-morocco-gold font-black text-xl">450</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              Explorez le labyrinthe spirituel du Maroc. Maîtrisez le vocabulaire de l'artisanat traditionnel.
            </p>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCitySelect(CITIES[2])}
              className="w-full bg-morocco-gold text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg shadow-morocco-gold/20"
            >
              <span>CONTINUER LE VOYAGE</span>
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

const CityNode: React.FC<{ city: City; onSelect: () => void; delay: number; isSelected: boolean }> = ({ city, onSelect, delay, isSelected }) => {
  const isLocked = city.status === 'locked';
  const isCompleted = city.status === 'completed';
  const isActive = city.status === 'active';

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        scale: isSelected ? 1.15 : 1
      }}
      transition={{ 
        delay,
        scale: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="flex flex-col items-center relative group"
    >
      {(isActive || isSelected) && (
        <motion.div 
          animate={{ scale: isSelected ? [1, 1.4, 1.2] : [1, 1.2, 1] }} 
          transition={{ 
            duration: isSelected ? 0.4 : 2, 
            repeat: isSelected ? 3 : Infinity,
            repeatType: "reverse"
          }}
          className={cn(
            "absolute inset-0 w-32 h-32 -ml-4 -mt-4 rounded-full blur-xl",
            isSelected ? "bg-morocco-orange/30" : "bg-morocco-gold/20"
          )} 
        />
      )}
      
      <button
        disabled={isLocked}
        onClick={onSelect}
        className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center relative shadow-lg transition-all",
          isLocked && "bg-slate-200 grayscale opacity-40 border-4 border-slate-300",
          isCompleted && "bg-morocco-emerald border-4 border-white",
          isActive && "bg-white border-4 border-morocco-gold shadow-[0_0_20px_rgba(212,168,67,0.4)]",
          isSelected && "ring-8 ring-morocco-gold/30 border-morocco-orange shadow-[0_0_30px_rgba(193,68,14,0.5)]"
        )}
      >
        {isCompleted ? (
           <Check size={40} className="text-white font-bold" />
        ) : (
          <motion.div
            animate={(isActive || isSelected) ? {
              scale: [1, 1.15, 1],
            } : {}}
            transition={(isActive || isSelected) ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          >
            <MapPin size={40} className={cn(isSelected ? "text-morocco-orange" : (isActive ? "text-morocco-gold" : "text-slate-400"))} />
          </motion.div>
        )}

        {(isActive || isSelected) && (
          <div className={cn(
            "absolute -top-3 text-white px-2.5 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase shadow-md transition-colors",
            isSelected ? "bg-morocco-orange" : "bg-morocco-gold"
          )}>
            {isSelected ? "EXPLORATION..." : "ACTUEL"}
          </div>
        )}
      </button>
      
      <div className="mt-4 text-center">
        <p className={cn("font-bold text-sm", isLocked ? "text-slate-400" : "text-morocco-emerald")}>
          {city.name}
        </p>
        <p className={cn("arabic-font text-xs font-bold", isLocked ? "text-slate-300" : "text-morocco-gold")}>
          {city.arabicName}
        </p>
        {!isLocked && (
          <div className="mt-2 flex flex-col items-center gap-1">
             <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(isCompleted ? city.totalSteps : city.stepNum) / city.totalSteps * 100}%` }}
                  className={cn("h-full", isCompleted ? "bg-morocco-emerald" : "bg-morocco-gold")}
                />
             </div>
             <span className="text-[10px] font-black text-slate-400">
               {isCompleted ? city.totalSteps : city.stepNum}/{city.totalSteps}
             </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
