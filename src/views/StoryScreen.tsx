/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { X, MoreVertical, MapPin, ArrowRight, User, BookOpen } from 'lucide-react';
import { type City, type Mission } from '../types';

interface StoryScreenProps {
  city: City;
  mission?: Mission;
  onClose: () => void;
  onStartChallenge: () => void;
}

export default function StoryScreen({ city, onClose, onStartChallenge }: StoryScreenProps) {
  return (
    <div className="h-full w-full relative overflow-hidden bg-slate-900">
      {/* Hero Background Illustration */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={city.image} 
          alt={city.name} 
          className="w-full h-full object-cover opacity-80" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        <div className="absolute inset-0 zellige-pattern opacity-10" />
      </motion.div>

      {/* Header Overlay */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-transparent text-white">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>

        <div className="flex-1 px-8">
          <div className="h-2.5 w-full bg-white/20 backdrop-blur-md rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '25%' }}
              className="h-full bg-gradient-to-r from-morocco-gold to-yellow-400 rounded-full shadow-lg" 
            />
          </div>
          <div className="mt-2 text-center text-[10px] font-headline font-bold tracking-[0.2em] text-white uppercase opacity-80">
            {mission?.title_fr || `DÉFI 1 — ${city.name}`}
          </div>
        </div>

        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical size={24} />
        </button>
      </header>

      {/* Narrative Panel */}
      <main className="relative z-10 h-full flex flex-col justify-end">
        <motion.section 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="bg-white/90 backdrop-blur-2xl rounded-t-[2.5rem] p-8 pb-12 shadow-2xl border-t border-white/20"
        >
          <div className="max-w-md mx-auto space-y-6">
            {/* City Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-morocco-emerald/5 rounded-full border border-morocco-emerald/10">
                <MapPin className="text-morocco-gold" size={18} fill="currentColor" fillOpacity={0.2} />
                <span className="font-headline font-bold text-morocco-emerald tracking-tight">
                  {city.name} | {city.arabicName}
                </span>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-3">
              <h1 className="font-headline font-extrabold text-2xl text-morocco-emerald leading-tight">
                {mission?.title_fr || city.name}
              </h1>
              <div className="space-y-3 px-2">
                <p className="text-slate-600 font-medium leading-relaxed">
                  {mission?.description_fr || city.description}
                </p>
                {mission?.description_ar && (
                  <p className="text-morocco-gold font-arabic text-sm leading-relaxed" dir="rtl">
                    {mission.description_ar}
                  </p>
                )}
              </div>

              {/* Dialogue Box */}
              {(mission?.script_opening || mission?.mentor_name) && (
                <div className="bg-morocco-emerald/5 rounded-2xl p-4 border-l-4 border-morocco-emerald mt-2 text-left">
                  <p className="text-sm italic text-slate-600">
                    <span className="font-bold text-morocco-emerald text-xs uppercase block mb-1">
                      {mission.mentor_name || "Mentor"} :
                    </span> 
                    "{mission.script_opening || "Prêt pour l'aventure ?"}"
                  </p>
                </div>
              )}
            </div>

            {/* CTA Action */}
            <div className="pt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartChallenge}
                className="w-full bg-morocco-emerald text-white font-headline font-bold py-5 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-colors hover:bg-morocco-emerald/90"
              >
                <span>DÉCOUVRIR LE DÉFI</span>
                <ArrowRight size={20} />
              </motion.button>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                         <User size={16} className="text-slate-400" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-morocco-gold flex items-center justify-center text-[10px] font-bold text-white">
                      +12
                    </div>
                  </div>
                  <span className="text-slate-400 text-xs font-semibold tracking-wide">
                    12 autres voyageurs relèvent le défi
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                   <BookOpen size={12} fill="currentColor" fillOpacity={0.2} />
                   FOCUS : {city.focus}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
