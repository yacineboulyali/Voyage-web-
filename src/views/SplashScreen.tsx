/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Map, Star } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden zellige-pattern bg-morocco-cream">
      {/* Top Decorative Band */}
      <div className="absolute top-0 left-0 w-full h-4 bg-morocco-emerald/10" />
      
      <div className="z-10 flex flex-col items-center text-center px-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-32 h-32 md:w-40 md:h-40 mb-10 flex items-center justify-center"
        >
          {/* Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-morocco-gold/30 border-dashed"
          />
          
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-xl flex items-center justify-center relative overflow-hidden">
            <Map className="absolute inset-0 m-auto text-9xl text-morocco-gold/10" size={120} />
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative z-10 flex flex-col items-center"
            >
              <Map className="text-morocco-emerald" size={64} fill="currentColor" fillOpacity={0.2} />
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-morocco-gold flex items-center justify-center shadow-sm"
          >
            <Star className="text-white" size={16} fill="currentColor" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="font-headline font-extrabold text-3xl md:text-5xl text-morocco-emerald tracking-tight">
            Le Voyage des Compétences
          </h1>
          <p className="text-3xl md:text-5xl font-arabic text-morocco-emerald" dir="rtl">
            رحلة المهارات
          </p>
          <div className="w-12 h-1 bg-morocco-gold mx-auto rounded-full opacity-60" />
          <p className="text-sm md:text-base italic text-morocco-emerald/70 font-light tracking-wide max-w-xs mx-auto">
            Développe tes compétences à travers le Maroc
          </p>
        </motion.div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-3">
        <div className="w-full h-1 bg-morocco-gold/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/3 h-full bg-gradient-to-r from-morocco-gold to-morocco-gold/50" 
          />
        </div>
        <span className="text-[10px] font-headline uppercase tracking-widest text-morocco-emerald/40">
          Initialisation du voyage...
        </span>
      </div>
    </div>
  );
}
