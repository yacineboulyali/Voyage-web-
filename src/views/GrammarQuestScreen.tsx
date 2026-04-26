/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, CheckCircle2, School, Trophy, ShoppingBasket, User, PawPrint as Pets } from 'lucide-react';
import { cn } from '../lib/utils';

interface GrammarQuestScreenProps {
  onBack: () => void;
}

const WORDS = ['Dog', 'Cat', 'Cow', 'Bird'];

export default function GrammarQuestScreen({ onBack }: GrammarQuestScreenProps) {
  const [slot1, setSlot1] = useState<string | null>(null);
  const [slot2, setSlot2] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  
  const isComplete = slot1 === 'Dog' && slot2 === 'Cat';

  const handleWordSelect = (word: string) => {
    if (slot1 === word || slot2 === word) return;
    if (activeSlot === 1) {
      setSlot1(word);
      if (!slot2) setActiveSlot(2);
    } else {
      setSlot2(word);
      if (!slot1) setActiveSlot(1);
    }
  };

  return (
    <div className="h-full w-full bg-[#f3f7fb] text-[#2a2f32] flex flex-col font-body">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#ecf1f6] transition-all">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 transition-all rounded-full scale-95 duration-150"
          >
            <ArrowLeft className="text-blue-500" size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-on-surface">Lesson Tracker</span>
            {/* Progress Rail */}
            <div className="w-32 h-2 bg-[#d7dee3] rounded-full mt-1 overflow-hidden">
              <motion.div 
                initial={{ width: '30%' }}
                animate={{ width: isComplete ? '100%' : '30%' }}
                className="h-full bg-gradient-to-r from-[#006a27] to-[#96f89f] shadow-[0_0_8px_rgba(150,248,159,0.5)]" 
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-1.5 rounded-full shadow-sm">
            <span className="font-bold text-blue-500">⭐ 110</span>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-20 mb-32 px-6 flex flex-col items-center max-w-2xl mx-auto w-full">
        {/* Instructional Bento Header */}
        <div className="w-full mb-8 text-center text-on-surface">
          <span className="inline-block px-4 py-1 bg-[#f99a3f] text-white rounded-full text-[11px] font-bold tracking-widest mb-4">
            GRAMMAR QUEST
          </span>
          <h1 className="text-3xl font-extrabold font-headline tracking-tight mb-2">Fill in the blanks</h1>
          <p className="text-[#575c60] text-lg">Drag the correct animals into the sentence to make it complete!</p>
        </div>

        {/* Hero Interaction Area */}
        <div className="w-full bg-white rounded-xl p-10 mb-8 shadow-sm relative overflow-hidden">
          {/* Decorative Bleed Illustration */}
          <div className="absolute -top-10 -right-10 opacity-20 transform rotate-12">
            <Pets size={120} className="text-[#005ab2]" />
          </div>
          
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-6 text-2xl md:text-3xl font-medium leading-relaxed">
            <span className="text-on-surface">The</span>
            
            {/* Dropped Slot 1 */}
            <div 
              onClick={() => setActiveSlot(1)}
              className={cn(
                "inline-flex items-center justify-center min-w-[120px] h-14 rounded-xl border-2 transition-all px-4 cursor-pointer",
                slot1 ? "bg-[#005ab2] border-transparent" : "border-dashed border-[#005ab2]/30 bg-[#005ab2]/10",
                activeSlot === 1 && !slot1 && "ring-2 ring-[#005ab2]"
              )}
            >
              {slot1 ? (
                <div className="bg-[#005ab2] text-white text-xl font-bold py-2 px-6 rounded-full shadow-[0_4px_0_0_#004e9d] scale-100">
                  {slot1}
                </div>
              ) : null}
            </div>

            <span className="text-on-surface">jumped over the lazy</span>
            
            {/* Dropped Slot 2 */}
            <div 
              onClick={() => setActiveSlot(2)}
              className={cn(
                "inline-flex items-center justify-center min-w-[120px] h-14 rounded-xl border-2 transition-all px-4 cursor-pointer",
                slot2 ? "bg-[#005ab2] border-transparent" : "border-dashed border-[#005ab2]/30 bg-[#005ab2]/10",
                activeSlot === 2 && !slot2 && "ring-2 ring-[#005ab2]"
              )}
            >
              {slot2 ? (
                <div className="bg-[#005ab2] text-white text-xl font-bold py-2 px-6 rounded-full shadow-[0_4px_0_0_#004e9d] scale-100">
                  {slot2}
                </div>
              ) : null}
            </div>
            
            <span className="text-on-surface">.</span>
          </div>
        </div>

        {/* Word Bank Container */}
        <div className="w-full space-y-4">
          <p className="text-sm font-bold text-[#a9aeb1] uppercase tracking-widest text-center">Word Bank</p>
          <div className="flex flex-wrap justify-center gap-4">
            {WORDS.map((word) => {
              const isUsed = slot1 === word || slot2 === word;
              return (
                <button
                  key={word}
                  disabled={isUsed}
                  onClick={() => handleWordSelect(word)}
                  className={cn(
                    "font-bold py-3 px-8 rounded-xl transition-all duration-150",
                    isUsed 
                      ? "bg-[#ecf1f6] text-[#575c60]/40 cursor-not-allowed" 
                      : "bg-white text-on-surface shadow-[0_4px_0_0_#dde3e8] hover:scale-95 active:translate-y-1 active:shadow-none border border-[#a9aeb1]/10"
                  )}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Banner */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg z-40"
            >
              <div className="bg-[#96f89f] p-6 rounded-xl shadow-[0_12px_40px_rgba(150,248,159,0.3)] flex items-center justify-between border-2 border-green-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <CheckCircle2 color="#006a27" size={30} />
                  </div>
                  <div className="text-[#005f22]">
                    <h3 className="font-headline font-extrabold text-[#006a27] text-xl">Well done!</h3>
                    <p className="text-sm font-medium opacity-80">You nailed the sentence structure.</p>
                  </div>
                </div>
                <button 
                  onClick={onBack}
                  className="bg-[#006a27] text-[#cfffcd] px-6 py-3 rounded-full font-bold shadow-[0_4px_0_0_#004a19] hover:scale-95 transition-all active:translate-y-1 active:shadow-none"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
