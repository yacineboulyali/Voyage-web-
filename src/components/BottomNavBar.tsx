/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapIcon, Trophy, User, LayoutGrid, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const tabs = [
    { id: 'explore', icon: LayoutGrid, label: 'Explore' },
    { id: 'league', icon: Trophy, label: 'Ligue' },
    { id: 'journey', icon: MapIcon, label: 'Parcours' },
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'settings', icon: Settings, label: 'Réglages' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-8 pb-6 pt-3 bg-white/95 backdrop-blur-xl border-t border-morocco-gold/10 rounded-t-[2.5rem] shadow-[0_-8px_32px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        if (tab.id === 'journey') {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 mb-4 scale-125 transition-all active:scale-110",
                isActive ? "bg-morocco-emerald text-white rounded-full shadow-lg ring-8 ring-white" : "text-slate-400 bg-white"
              )}
            >
              <Icon size={24} fill={isActive ? "currentColor" : "none"} />
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center text-slate-400 p-2 mb-2 transition-all hover:text-morocco-emerald active:scale-90"
          >
            <Icon size={24} color={isActive ? "var(--color-morocco-emerald)" : "currentColor"} />
            <span className={cn(
              "text-[10px] font-bold mt-1 uppercase tracking-wider",
              isActive ? "text-morocco-emerald" : "text-slate-400"
            )}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
