/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Trophy, Navigation, Map as MapIcon, User, ChevronRight, Check, Settings, Loader2 } from 'lucide-react';
import { type City } from '../types';
import { cn } from '../lib/utils';
import BottomNavBar from '../components/BottomNavBar';
import TopAppBar from '../components/TopAppBar';
import { useSupabaseCities } from '../hooks/useSupabase';

interface MapJourneyScreenProps {
  stats: { xp: number; stars: number; level: number };
  onSelectCity: (city: City) => void;
}

export default function MapJourneyScreen({ stats, onSelectCity }: MapJourneyScreenProps) {
  const { cities, loading } = useSupabaseCities();
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const handleCitySelect = (city: City) => {
    if (city.status === 'locked') return;
    setSelectedCityId(city.id);
    // Add a slight delay for the animation to play
    setTimeout(() => {
      onSelectCity(city);
    }, 600);
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-morocco-cream flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-morocco-emerald" size={48} />
        <p className="mt-4 font-headline font-bold text-morocco-emerald">Chargement de la carte...</p>
      </div>
    );
  }

  const activeCity = cities.find(c => c.status === 'active') || cities[0];
  const displayCity = selectedCityId ? cities.find(c => c.id === selectedCityId) || activeCity : activeCity;

  return (
    <div className="h-full w-full bg-morocco-cream flex flex-col">
      <TopAppBar stats={stats} />
      
      <main className="flex-grow overflow-y-auto relative pt-8 pb-32">
        <div className="absolute inset-0 zellige-pattern pointer-events-none" />
        
        {/* SVG Journey Path */}
        <div className="absolute inset-0 w-full h-[2000px] pointer-events-none opacity-40">
           <svg width="100%" height="100%" className="fill-none stroke-morocco-gold/40 stroke-[4]">
              <path 
                d="M 50% 1800 C 60% 1600 40% 1400 50% 1200 S 60% 800 50% 600 S 40% 200 50% 50" 
                className="path-dashed"
              />
           </svg>
        </div>

        <div className="relative z-10 flex flex-col-reverse items-center gap-48 max-w-md mx-auto py-20">
          {cities.map((city, index) => (
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
          key={displayCity.id}
          className="fixed bottom-[100px] left-4 right-4 z-40"
        >
          <div className="bg-white border border-morocco-gold/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block bg-morocco-gold/10 text-morocco-gold text-[10px] font-bold px-2.5 py-1 rounded mb-2 border border-morocco-gold/20 uppercase tracking-widest">
                  ÉTAPE {displayCity.stepNum} • {displayCity.arabicName}
                </span>
                <h2 className="text-2xl font-headline font-extrabold text-morocco-emerald">{displayCity.name}</h2>
              </div>
              <div className="bg-morocco-gold/5 p-2 rounded-xl text-center min-w-[64px] border border-morocco-gold/10">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Points</p>
                <p className="text-morocco-gold font-black text-xl">{displayCity.points}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
              {displayCity.description} {displayCity.focus && `Focus : ${displayCity.focus}.`}
            </p>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCitySelect(displayCity)}
              className="w-full bg-morocco-gold text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg shadow-morocco-gold/20"
            >
              <span>{displayCity.status === 'completed' ? 'REVOIR LES DÉFIS' : 'CONTINUER LE VOYAGE'}</span>
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
            animate={isSelected ? {
              scale: [1, 1.15, 1],
            } : (isActive ? {
              scale: [1, 1.1, 1],
            } : {
              scale: 1
            })}
            transition={{
              duration: isSelected ? 1.2 : 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {city.iconUrl ? (
              <img 
                src={city.iconUrl} 
                alt={city.name} 
                className={cn(
                  "w-12 h-12 object-contain transition-all",
                  isSelected ? "scale-125" : "scale-100",
                  !isActive && !isSelected && "grayscale opacity-60"
                )} 
              />
            ) : (
              <MapPin size={40} className={cn(isSelected ? "text-morocco-orange" : (isActive ? "text-morocco-gold" : "text-slate-400"))} />
            )}
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

        <div className={cn(
          "absolute -bottom-4 bg-white px-3 py-1 rounded-full shadow-lg border-2 flex items-center justify-center min-w-[48px] z-20 transition-all",
          isLocked ? "border-slate-200 text-slate-400" : (isCompleted ? "border-morocco-emerald text-morocco-emerald" : "border-morocco-gold text-morocco-gold")
        )}>
          <span className="text-[12px] font-black tracking-tighter">
            {isCompleted ? city.totalSteps : (isLocked ? 0 : city.stepNum)}/{city.totalSteps}
          </span>
        </div>
      </button>
      
      <div className="mt-4 text-center">
        <p className={cn("font-bold text-sm", isLocked ? "text-slate-400" : "text-morocco-emerald")}>
          {city.name}
        </p>
        <p className={cn("arabic-font text-xs font-bold", isLocked ? "text-slate-300" : "text-morocco-gold")}>
          {city.arabicName}
        </p>
        {!isLocked && (
          <div className="mt-2 w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 mx-auto">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(isCompleted ? city.totalSteps : city.stepNum) / city.totalSteps * 100}%` }}
              className={cn("h-full", isCompleted ? "bg-morocco-emerald" : "bg-morocco-gold")}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
