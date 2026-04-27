/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Lightbulb, TrendingUp, CheckCircle2, Circle, PartyPopper, Loader2, X } from 'lucide-react';
import { type City, type Challenge } from '../types';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { useSupabaseMissions, useSupabaseQuestions } from '../hooks/useSupabase';

interface ChallengeScreenProps {
  city: City;
  onComplete: () => void;
  onBack: () => void;
}

export default function ChallengeScreen({ city, onComplete, onBack }: ChallengeScreenProps) {
  const { missions, loading: loadingMissions } = useSupabaseMissions(city.id);
  const [missionId, setMissionId] = useState<string | null>(null);
  const { questions: supabaseChallenges, loading: loadingQuestions } = useSupabaseQuestions(missionId || '');
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedRankIds, setSelectedRankIds] = useState<string[]>([]);
  const [matchingSelections, setMatchingSelections] = useState<{ [key: string]: string }>({});
  const [activeMatchSource, setActiveMatchSource] = useState<string | null>(null);
  const [blanksValues, setBlanksValues] = useState<{ [key: string]: string }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (missions.length > 0 && !missionId) {
      setMissionId(missions[0].id);
    }
  }, [missions]);

  const challenges = supabaseChallenges.length > 0 ? supabaseChallenges : [];
  const challenge = challenges[currentIdx];

  const handleNext = () => {
    if (currentIdx < challenges.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowFeedback(false);
      setSelectedWordIdx(null);
      setSelectedOptionId(null);
      setSelectedRankIds([]);
      setMatchingSelections({});
      setActiveMatchSource(null);
      setBlanksValues({});
      setShowHint(false);
    } else {
      onComplete();
    }
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setSelectedWordIdx(null);
    setSelectedRankIds([]);
    setMatchingSelections({});
    setActiveMatchSource(null);
    setBlanksValues({});
    setShowFeedback(false);
    setShowHint(false);
  };

  const handleConfirm = () => {
    if (selectedOptionId || selectedWordIdx !== null || selectedRankIds.length > 0 || Object.keys(matchingSelections).length > 0 || Object.keys(blanksValues).length > 0) {
      setShowFeedback(true);
    }
  };

  const isCorrect = () => {
    if (!challenge) return false;
    if (challenge.type === 'glitch') return selectedWordIdx === 7;
    if (challenge.type === 'ranking') {
      return selectedRankIds.join(',') === challenge.correctOptionId;
    }
    if (challenge.type === 'fill-in-blanks') {
      const sortedBlanks = Object.keys(blanksValues).sort().map(k => blanksValues[k]);
      return sortedBlanks.join('|') === challenge.correctOptionId;
    }
    if (challenge.type === 'matching') {
      return challenge.options?.every((opt, idx) => matchingSelections[String(idx)] === opt.match);
    }
    return selectedOptionId === challenge.correctOptionId;
  };

  if (loadingMissions || loadingQuestions) {
    return (
      <div className="h-full w-full bg-morocco-cream flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-morocco-emerald" size={48} />
        <p className="mt-4 font-headline font-bold text-morocco-emerald">Chargement du défi...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="h-full w-full bg-morocco-cream flex flex-col items-center justify-center p-8 text-center">
        <p className="font-headline font-bold text-slate-400">Aucun défi disponible pour cette mission pour le moment.</p>
        <button onClick={onBack} className="mt-4 text-morocco-blue font-bold">Retourner à l'histoire</button>
      </div>
    );
  }

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
                    if (!showFeedback) {
                      setSelectedWordIdx(idx);
                    }
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

          {(challenge.type === 'decision' || challenge.type === 'dialogue') && (
            <div className="space-y-4">
              {challenge.options?.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => !showFeedback && setSelectedOptionId(opt.id)}
                  className={cn(
                    "flex items-center gap-4 p-5 text-left rounded-2xl border-2 transition-all duration-200",
                    selectedOptionId === opt.id 
                      ? (showFeedback ? (isCorrect() ? "bg-emerald-50 border-morocco-emerald" : "bg-red-50 border-red-200") : "bg-morocco-emerald/5 border-morocco-emerald shadow-md")
                      : "bg-slate-50 border-transparent hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                    selectedOptionId === opt.id ? "bg-morocco-emerald text-white" : "bg-white text-slate-400"
                  )}>
                    {opt.label}
                  </div>
                  <span className={cn(
                    "font-bold",
                    selectedOptionId === opt.id ? "text-slate-800" : "text-slate-600"
                  )}>{opt.text}</span>
                </button>
              ))}
            </div>
          )}

          {challenge.type === 'fill-in-blanks' && (
            <div className="space-y-10">
              <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 leading-loose text-xl text-slate-700 text-center">
                {challenge.content?.[0].split(/\[\d+\]/).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={cn(
                        "inline-flex min-w-[100px] h-10 border-b-4 mx-2 rounded-t-lg transition-all px-3 font-bold text-morocco-emerald bg-white shadow-sm",
                        blanksValues[String(i+1)] ? "border-morocco-emerald" : "border-slate-200"
                      )}>
                        {blanksValues[String(i+1)] || ""}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {challenge.options?.map((opt) => {
                  const isUsed = Object.values(blanksValues).includes(opt.text);
                  return (
                    <button
                      key={opt.id}
                      disabled={isUsed || showFeedback}
                      onClick={() => {
                        const nextBlank = String(Object.keys(blanksValues).length + 1);
                        setBlanksValues(prev => ({ ...prev, [nextBlank]: opt.text }));
                      }}
                      className={cn(
                        "px-6 py-3 rounded-xl font-bold transition-all shadow-sm border",
                        isUsed ? "bg-slate-100 text-slate-300 border-transparent opacity-40" : "bg-white border-slate-200 text-slate-600 hover:border-morocco-emerald hover:text-morocco-emerald"
                      )}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {challenge.type === 'ranking' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                {challenge.options?.map((opt) => {
                  const rank = selectedRankIds.indexOf(opt.id) + 1;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (showFeedback) return;
                        if (rank > 0) {
                          setSelectedRankIds(prev => prev.filter(id => id !== opt.id));
                        } else {
                          setSelectedRankIds(prev => [...prev, opt.id]);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-4 p-5 text-left rounded-2xl border-2 transition-all duration-200",
                        rank > 0 ? "bg-morocco-emerald/5 border-morocco-emerald" : "bg-slate-50 border-transparent hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                        rank > 0 ? "bg-morocco-emerald text-white" : "bg-white text-slate-300"
                      )}>
                        {rank > 0 ? rank : ""}
                      </div>
                      <span className="font-bold text-slate-700">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {challenge.type === 'matching' && (
            <div className="relative">
              <div className="grid grid-cols-2 gap-12 relative z-10">
                <div className="space-y-4">
                  {challenge.options?.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={!showFeedback && !matchingSelections[String(idx)] ? { scale: 1.02, x: 5 } : {}}
                      whileTap={!showFeedback && !matchingSelections[String(idx)] ? { scale: 0.98 } : {}}
                      disabled={showFeedback || !!matchingSelections[String(idx)]}
                      onClick={() => setActiveMatchSource(String(idx))}
                      className={cn(
                        "w-full p-5 rounded-2xl text-left text-sm font-bold border-2 transition-all shadow-sm",
                        activeMatchSource === String(idx) 
                          ? "border-morocco-emerald bg-morocco-emerald/5 ring-4 ring-morocco-emerald/5" 
                          : (matchingSelections[String(idx)] ? "bg-emerald-50 border-emerald-100 text-emerald-700 opacity-60" : "bg-white border-slate-100 hover:border-slate-200")
                      )}
                    >
                      {opt.text}
                    </motion.button>
                  ))}
                </div>
                <div className="space-y-4">
                  {challenge.options?.map((opt) => opt.match).sort().map((match, idx) => {
                    const isMatched = Object.values(matchingSelections).includes(match || '');
                    return (
                      <motion.button
                        key={idx}
                        whileHover={!showFeedback && !isMatched && activeMatchSource ? { scale: 1.02, x: -5 } : {}}
                        whileTap={!showFeedback && !isMatched && activeMatchSource ? { scale: 0.98 } : {}}
                        disabled={showFeedback || isMatched || !activeMatchSource}
                        onClick={() => {
                          if (activeMatchSource) {
                            setMatchingSelections(prev => ({ ...prev, [activeMatchSource]: match || '' }));
                            setActiveMatchSource(null);
                          }
                        }}
                        className={cn(
                          "w-full p-5 rounded-2xl text-left text-sm font-bold border-2 transition-all shadow-sm",
                          isMatched 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700 opacity-60" 
                            : (!activeMatchSource ? "bg-slate-50 text-slate-300 border-transparent cursor-not-allowed" : "bg-white border-slate-100 hover:border-morocco-emerald")
                        )}
                      >
                        {match}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {challenge.type === 'short-answer' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <textarea
                  disabled={showFeedback}
                  value={selectedOptionId || ""}
                  onChange={(e) => setSelectedOptionId(e.target.value)}
                  placeholder="Tapez votre réponse ici..."
                  className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-700 placeholder:text-slate-300 resize-none min-h-[120px]"
                />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Appuyez sur Confirmer pour valider votre réponse
              </p>
            </div>
          )}

          {(showHint || showFeedback) && challenge.hint && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-6 border-t border-dashed border-slate-100 flex items-start gap-4"
            >
              <Lightbulb className="text-morocco-gold shrink-0" size={18} />
              <p className="text-xs italic text-slate-600 leading-relaxed font-medium">
                <span className="font-bold text-morocco-gold uppercase mr-2">Indice :</span>
                {challenge.hint}
              </p>
            </motion.div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                showHint ? "bg-morocco-gold/10 text-morocco-gold" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <Lightbulb size={16} />
              AIDE
            </button>

            <button
              onClick={handleReset}
              disabled={showFeedback || (!selectedOptionId && selectedWordIdx === null)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                (selectedOptionId || selectedWordIdx !== null) && !showFeedback 
                  ? "text-red-500 hover:bg-red-50" 
                  : "text-slate-300 opacity-50 cursor-not-allowed"
              )}
            >
              <X size={16} />
              RÉINITIALISER
            </button>
          </div>
          
          {showFeedback && (
            <motion.div 
               initial={{ y: 10, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }}
               className="mt-8 pt-6 border-t border-slate-100 space-y-4"
            >
               <div className={cn("flex items-center gap-2 font-bold", isCorrect() ? "text-emerald-600" : "text-red-600")}>
                 {isCorrect() ? <CheckCircle2 size={24} fill="currentColor" fillOpacity={0.1} /> : <X size={24} />}
                 <span className="font-headline tracking-tight text-lg">
                   {isCorrect() ? "Excellent choix !" : "Oups ! Essaie encore."}
                 </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  {isCorrect() 
                    ? (challenge.feedbackPositive || "L'entraide est la clé du succès collectif. ❤️ Ton score social a augmenté.") 
                    : (challenge.feedbackNegative || "Cette réponse n'est pas tout à fait correcte. Relis bien l'énoncé.")
                  }
                </p>
                {isCorrect() && (
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 px-4 py-2 rounded-full inline-flex items-center gap-2">
                      <PartyPopper size={14} className="text-morocco-emerald" />
                      <span className="text-morocco-emerald font-black text-[10px] uppercase tracking-widest">+10 Points Sociaux</span>
                    </div>
                  </div>
                )}
            </motion.div>
          )}
        </motion.div>

        <div className="mt-12 flex items-center justify-center gap-3">
          {challenges.map((_, i) => (
             <Circle 
               key={i} 
               size={12} 
               className={cn("transition-all", i <= currentIdx ? "text-morocco-emerald fill-current" : "text-slate-200")} 
             />
          ))}
          <span className="ml-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Challenge {currentIdx + 1}/{challenges.length}
          </span>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-6 flex justify-center">
        {!showFeedback ? (
          <motion.button
            disabled={!selectedOptionId && selectedWordIdx === null && selectedRankIds.length === 0 && Object.keys(matchingSelections).length === 0 && Object.keys(blanksValues).length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className={cn(
              "w-full max-w-md h-16 rounded-2xl font-headline font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl",
              (selectedOptionId || selectedWordIdx !== null || selectedRankIds.length > 0 || Object.keys(matchingSelections).length > 0 || Object.keys(blanksValues).length > 0)
                ? "bg-morocco-emerald text-white" 
                : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
            )}
          >
            <span className="tracking-tight uppercase">CONFIRMER LA RÉPONSE</span>
            <CheckCircle2 size={20} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full max-w-md h-16 rounded-2xl font-headline font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl bg-morocco-blue text-white"
          >
            <span className="tracking-tight uppercase">
              {currentIdx === challenges.length - 1 ? "VOIR LE RÉSULTAT" : "CONTINUER LA QUÊTE"}
            </span>
            <TrendingUp size={20} />
          </motion.button>
        )}
      </footer>
    </div>
  );
}
