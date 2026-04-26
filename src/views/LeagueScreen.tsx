/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Trophy, Timer, ChevronRight, Star, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import type { League } from '../types';

interface LeagueScreenProps {
  onSelectLeague: (id: string) => void;
  onCreateLeague: () => void;
  onBack: () => void;
}

const MOCK_LEAGUES: League[] = [
  {
    id: 'bronze',
    name: 'Ligue Bronze',
    tier: 'bronze',
    timeLeft: '2j 4h',
    myRank: 4,
    players: [
      { id: '1', name: 'Zaynab', xp: 2100, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa0Qi6bn32DpDzORmMcPM-DSSMBY4VsJPvTEDgA1VhvdMDJ5W1JuO2zyz9ZMLC89u0CbVN3ihJuoBveSKM2GCQy-O8THfaB-rhAO5CjQA_R8WY_c_L46eN34wiwNl_drXpdRsZFUQbBu7TB3JzCLp0TXgc2cFJXPSqqisFG3irKtEALPT0gl0QnP8_BkrZc2i6Fp2pdvd_NuLII2sD7wTQd_-W4xfKAcXdsXc61Hkyfwvoo-4tJ210y5sUkpj3JogzcpI7JNkya7o', rank: 1 },
      { id: '2', name: 'Omar', xp: 1950, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDELPthMs2U6y2tJ3Yqx-UU35PQLAwWoRBRNg0EswoS0MmfT09P7VkfT-S2MVhcLrC-E02QjUlaDtcXJlfL41YpCZAFhERe_NSbyVfJfBykmZBD1BXAvn8wElgnn1pEu5GBWjRRwJQjkvavkWkq-hQhCu7vEmRVK2RLf2QBi-674WNaG7M2FFq6W4HI9uXm8GRgNh2Hh-_2DaqkrhH_kKf-e8QmR_nCCOjqmw1Y8ICCliS0wKbACA5hjpAykN8V_SWM_37LYqk0Yfo', rank: 2 },
      { id: '3', name: 'Yasmine', xp: 1800, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEP_TLmyVFjaWaNxAu8UyMUUtTSGatOhatiT0Mp8tAURXHtC8g4ek4E7sSUvqxlsejnI2vH8DUdoNJYV9MFFkQU-Bd9Y-xQw_9d-ZP9EoeuMxD88FgkoEnVrVIV2tUz6UH2oCU_dA99VqtE1hzQkSmtqrqvL1x4Y2bCWMd9MQuE7K6WdoUz7l0e3QWJxbzAkMjgAbctL76dZ28ZuK8N8a3KFZrI6mmkQBigwcpxz6aWoyDHQdFYpUvqpC0q3li40vZ9sFT_gDGXrg', rank: 3 },
      { id: '4', name: 'Ahmed', xp: 1450, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEnuCj82UkKXzGW0tKpWXPsCMVxp-ze2cDdCMYUcyGp-bxmqiPpfxq6WS0cLA0F_4fHZzo4EBdyjNNcqb9EcIdChW45pSIDd_OMNlxBs2UULMjeZb2S6M0FhkIqKFBdiqI4bNtjf7siSxvoJNR3P4LXULObMP_bndo_xMDfHHGdDqFrQyP4ULR99TUdOXKujPVQ3mYRW1jJmEkXQ4lBCWbjptm_vK9MKgBqWPRBIayk4fWtmzHlrXjpeDW1uLbJwRYWp5wCddpNOM', rank: 4, isCurrentUser: true },
    ]
  },
  {
    id: 'silver',
    name: 'Ligue Argent',
    tier: 'silver',
    timeLeft: 'Terminée',
    myRank: 12,
    players: []
  },
  {
    id: 'gold',
    name: 'Ligue Or',
    tier: 'gold',
    timeLeft: 'Bientôt',
    myRank: 0,
    players: []
  }
];

export default function LeagueScreen({ onSelectLeague, onCreateLeague }: LeagueScreenProps) {
  return (
    <div className="flex flex-col h-full bg-morocco-cream pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white border-b border-morocco-gold/10 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-black text-morocco-emerald font-headline">Ligue & Classement</h1>
          <button 
            onClick={onCreateLeague}
            className="bg-morocco-gold text-white p-2 rounded-full hover:scale-110 active:scale-95 transition-transform"
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="text-slate-500 text-sm">Gagnez des points pour grimper dans le classement !</p>
      </header>

      <main className="flex-grow p-6 space-y-6 overflow-y-auto">
        {/* Active League Highlight */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-black text-slate-400">Ligues en cours</h2>
          
          {MOCK_LEAGUES.map((league) => (
            <motion.div
              key={league.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLeague(league.id)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-morocco-gold/10 relative overflow-hidden group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner",
                    league.tier === 'bronze' ? "bg-amber-100 text-amber-700" :
                    league.tier === 'silver' ? "bg-slate-100 text-slate-500" : "bg-yellow-100 text-yellow-700"
                  )}>
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-morocco-emerald">{league.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Timer size={12} />
                      <span>{league.timeLeft}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Votre Rang</span>
                  <span className={cn(
                    "text-xl font-black",
                    league.myRank > 0 ? "text-morocco-gold" : "text-slate-300"
                  )}>
                    {league.myRank > 0 ? `#${league.myRank}` : '-'}
                  </span>
                </div>
              </div>

              {/* Player Avatars */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex -space-x-2">
                  {league.players.slice(0, 4).map((player) => (
                    <div 
                      key={player.id} 
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100"
                    >
                      <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {league.players.length > 4 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      +{league.players.length - 4}
                    </div>
                  )}
                  {league.players.length === 0 && (
                    <div className="text-xs text-slate-300 italic">Pas encore de participants</div>
                  )}
                </div>
                
                <ChevronRight size={20} className="text-slate-300 group-hover:text-morocco-emerald transition-colors" />
              </div>

              {/* Decorative accent */}
              <div className={cn(
                "absolute top-0 right-0 w-24 h-24 opacity-[0.03] -mr-8 -mt-8 rounded-full",
                league.tier === 'bronze' ? "bg-amber-700" :
                league.tier === 'silver' ? "bg-slate-700" : "bg-yellow-700"
              )} />
            </motion.div>
          ))}
        </section>

        {/* Info Card */}
        <div className="bg-morocco-emerald text-white p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-bold mb-1">Comment ça marche ?</h4>
            <p className="text-white/80 text-xs leading-relaxed">
              Terminez des défis et des leçons pour gagner de l'XP. 
              À la fin de la semaine, les meilleurs joueurs passent à la ligue supérieure !
            </p>
          </div>
          <Trophy size={80} className="absolute -bottom-4 -right-4 text-white/10 rotate-12" />
        </div>
      </main>
    </div>
  );
}
