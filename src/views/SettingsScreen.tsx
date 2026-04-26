/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Sun, Moon, Laptop, Languages, Save } from 'lucide-react';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [userName, setUserName] = useState('Ahmed_AlMaghribi');
  const [displayMode, setDisplayMode] = useState('clair');
  const [language, setLanguage] = useState('fr');

  return (
    <div className="h-full w-full bg-morocco-cream flex flex-col overflow-hidden">
      <TopAppBar stats={{xp: 1450, stars: 120, level: 4}} title="Réglages" onBack={onBack} showProgress={false} />
      
      <main className="flex-grow overflow-y-auto px-6 py-10 space-y-10 max-w-md mx-auto w-full relative">
        <div className="absolute inset-0 zellige-pattern pointer-events-none opacity-5" />

        {/* Profile Section */}
        <section className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-white">
              <img 
                alt="User Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEnuCj82UkKXzGW0tKpWXPsCMVxp-ze2cDdCMYUcyGp-bxmqiPpfxq6WS0cLA0F_4fHZzo4EBdyjNNcqb9EcIdChW45pSIDd_OMNlxBs2UULMjeZb2S6M0FhkIqKFBdiqI4bNtjf7siSxvoJNR3P4LXULObMP_bndo_xMDfHHGdDqFrQyP4ULR99TUdOXKujPVQ3mYRW1jJmEkXQ4lBCWbjptm_vK9MKgBqWPRBIayk4fWtmzHlrXjpeDW1uLbJwRYWp5wCddpNOM" 
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-morocco-emerald text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
              <User size={20} />
            </button>
          </div>
          <h2 className="mt-6 text-2xl font-headline font-black text-morocco-emerald tracking-tight">Paramètres du profil</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">إعدادات الملف الشخصي</p>
        </section>

        {/* Username Entry */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Nom d'utilisateur</label>
              <span className="text-[10px] font-bold text-morocco-gold opacity-60">اسم المستخدم</span>
            </div>
            <input 
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-slate-800 focus:ring-2 focus:ring-morocco-emerald/10 font-bold text-lg" 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </section>

        {/* Display Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-morocco-gold" />
            <h3 className="text-lg font-headline font-black text-morocco-emerald tracking-tight flex items-center gap-2">
              Mode d'affichage <span className="font-normal text-slate-300 text-xs">وضع العرض</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'clair', icon: Sun, label: 'Clair', ar: 'مضيء' },
              { id: 'sombre', icon: Moon, label: 'Sombre', ar: 'مظلم' },
              { id: 'systeme', icon: Laptop, label: 'Système', ar: 'النظام' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setDisplayMode(mode.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-5 rounded-2xl transition-all border-2",
                  displayMode === mode.id 
                    ? "bg-morocco-emerald text-white border-morocco-emerald shadow-lg ring-4 ring-morocco-emerald/5" 
                    : "bg-white text-slate-400 border-transparent hover:border-slate-100"
                )}
              >
                <mode.icon size={24} />
                <div className="text-center">
                  <div className="text-xs font-black uppercase tracking-widest">{mode.label}</div>
                  <div className="text-[9px] opacity-60 font-bold mt-0.5">{mode.ar}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Language Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-morocco-orange" />
            <h3 className="text-lg font-headline font-black text-morocco-emerald tracking-tight flex items-center gap-2">
              Langue d'affichage <span className="font-normal text-slate-300 text-xs">لغة العرض</span>
            </h3>
          </div>
          
          <div className="bg-white rounded-2xl p-2 flex gap-1 shadow-sm border border-slate-50">
            <button 
              onClick={() => setLanguage('fr')}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-black text-sm uppercase tracking-widest transition-all",
                language === 'fr' ? "bg-morocco-gold/10 text-morocco-gold" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              Français
            </button>
            <button 
              onClick={() => setLanguage('ar')}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-black text-sm uppercase tracking-widest transition-all",
                language === 'ar' ? "bg-morocco-gold/10 text-morocco-gold" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              العربية
            </button>
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-6 pb-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-morocco-emerald text-white py-5 rounded-2xl font-headline font-black text-lg shadow-xl shadow-morocco-emerald/20 flex items-center justify-center gap-4 group"
          >
            <div className="flex flex-col items-center leading-none">
              <span className="tracking-tight">ENREGISTRER LES MODIFICATIONS</span>
              <span className="text-xs opacity-60 font-bold mt-1 tracking-widest">حفظ التغييرات</span>
            </div>
            <Save size={24} className="group-hover:rotate-12 transition-transform" />
          </motion.button>
        </div>
      </main>
    </div>
  );
}
