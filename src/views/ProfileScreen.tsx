/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Settings, MessageCircle, GitBranch, Users, Brain, ChevronRight, TrendingUp } from 'lucide-react';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';

interface ProfileScreenProps {
  onBack: () => void;
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const skills = [
    { name: 'Communication', label: 'التواصل', level: 2, xp: 75, icon: MessageCircle, color: 'text-morocco-blue' },
    { name: 'Décision', label: 'القرار', level: 1, xp: 40, icon: GitBranch, color: 'text-morocco-orange' },
    { name: 'Travail d\'équipe', label: 'العمل الجماعي', level: 3, xp: 85, icon: Users, color: 'text-morocco-emerald' },
    { name: 'Gestion Stress', label: 'إدارة الضغط', level: 1, xp: 20, icon: Brain, color: 'text-slate-600' },
  ];

  return (
    <div className="h-full w-full bg-morocco-cream flex flex-col overflow-hidden">
      <TopAppBar stats={{xp: 1450, stars: 120, level: 4}} title="Profil Voyageur" onBack={onBack} />
      
      <main className="flex-grow overflow-y-auto px-6 pt-10 pb-32 space-y-8 max-w-md mx-auto w-full relative">
        <div className="absolute inset-0 zellige-pattern pointer-events-none opacity-5" />

        {/* User Card */}
        <section className="relative bg-white rounded-[2rem] p-8 shadow-xl border-t border-white overflow-hidden text-center">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-morocco-gold/10 rounded-full blur-3xl opacity-50" />
          
          <div className="relative inline-block mb-4">
             <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-morocco-emerald to-morocco-gold shadow-lg">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEnuCj82UkKXzGW0tKpWXPsCMVxp-ze2cDdCMYUcyGp-bxmqiPpfxq6WS0cLA0F_4fHZzo4EBdyjNNcqb9EcIdChW45pSIDd_OMNlxBs2UULMjeZb2S6M0FhkIqKFBdiqI4bNtjf7siSxvoJNR3P4LXULObMP_bndo_xMDfHHGdDqFrQyP4ULR99TUdOXKujPVQ3mYRW1jJmEkXQ4lBCWbjptm_vK9MKgBqWPRBIayk4fWtmzHlrXjpeDW1uLbJwRYWp5wCddpNOM" 
                  alt="Yassine" 
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div className="absolute -bottom-1 -right-1 bg-morocco-gold text-white px-3 py-1 rounded-full text-xs font-black shadow-md border-2 border-white">
                Niv. 4
             </div>
          </div>

          <h3 className="text-2xl font-headline font-black text-slate-800 tracking-tight">Yassine</h3>
          <p className="text-morocco-gold font-bold text-xs uppercase tracking-[0.2em] mt-1">L'Explorateur des Savoirs</p>
        </section>

        {/* XP Progress Bar */}
        <section className="bg-morocco-emerald/5 rounded-[2rem] p-6 border border-morocco-emerald/10 shadow-sm">
           <div className="flex justify-between items-end mb-4">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progression XP</p>
                 <p className="text-slate-800 font-black text-lg tracking-tight">⭐ 1,450 / 2,000 XP</p>
              </div>
              <p className="text-morocco-gold font-black text-[10px] uppercase tracking-widest">NIVEAU 5 ⭐</p>
           </div>
           <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '72.5%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-morocco-emerald to-emerald-400" 
              />
           </div>
        </section>

        {/* Skills Grid */}
        <section className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <h4 className="font-headline font-black text-lg text-slate-800 tracking-tight">
                Tes Compétences <span className="text-morocco-gold opacity-30">| المهارات</span>
              </h4>
              <button className="text-morocco-gold font-black text-xs uppercase tracking-widest flex items-center gap-1 group">
                 Voir tout <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.name} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
                   <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                         <circle className="text-slate-100" cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" />
                         <motion.circle 
                           initial={{ strokeDashoffset: 176 }}
                           animate={{ strokeDashoffset: 176 - (176 * skill.xp) / 100 }}
                           transition={{ duration: 1.5, delay: 0.5 }}
                           className={cn("transition-all duration-1000", skill.color)}
                           cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6"
                           strokeDasharray={176}
                           strokeLinecap="round"
                         />
                      </svg>
                      <skill.icon className={skill.color} size={24} />
                   </div>
                   <div>
                      <p className="font-black text-xs text-slate-800 tracking-tight">{skill.name}</p>
                      <p className="arabic-font text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{skill.label}</p>
                   </div>
                   <div className="bg-slate-50 px-3 py-1 rounded-full text-[9px] font-black text-slate-400 ring-1 ring-slate-100">
                      NIV. {skill.level}
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Global Achievement */}
        <section className="bg-gradient-to-br from-morocco-blue to-blue-700 rounded-[2rem] p-6 text-white shadow-xl flex items-center justify-between">
           <div className="space-y-1">
              <h5 className="font-headline font-black text-lg tracking-tight">Ligue de Cristal</h5>
              <p className="text-blue-100 text-xs font-medium opacity-80">Top 5% des voyageurs du mois</p>
           </div>
           <TrendingUp size={32} className="text-blue-200" />
        </section>
      </main>
    </div>
  );
}
