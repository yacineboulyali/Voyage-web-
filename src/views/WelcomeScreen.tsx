/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="h-full w-full flex flex-col bg-morocco-cream overflow-y-auto">
      {/* Hero section */}
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-orange-100 z-0" />
        <div className="absolute inset-0 zellige-pattern opacity-10" />
        
        <div className="absolute inset-0 flex items-end justify-center">
          <motion.img 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            alt="Family Ben Ali" 
            className="w-full h-full object-bottom object-contain relative z-10 p-4"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX02xVm_1ZbEHldthvtfyk9kUvrQ7kJWEKKk97q7NNECvo4OYKAHpwZ2l-DlvuMB3FN_ifc4BrXJpjFVuoX3al4uIU4qAx26Qsyzx-wSKFaDwbo2XTgkySsffXUeRQQIbSAil8_diMshNVvTaCw4gItFnxapZ4xcowAq8SU8Fp5YMMksFFp29ESMBlqlfKbogLdWLd88IPnc0V6iQkzUeh-7ef_HCrFnXWdqsW6qYsCj5mEL2xUcall-TiugdcLTONkicSEAyMtHU"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-morocco-cream rounded-t-[3rem] z-20" />
      </section>

      {/* Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-8 text-center space-y-8 py-6">
        <div className="space-y-4">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-morocco-emerald leading-tight"
          >
            Bienvenue dans le Voyage !
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="font-headline text-xl font-semibold text-morocco-emerald" 
            dir="rtl"
          >
            !أهلاً بك في رحلة المهارات
          </motion.p>
        </div>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ delay: 0.7 }}
          className="h-1 bg-morocco-gold rounded-full" 
        />

        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-slate-600 max-w-[280px] leading-relaxed font-medium"
        >
          Suis la famille Ben Ali à travers le Maroc et développe tes compétences professionnelles en t'amusant.
        </motion.p>
      </main>

      {/* Buttons */}
      <section className="px-8 pb-10 space-y-4 w-full max-w-md mx-auto mb-8 shrink-0">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="w-full h-14 bg-morocco-emerald text-white font-headline font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-3 transition-colors hover:bg-morocco-emerald/90"
        >
          <span>Commencer le voyage</span>
          <ArrowRight size={20} />
        </motion.button>
        
        <button className="w-full h-14 border-2 border-morocco-emerald text-morocco-emerald font-headline font-bold text-base rounded-xl bg-transparent active:bg-morocco-emerald/5 transition-colors">
          J'ai déjà un compte
        </button>
      </section>

      <footer className="w-full pb-8 flex flex-col items-center gap-2 opacity-30 text-[10px] uppercase tracking-widest font-bold">
        <div className="flex gap-4 mb-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-morocco-emerald rounded-full" />
          ))}
        </div>
        <span>© 2026 Le Voyage des Compétences</span>
      </footer>
    </div>
  );
}
