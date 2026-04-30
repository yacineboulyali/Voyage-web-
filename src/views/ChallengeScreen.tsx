import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, TrendingUp, CheckCircle2, Loader2, X, Map as MapIcon, Info, PartyPopper, Compass, Trophy, User, Settings, LayoutGrid, Sparkles, MessageSquare, RotateCcw } from 'lucide-react';
import { type City, type Challenge } from '../types';
import { cn } from '../lib/utils';
import { useSupabaseQuestions } from '../hooks/useSupabase';
import { useAudio } from '../hooks/useAudio';

interface ChallengeScreenProps {
  city: City;
  missionId: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function ChallengeScreen({ city, missionId, onComplete, onBack }: ChallengeScreenProps) {
  const { playSound } = useAudio();
  const { questions, loading: loadingQuestions } = useSupabaseQuestions(missionId);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [selectedRankIds, setSelectedRankIds] = useState<string[]>([]);
  const [matchingSelections, setMatchingSelections] = useState<{ [key: string]: string }>({});
  const [activeMatchSource, setActiveMatchSource] = useState<string | null>(null);
  const [blanksValues, setBlanksValues] = useState<{ [key: string]: string }>({});
  const [teamRoleValues, setTeamRoleValues] = useState<{ [key: string]: string }>({});
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const challenge = questions[currentIdx];

  useEffect(() => {
    handleReset();
  }, [currentIdx]);

  const handleReset = () => {
    setSelectedOptionId(null);
    setSelectedWordIdx(null);
    setSelectedRankIds([]);
    setMatchingSelections({});
    setActiveMatchSource(null);
    setBlanksValues({});
    setTeamRoleValues({});
    if (challenge?.type === 'zellige') {
      const initialRotations: { [key: string]: string } = {};
      for (let i = 0; i < 9; i++) {
        initialRotations[i] = String(Math.floor(Math.random() * 4) * 90);
      }
      setMatchingSelections(initialRotations);
    } else {
      setMatchingSelections({});
    }
    setShowFeedback(false);
    setShowHint(false);
  };

  const handleConfirm = () => {
    if (canConfirm()) {
      setShowFeedback(true);
      if (isCorrect()) {
        playSound('correct');
      } else {
        playSound('wrong');
      }
    }
  };

  const canConfirm = () => {
    if (!challenge) return false;
    const type = challenge.type;
    if (['multiple-choice', 'true-false', 'scenario-decision', 'scenario-dialogue', 'short-answer', 'puzzle-riddle'].includes(type)) return !!selectedOptionId;
    if (type === 'glitch') return selectedWordIdx !== null;
    if (type === 'ranking') return selectedRankIds.length === (challenge.options?.length || 0);
    if (type === 'fill-in-blanks') return Object.keys(blanksValues).length > 0;
    if (type === 'matching') return Object.keys(matchingSelections).length === (challenge.options?.length || 0);
    if (type === 'team-roles') return Object.keys(teamRoleValues).length > 0;
    if (type === 'zellige') return true; 
    return false;
  };

  const isCorrect = () => {
    if (!challenge) return false;
    const type = challenge.type;
    if (type === 'glitch') return selectedWordIdx === parseInt(challenge.correctOptionId || '0');
    if (type === 'ranking') return selectedRankIds.join(',') === challenge.correctOptionId;
    if (type === 'fill-in-blanks') {
      const sorted = Object.keys(blanksValues).sort().map(k => blanksValues[k]);
      const correct = challenge.correctOptionId?.split(/[|,,]/).map(s => s.trim()) || [];
      return sorted.join('|') === correct.join('|');
    }
    if (type === 'matching') {
      return (challenge.options as any[])?.every((opt, idx) => matchingSelections[String(idx)] === opt.match);
    }
    if (type === 'team-roles') return true; 
    if (type === 'zellige') {
      return Object.values(matchingSelections).every(angle => parseInt(angle as string) % 360 === 0);
    }
    return selectedOptionId === challenge.correctOptionId;
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      playSound('success');
      onComplete();
    }
  };

