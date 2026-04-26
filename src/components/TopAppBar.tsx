/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, Star, Menu } from 'lucide-react';

interface TopAppBarProps {
  stats: { xp: number; stars: number; level: number };
  onBack?: () => void;
  title?: string;
  showProgress?: boolean;
}

export default function TopAppBar({ stats, onBack, title = "Le Voyage", showProgress = true }: TopAppBarProps) {
  return (
    <header className="w-full top-0 sticky z-50 bg-morocco-cream/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-morocco-gold/10">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button onClick={onBack} className="p-2 hover:bg-morocco-emerald/10 rounded-full transition-colors">
            <ArrowLeft className="text-morocco-emerald" size={24} />
          </button>
        ) : (
          <div className="w-10 h-10 rounded-full border-2 border-morocco-gold/30 overflow-hidden shadow-sm">
            <img 
              alt="Avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEnuCj82UkKXzGW0tKpWXPsCMVxp-ze2cDdCMYUcyGp-bxmqiPpfxq6WS0cLA0F_4fHZzo4EBdyjNNcqb9EcIdChW45pSIDd_OMNlxBs2UULMjeZb2S6M0FhkIqKFBdiqI4bNtjf7siSxvoJNR3P4LXULObMP_bndo_xMDfHHGdDqFrQyP4ULR99TUdOXKujPVQ3mYRW1jJmEkXQ4lBCWbjptm_vK9MKgBqWPRBIayk4fWtmzHlrXjpeDW1uLbJwRYWp5wCddpNOM" 
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div>
          <h1 className="text-morocco-emerald font-headline font-bold tracking-tight text-lg leading-none">{title}</h1>
          {!onBack && <p className="text-morocco-gold arabic-font text-[10px] font-bold">الرحلة</p>}
        </div>
      </div>
      
      {showProgress && (
        <div className="flex-1 max-w-[120px] mx-4 hidden xs:block">
          <div className="h-2 w-full bg-morocco-gold/10 rounded-full overflow-hidden">
            <div className="h-full bg-morocco-gold w-[55%] rounded-full shadow-[0_0_8px_rgba(212,168,67,0.4)]" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="bg-morocco-gold/10 px-3 py-1 rounded-full flex items-center gap-2 border border-morocco-gold/20">
          <Star size={14} className="text-morocco-gold" fill="currentColor" />
          <span className="text-morocco-gold font-bold text-sm">{stats.stars}</span>
        </div>
        <button className="text-morocco-emerald hover:bg-morocco-gold/10 p-2 rounded-full transition-colors">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
