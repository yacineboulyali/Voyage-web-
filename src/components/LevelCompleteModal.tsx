/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Award, Star, ArrowRight } from 'lucide-react';

interface LevelCompleteModalProps {
  onClaim: () => void;
}

export default function LevelCompleteModal({ onClaim }: LevelCompleteModalProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
      >
        {/* Ray effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-voyage-accent/20 via-transparent to-transparent opacity-50" />
        
        <div className="w-32 h-32 bg-voyage-accent/10 rounded-full flex items-center justify-center mb-8 relative">
           <motion.div
             animate={{ rotate: [0, 360] }}
             transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
             className="absolute inset-0 rounded-full border-2 border-voyage-accent/20 border-dashed"
           />
           <Award className="text-voyage-accent" size={64} fill="currentColor" fillOpacity={0.1} />
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.5 }}
             className="absolute -top-1 -right-1 w-10 h-10 bg-voyage-accent rounded-full flex items-center justify-center border-4 border-white shadow-lg"
           >
             <Star className="text-white" size={18} fill="currentColor" />
           </motion.div>
        </div>

        <div className="space-y-1 mb-8">
          <h3 className="text-3xl font-headline font-black text-slate-800 tracking-tight">C'est terminé !</h3>
          <p className="text-slate-500 font-medium">Félicitations, tu as débloqué un nouveau titre :</p>
        </div>

        <div className="bg-voyage-primary/5 px-8 py-4 rounded-xl border-2 border-voyage-primary/20 mb-8 w-full">
           <span className="text-voyage-primary font-headline font-extrabold text-xl tracking-[0.05em] uppercase">
             MAÎTRE LOGICIEL
           </span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClaim}
          className="w-full h-14 bg-voyage-primary text-white rounded-xl font-headline font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-colors hover:bg-voyage-primary-light"
        >
          <span>Récupérer ma récompense</span>
          <ArrowRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
}