  if (loadingQuestions) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-voyage-accent" size={48} />
        <p className="mt-4 font-headline font-black text-voyage-accent uppercase tracking-widest text-xs">Chargement du défi...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 bg-duo-orange/10 rounded-full flex items-center justify-center mb-6">
           <MapIcon size={64} className="text-duo-orange" />
        </div>
        <h2 className="font-headline font-black text-2xl text-duo-eel mb-2">Oups !</h2>
        <p className="font-bold text-duo-wolf mb-8">Nous n'avons pas trouvé de questions pour cette mission.</p>
        <button onClick={onBack} className="btn-voyage-accent px-12 py-4 uppercase font-black tracking-tight">Retour</button>
      </div>
    );
  }

  // Handle case where challenge data might be incomplete
  if (challenge && (!challenge.options || (Array.isArray(challenge.options) && challenge.options.length === 0))) {
    const typeNoOptions = ['short-answer', 'puzzle-riddle', 'glitch'];
    if (!typeNoOptions.includes(challenge.type)) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-8 bg-white">
          <div className="w-24 h-24 bg-duo-swan/20 rounded-full flex items-center justify-center border-2 border-duo-swan">
             <LayoutGrid className="text-duo-wolf opacity-40" size={48} />
          </div>
          <div className="space-y-2">
             <h2 className="text-2xl font-black text-duo-eel tracking-tight">Oups ! Données manquantes</h2>
             <p className="text-duo-wolf font-bold">Cet exercice n'est pas encore prêt. Ne t'inquiète pas, tu peux le passer !</p>
          </div>
          <button 
             onClick={() => setCurrentIdx(prev => prev + 1)}
             className="btn-voyage-accent w-full max-w-xs"
          >
             Passer cet exercice
          </button>
          <button 
             onClick={onBack}
             className="text-voyage-accent font-black uppercase tracking-widest text-xs hover:underline"
          >
             Retour à la mission
          </button>
        </div>
       );
    }
  }

  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="h-full w-full bg-white flex flex-col relative overflow-hidden">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b-[3px] border-duo-swan px-6 py-4 flex items-center gap-6">
        <button onClick={onBack} className="p-2 hover:bg-duo-swan rounded-xl transition-colors">
          <X size={24} className="text-duo-wolf" />
        </button>
        
        <div className="flex-grow">
          <div className="h-4 w-full bg-duo-swan rounded-full overflow-hidden border-2 border-duo-swan relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-voyage-primary rounded-full shadow-lg relative"
            >
               <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/30 rounded-full" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-duo-orange/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-duo-orange" />
           </div>
           <span className="font-black text-duo-orange text-sm">{currentIdx + 1}/{questions.length}</span>
        </div>
      </header>
      
      <main className="flex-grow pt-24 pb-32 px-6 max-w-2xl mx-auto w-full relative z-10 overflow-y-auto scrollbar-hide">
        <div className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-voyage-accent/10 rounded-full border border-voyage-accent/20">
             <span className="text-[10px] font-black text-voyage-accent uppercase tracking-widest">{challenge.type.replace('-', ' ')}</span>
          </div>
          <h2 className="text-2xl font-black text-duo-eel leading-tight tracking-tight">{challenge.question}</h2>
        </div>

        <motion.div 
          key={challenge.id}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          {['multiple-choice', 'true-false', 'scenario-decision', 'scenario-cascade'].includes(challenge.type) && (
            <div className="space-y-3">
              {challenge.options?.map((opt) => (
                <button
                  key={opt.id}
                  disabled={showFeedback}
                  onClick={() => {
                    playSound('click');
                    setSelectedOptionId(opt.id);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-5 text-left rounded-2xl border-2 transition-all duration-100 group relative",
                    selectedOptionId === opt.id 
                      ? "bg-voyage-primary/5 border-voyage-primary shadow-[0_4px_0_0_#8B4513] translate-y-[-2px]"
                      : "bg-white border-voyage-secondary/30 hover:bg-voyage-secondary/10 border-b-4 active:translate-y-[2px] active:border-b-0"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-colors",
                    selectedOptionId === opt.id ? "bg-voyage-primary border-voyage-primary text-white" : "bg-white border-voyage-secondary/30 text-voyage-secondary group-hover:border-voyage-primary/30"
                  )}>
                    {opt.label || '?'}
                  </div>
                  <span className={cn(
                    "font-bold text-lg",
                    selectedOptionId === opt.id ? "text-voyage-primary" : "text-duo-eel"
                  )}>{opt.text}</span>
                </button>
              ))}
            </div>
          )}

          {challenge.type === 'scenario-dialogue' && (
            <div className="space-y-8">
              <div className="flex items-end gap-4">
                <div className="w-16 h-16 rounded-2xl bg-voyage-secondary/20 flex items-center justify-center shrink-0 border-2 border-voyage-secondary/30">
                  <User className="text-voyage-primary" size={32} />
                </div>
                <div className="bg-white border-2 border-voyage-secondary/30 p-5 rounded-2xl rounded-bl-none relative shadow-sm max-w-sm">
                   <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-b-2 border-l-2 border-voyage-secondary/30 rotate-45" />
                   <p className="font-bold text-duo-eel italic">"{challenge.context_dialogue || challenge.question}"</p>
                </div>
              </div>

              <div className="space-y-3 pl-20">
                {challenge.options?.map((opt) => (
                  <button
                    key={opt.id}
                    disabled={showFeedback}
                    onClick={() => {
                      playSound('click');
                      setSelectedOptionId(opt.id);
                    }}
                    className={cn(
                      "w-full p-4 text-left rounded-2xl border-2 transition-all group relative",
                      selectedOptionId === opt.id 
                        ? "bg-voyage-primary text-white border-voyage-primary shadow-[0_4px_0_0_#8B4513] translate-y-[-2px]"
                        : "bg-white border-voyage-secondary/30 text-duo-eel border-b-4 hover:border-voyage-primary/50"
                    )}
                  >
                    <span className="font-bold">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {challenge.type === 'fill-in-blanks' && (
            <div className="space-y-10">
              <div className="bg-duo-swan/20 p-8 rounded-[2.5rem] border-2 border-duo-swan leading-loose text-xl text-duo-eel text-center font-bold">
                {challenge.content?.[0]?.split(/\[\d+\]/).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={cn(
                        "inline-flex min-w-[120px] h-10 border-b-4 mx-2 rounded-t-lg transition-all px-3 font-black text-voyage-accent bg-white shadow-inner",
                        blanksValues[String(i+1)] ? "border-voyage-accent text-voyage-accent" : "border-duo-swan text-transparent"
                      )}>
                        {blanksValues[String(i+1)] || "____"}
                      </span>
                    )}
                  </span>
                )) || "Contenu manquant."}
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {challenge.options?.map((opt) => {
                  const isUsed = Object.values(blanksValues).includes(opt.text);
                  return (
                    <button
                      key={opt.id}
                      disabled={isUsed || showFeedback}
                      onClick={() => {
                        playSound('click');
                        const nextBlank = String(Object.keys(blanksValues).length + 1);
                        setBlanksValues(prev => ({ ...prev, [nextBlank]: opt.text }));
                      }}
                      className={cn(
                        "px-6 py-4 rounded-2xl font-black transition-all shadow-md border-b-4",
                        isUsed 
                          ? "bg-duo-swan text-duo-wolf/40 border-transparent translate-y-[4px] shadow-none" 
                          : "bg-white border-duo-swan text-duo-eel hover:bg-duo-swan/20 active:translate-y-[2px] active:border-b-0"
                      )}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center">
                 <button onClick={() => setBlanksValues({})} disabled={showFeedback} className="text-xs font-black text-voyage-accent uppercase tracking-widest hover:opacity-70 disabled:opacity-30">Réinitialiser</button>
              </div>
            </div>
          )}

          {challenge.type === 'matching' && (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                {(challenge.options as any[])?.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={showFeedback || !!matchingSelections[String(idx)]}
                    onClick={() => {
                      playSound('click');
                      setActiveMatchSource(String(idx));
                    }}
                    className={cn(
                      "w-full p-4 rounded-2xl text-left text-sm font-black border-b-4 transition-all",
                      activeMatchSource === String(idx) 
                        ? "bg-voyage-accent/10 border-voyage-accent text-voyage-accent scale-105" 
                        : (matchingSelections[String(idx)] ? "bg-duo-swan/30 border-transparent text-duo-wolf opacity-40 translate-y-[4px] shadow-none" : "bg-white border-duo-swan hover:bg-duo-swan/20")
                    )}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {Array.from(new Set((challenge.options as any[] || []).map(o => o.match).filter(Boolean))).sort().map((match, idx) => {
                  return (
                    <button
                      key={idx}
                      disabled={showFeedback || !activeMatchSource}
                      onClick={() => {
                        if (activeMatchSource) {
                          playSound('match');
                          setMatchingSelections(prev => ({ ...prev, [activeMatchSource]: match || '' }));
                          setActiveMatchSource(null);
                        }
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl text-left text-sm font-black border-b-4 transition-all",
                        !activeMatchSource 
                          ? "bg-duo-swan/10 text-duo-wolf/30 border-transparent cursor-not-allowed" 
                          : "bg-white border-duo-swan hover:border-voyage-accent shadow-[0_4px_0_0_#e5e5e5]"
                      )}
                    >
                      {match}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {challenge.type === 'ranking' && (
            <div className="space-y-3">
              {challenge.options?.map((opt) => {
                const rank = selectedRankIds.indexOf(opt.id) + 1;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (showFeedback) return;
                      if (rank > 0) {
                        playSound('click');
                        setSelectedRankIds(prev => prev.filter(id => id !== opt.id));
                      } else {
                        playSound('click');
                        setSelectedRankIds(prev => [...prev, opt.id]);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 text-left rounded-2xl border-b-4 transition-all",
                      rank > 0 ? "bg-duo-orange/5 border-duo-orange text-duo-orange" : "bg-white border-duo-swan hover:bg-duo-swan/20"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2",
                      rank > 0 ? "bg-duo-orange border-duo-orange text-white" : "bg-white border-duo-swan text-duo-swan"
                    )}>{rank > 0 ? rank : ""}</div>
                    <span className="font-bold text-duo-eel text-lg">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {challenge.type === 'team-roles' && (
            <div className="space-y-4">
              {((challenge.options as any)?.roles || []).map((roleObj: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-2 p-4 bg-white border-2 border-duo-swan rounded-2xl shadow-sm hover:border-voyage-accent/50 transition-all">
                  <span className="text-[10px] font-black text-duo-wolf uppercase tracking-widest">{roleObj.role}</span>
                  <input
                    type="text"
                    placeholder="Nom du membre..."
                    className="p-2 bg-duo-swan/10 border-b-2 border-duo-swan font-bold text-duo-eel focus:border-voyage-accent outline-none transition-all"
                    onChange={(e) => setTeamRoleValues(prev => ({ ...prev, [roleObj.role]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          )}

          {challenge.type === 'short-answer' && (
             <div className="bg-duo-swan/10 rounded-3xl p-6 border-2 border-duo-swan focus-within:border-voyage-accent transition-colors">
               <textarea 
                 value={selectedOptionId || ''}
                 onChange={(e) => setSelectedOptionId(e.target.value)}
                 disabled={showFeedback}
                 placeholder="Écris ta réponse ici..."
                 className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold text-duo-eel placeholder:text-duo-wolf/30 min-h-[150px] resize-none"
               />
             </div>
          )}

          {challenge.type === 'glitch' && (
            <div className="bg-white border-2 border-duo-swan p-8 rounded-[2.5rem] leading-[2.5] text-xl font-bold text-duo-eel text-center">
               {challenge.content?.[0]?.split(' ').map((word, i) => (
                 <button
                   key={i}
                   disabled={showFeedback}
                   onClick={() => {
                     playSound('click');
                     setSelectedWordIdx(i);
                   }}
                   className={cn(
                     "inline-block px-2 mx-0.5 rounded-lg transition-all",
                     selectedWordIdx === i 
                       ? "bg-voyage-accent text-white shadow-[0_4px_0_0_#A8862E] translate-y-[-2px]" 
                       : "hover:bg-duo-swan/30 cursor-pointer"
                   )}
                 >
                   {word}
                 </button>
               ))}
               <p className="mt-8 text-xs font-black text-duo-wolf uppercase tracking-widest opacity-60">Clique sur le mot qui contient une erreur</p>
            </div>
          )}

          {challenge.type === 'puzzle-riddle' && (
            <div className="bg-gradient-to-br from-voyage-primary to-voyage-primary/80 p-8 rounded-[3rem] border-4 border-voyage-accent shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={120} className="text-white" />
               </div>
               <div className="relative z-10 space-y-8">
                 <div className="flex justify-center">
                    <div className="bg-voyage-accent/20 p-4 rounded-full border border-voyage-accent/30 backdrop-blur-sm">
                       <MessageSquare className="text-voyage-accent" size={32} />
                    </div>
                 </div>
                 <p className="text-2xl font-black text-white text-center leading-relaxed italic">
                   "{challenge.question}"
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    {challenge.options?.map((opt) => (
                      <button
                        key={opt.id}
                        disabled={showFeedback}
                        onClick={() => {
                          playSound('click');
                          setSelectedOptionId(opt.id);
                        }}
                        className={cn(
                          "p-4 rounded-2xl font-black transition-all border-b-4",
                          selectedOptionId === opt.id 
                            ? "bg-voyage-accent text-voyage-primary border-voyage-accent-dark translate-y-[-2px]" 
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        )}
                      >
                        {opt.text}
                      </button>
                    ))}
                 </div>
               </div>
            </div>
          )}

          {challenge.type === 'zellige' && (
            <div className="flex flex-col items-center gap-8 py-4">
               <div className="grid grid-cols-3 gap-2 w-full max-w-sm aspect-square bg-voyage-primary/5 p-4 rounded-3xl border-4 border-voyage-secondary/20 shadow-inner">
                  {[...Array(9)].map((_, i) => (
                    <motion.button 
                      key={i}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (showFeedback) return;
                        playSound('click');
                        setMatchingSelections(prev => ({ ...prev, [i]: String((parseInt(prev[i] || '0') + 90) % 360) }));
                      }}
                      className="bg-white rounded-xl border-2 border-voyage-secondary/10 flex items-center justify-center relative overflow-hidden group shadow-sm"
                    >
                       <motion.div 
                         animate={{ rotate: parseInt(matchingSelections[i] || '0') }}
                         className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-voyage-primary/10 to-voyage-accent/10"
                       >
                          <LayoutGrid className="text-voyage-primary opacity-30" size={32} />
                       </motion.div>
                       <div className="absolute inset-0 border-2 border-transparent group-hover:border-voyage-accent/30 rounded-xl transition-colors" />
                    </motion.button>
                  ))}
               </div>
               <div className="flex flex-col items-center gap-2">
                 <p className="text-voyage-primary font-black uppercase tracking-widest text-xs">Atelier Zellige</p>
                 <p className="text-duo-wolf font-bold italic text-center">Oriente correctement les carreaux pour restaurer le motif fassi.</p>
               </div>
            </div>
          )}

          {showHint && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-voyage-accent/10 border-2 border-voyage-accent/30 p-6 rounded-[2rem] flex items-start gap-4">
              <Lightbulb className="text-voyage-accent shrink-0" size={24} />
              <div>
                 <span className="text-[10px] font-black text-voyage-accent uppercase tracking-widest block mb-1">INDICE</span>
                 <p className="text-voyage-primary font-bold italic">"{challenge.hint || "Rappelle-toi des leçons précédentes !"}"</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {showFeedback ? (
          <motion.footer 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className={cn(
              "fixed bottom-0 left-0 w-full z-50 p-6 pb-12 pt-8 flex flex-col items-center gap-6 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]",
              isCorrect() ? "bg-[#FBF3E3] border-t-4 border-voyage-accent" : "bg-[#FFF1EE] border-t-4 border-voyage-terracotta"
            )}
          >
            <div className="max-w-2xl w-full flex items-start gap-6 px-4 text-left">
              <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 border-b-8 shadow-xl", isCorrect() ? "bg-voyage-primary border-voyage-primary-dark" : "bg-voyage-terracotta border-voyage-terracotta-dark")}>
                {isCorrect() ? <CheckCircle2 size={48} className="text-white stroke-[3px]" /> : <X size={48} className="text-white stroke-[3px]" />}
              </div>
              <div className="space-y-2">
                <h3 className={cn("text-3xl font-black tracking-tight", isCorrect() ? "text-voyage-primary" : "text-voyage-terracotta")}>
                  {isCorrect() ? "Excellent !" : "Pas tout à fait..."}
                </h3>
                <p className={cn("font-bold leading-relaxed", isCorrect() ? "text-voyage-primary/80" : "text-voyage-terracotta/80")}>
                  {isCorrect() ? (challenge.feedbackPositive || "C'est la bonne réponse ! +10 XP") : (challenge.feedbackNegative || "Retente ta chance !")}
                </p>
                {isCorrect() && (
                   <div className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-2xl inline-flex items-center gap-2 border border-white/40">
                      <PartyPopper size={18} className="text-voyage-primary" />
                      <span className="text-voyage-primary font-black text-sm uppercase tracking-tight">+15 XP</span>
                   </div>
                )}
              </div>
            </div>
            <div className="w-full max-w-2xl px-4">
               <motion.button whileTap={{ scale: 0.95 }} onClick={handleNext} className={cn("w-full text-xl py-5 font-black uppercase tracking-tight", isCorrect() ? "btn-voyage-primary" : "bg-voyage-terracotta text-white border-b-4 border-voyage-terracotta-dark rounded-2xl")}>
                 {currentIdx === questions.length - 1 ? "VOIR LE RÉSULTAT" : "CONTINUER"}
               </motion.button>
            </div>
          </motion.footer>
        ) : (
          <footer className="fixed bottom-0 left-0 w-full z-40 bg-white border-t-[3px] border-voyage-secondary/20 p-6 pb-10 flex justify-center">
            <div className="w-full max-w-2xl flex items-center gap-4 px-4">
              <button onClick={() => setShowHint(!showHint)} className="p-4 bg-voyage-sand/30 border-2 border-voyage-secondary/20 rounded-2xl text-voyage-accent hover:bg-voyage-sand/50 transition-colors border-b-4">
                <Lightbulb size={24} />
              </button>
              <motion.button
                disabled={!canConfirm()} whileTap={{ scale: 0.95 }} onClick={handleConfirm}
                className={cn("flex-grow text-xl py-5 font-black uppercase tracking-tight", canConfirm() ? "btn-voyage" : "bg-voyage-sand text-voyage-secondary/30 border-transparent cursor-not-allowed border-b-0")}
              >
                Vérifier
              </motion.button>
            </div>
          </footer>
        )}
      </AnimatePresence>
    </div>
  );
}

