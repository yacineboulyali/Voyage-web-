/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Lightbulb, TrendingUp, CheckCircle2, Circle, PartyPopper } from 'lucide-react';
import { type City, type Challenge } from '../types';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';

interface ChallengeScreenProps {
  city: City;
  onComplete: () => void;
  onBack: () => void;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    type: 'glitch',
    title: 'Identifier le bug',
    question: 'Appuyez sur l\'élément incorrect pour révéler l\'erreur de logique.',
    content: ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'the', 'lazy', 'dog.'],
    hint: 'La duplication logique se produit souvent dans le nommage rapide des variables ou la concaténation de chaînes répétitives.',
  },
  {
    id: 'c2',
    type: 'decision',
    title: 'Décision d\'équipe',
    question: 'Un coéquipier semble en difficulté avec une tâche. La date limite approche. Que fais-tu ?',
    options: [
      { id: 'a', text: 'Proposer mon aide immédiatement', label: 'A' },
      { id: 'b', text: 'Ignorer et finir mon propre travail', label: 'B' },
      { id: 'c', text: 'En parler au mentor discrètement', label: 'C' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'c3',
    type: 'fill-in-blanks',
    title: 'Le Secret du Riad',
    question: 'Complète le récit en trouvant le mot manquant.',
    arabicQuestion: 'في قلب المدينة، وجدنا رياضاً مخفياً تحت الياسمين.',
    content: ['Au cœur de la', '...', 'nous avons découvert un riad caché.'],
    options: [
      { id: '1', text: 'Montagne' },
      { id: '2', text: 'Médina' },
      { id: '3', text: 'Rivière' },
      { id: '4', text: 'Vallée' },
    ],
    correctOptionId: '2',
  }
];

export default function ChallengeScreen({ city, onComplete, onBack }: ChallengeScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const challenge = CHALLENGES[currentIdx];

  const handleNext = () => {
    if (currentIdx < CHALLENGES.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowFeedback(false);
      setSelectedWordIdx(null);
      setSelectedOptionId(null);
    } else {
      onComplete();
    }
  };

  const isCorrect = () => {
    if (challenge.type === 'glitch') return selectedWordIdx === 7;
    return selectedOptionId === challenge.correctOptionId;
  };

  return (
    <div className="h-full w-full bg-morocco-cream flex flex-col relative overflow-hidden">
      <TopAppBar stats={{xp: 1450, stars: 120, level: 4}} onBack={onBack} title="Défi de Logique" />
      
      <main className="flex-grow pt-8 pb-32 px-6 max-w-2xl mx-auto w-full relative z-10 overflow-y-auto">
        <div className="absolute inset-0 zellige-pattern pointer-events-none opacity-5" />

        <AnimatePresence>
          {showFeedback && isCorrect() && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, rotate: -1 }}
              className="mb-8 relative z-20"
            >
              <div className="bg-morocco-gold/20 text-stone-900 p-6 rounded-2xl shadow-lg border-b-4 border-morocco-gold/30 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center shrink-0">
                  <Search className="text-morocco-orange" size={28} />
                </div>
                <div>
                  <p className="font-headline font-extrabold text-lg leading-tight tracking-tight">C'est juste ! Bien vu ! 🔍</p>
                  <p className="text-sm opacity-80 font-medium">Tes compétences d'observation s'améliorent.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-10 text-center space-y-2">
          <h2 className="text-2xl font-headline font-black text-morocco-emerald tracking-tight">{challenge.title}</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto leading-tight">{challenge.question}</p>
        </div>

        <motion.div 
          layout
          className="bg-white/95 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white relative overflow-hidden"
        >
          {challenge.type === 'glitch' && (
            <div className="flex flex-wrap gap-2 justify-center items-center py-4">
              {challenge.content?.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedWordIdx(idx);
                    if (idx === 7) setShowFeedback(true);
                  }}
                  className={cn(
                    "font-mono text-2xl md:text-3xl px-2 py-1 rounded-xl transition-all duration-200",
                    selectedWordIdx === idx && idx !== 7 && "bg-slate-100 text-slate-400",
                    idx === 7 && selectedWordIdx === 7 && "bg-morocco-orange/20 text-morocco-orange font-bold scale-110 shadow-lg ring-2 ring-morocco-orange/20",
                    selectedWordIdx === null && "hover:bg-slate-50"
                  )}
                >
                  {word}
                </button>
              ))}
            </div>
          )}

          {(challenge.type === 'decision' || challenge.type === 'fill-in-blanks') && (
             <div className="space-y-6">
                {challenge.type === 'fill-in-blanks' && (
                  <div className="space-y-4 mb-8">
                     <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed text-center">
                        {challenge.content?.[0]} 
                        <span className={cn(
                          "inline-block min-w-[120px] h-10 border-b-4 border-slate-200 align-middle mx-2 rounded-t-lg transition-all px-4 text-morocco-blue font-bold text-center",
                          showFeedback && isCorrect() && "border-morocco-blue bg-blue-50"
                        )}>
                          {showFeedback && isCorrect() ? challenge.options?.find(o => o.id === selectedOptionId)?.text : ''}
                        </span>
                        {challenge.content?.[2]}
                     </p>
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center" dir="rtl">
                        <p className="text-2xl text-morocco-emerald font-arabic font-bold">{challenge.arabicQuestion}</p>
                     </div>
                  </div>
                )}

               <div className={cn("grid gap-4", challenge.type === 'fill-in-blanks' ? "grid-cols-2" : "grid-cols-1")}>
                 {challenge.options?.map((opt) => (
                   <button
                     key={opt.id}
                     onClick={() => {
                       setSelectedOptionId(opt.id);
                       if (opt.id === challenge.correctOptionId) setShowFeedback(true);
                     }}
                     className={cn(
                       "flex items-center gap-4 p-5 text-left rounded-2xl border-2 transition-all duration-200",
                       selectedOptionId === opt.id 
                         ? (opt.id === challenge.correctOptionId ? "bg-emerald-50 border-morocco-emerald shadow-md ring-4 ring-emerald-50" : "bg-red-50 border-red-200")
                         : "bg-slate-50 border-transparent hover:border-slate-200"
                     )}
                   >
                     {opt.label && (
                       <div className={cn(
                         "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                         selectedOptionId === opt.id ? "bg-morocco-emerald text-white" : "bg-white text-slate-400"
                       )}>
                         {opt.label}
                       </div>
                     )}
                     <span className={cn(
                       "font-bold",
                       selectedOptionId === opt.id ? "text-slate-800" : "text-slate-600"
                     )}>{opt.text}</span>
                   </button>
                 ))}
               </div>
             </div>
          )}

          {!showFeedback && challenge.hint && (
            <div className="mt-8 pt-6 border-t border-dashed border-slate-100 flex items-start gap-4 opacity-40">
              <Lightbulb className="text-morocco-gold shrink-0" size={18} />
              <p className="text-xs italic text-slate-600 leading-relaxed font-medium">{challenge.hint}</p>
            </div>
          )}
          
          {showFeedback && isCorrect() && (
            <motion.div 
               initial={{ y: 10, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }}
               className="mt-8 pt-6 border-t border-slate-100 space-y-4"
            >
               <div className="flex items-center gap-2 text-emerald-600 font-bold">
                 <CheckCircle2 size={24} fill="currentColor" fillOpacity={0.1} />
                 <span className="font-headline tracking-tight text-lg">Excellent choix !</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">L'entraide est la clé du succès collectif. ❤️ Ton score social a augmenté.</p>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 px-4 py-2 rounded-full inline-flex items-center gap-2">
                    <PartyPopper size={14} className="text-morocco-emerald" />
                    <span className="text-morocco-emerald font-black text-[10px] uppercase tracking-widest">+10 Points Sociaux</span>
                  </div>
                </div>
            </motion.div>
          )}
        </motion.div>

        <div className="mt-12 flex items-center justify-center gap-3">
          {CHALLENGES.map((_, i) => (
             <Circle 
               key={i} 
               size={12} 
               className={cn("transition-all", i <= currentIdx ? "text-morocco-emerald fill-current" : "text-slate-200")} 
             />
          ))}
          <span className="ml-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Challenge {currentIdx + 1}/{CHALLENGES.length}
          </span>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-6 flex justify-center">
        <motion.button
          disabled={!showFeedback}
          whileHover={showFeedback ? { scale: 1.02 } : {}}
          whileTap={showFeedback ? { scale: 0.98 } : {}}
          onClick={handleNext}
          className={cn(
            "w-full max-w-md h-16 rounded-2xl font-headline font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl",
            showFeedback 
              ? "bg-morocco-blue text-white" 
              : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
          )}
        >
          <span className="tracking-tight uppercase">
            {currentIdx === CHALLENGES.length - 1 ? "VOIR LE RÉSULTAT" : "CONTINUER LA QUÊTE"}
          </span>
          <TrendingUp size={20} />
        </motion.button>
      </footer>
    </div>
  );
}
